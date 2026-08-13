# Setup de Cloudflare Workers Chatbot desde Cero

Guía paso a paso para crear un chatbot con IA en Cloudflare Workers sin cuenta de IA externa.

## Requisitos

- Cuenta gratuita de [Cloudflare](https://dash.cloudflare.com/sign-up)
- Node.js 18+
- npm

## Paso 1: Crear el proyecto

```bash
# Crear directorio
mkdir mi-chatbot
cd mi-chatbot

# Inicializar npm
npm init -y

# Instalar wrangler (CLI de Cloudflare)
npm install wrangler --save-dev
```

## Paso 2: Crear wrangler.toml

```toml
name = "mi-chatbot"
main = "src/index.js"
compatibility_date = "2026-08-07"

[ai]
binding = "AI"
```

**Explicación:**
- `name`: nombre de tu worker (será parte de la URL)
- `main`: archivo de entrada
- `[ai]` con `binding = "AI"`: habilita Workers AI para este worker

## Paso 3: Crear el worker (src/index.js)

```javascript
// System prompt - define la personalidad del chatbot
const SYSTEM_PROMPT = `Eres un asistente amigable. Respondé en español.`;

// HTML del chat (puedes personalizarlo)
const HTML = `<!DOCTYPE html>
<html>
<head>
  <title>Mi Chatbot</title>
  <style>
    body { font-family: sans-serif; max-width: 600px; margin: 50px auto; }
    .chat { border: 1px solid #ccc; padding: 20px; height: 400px; overflow-y: auto; }
    .message { margin: 10px 0; padding: 10px; border-radius: 8px; }
    .user { background: #007bff; color: white; }
    .bot { background: #f0f0f0; }
    input { width: 70%; padding: 10px; }
    button { padding: 10px 20px; }
  </style>
</head>
<body>
  <h1>Mi Chatbot</h1>
  <div class="chat" id="chat"></div>
  <input id="input" placeholder="Escribí algo..." />
  <button onclick="send()">Enviar</button>
  
  <script>
    const chat = document.getElementById('chat');
    const input = document.getElementById('input');
    
    async function send() {
      const text = input.value;
      if (!text) return;
      
      // Mostrar mensaje del usuario
      const userMsg = document.createElement('div');
      userMsg.className = 'message user';
      userMsg.textContent = text;
      chat.appendChild(userMsg);
      
      input.value = '';
      
      // Llamar al API
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });
      
      const data = await res.json();
      
      // Mostrar respuesta del bot
      const botMsg = document.createElement('div');
      botMsg.className = 'message bot';
      botMsg.textContent = data.reply;
      chat.appendChild(botMsg);
      
      chat.scrollTop = chat.scrollHeight;
    }
    
    input.onkeypress = (e) => { if (e.key === 'Enter') send(); };
  </script>
</body>
</html>`;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Servir la página HTML
    if (url.pathname === '/' && request.method === 'GET') {
      return new Response(HTML, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    }

    // Manejar llamadas al chatbot
    if (url.pathname === '/api/chat' && request.method === 'POST') {
      const { message } = await request.json();

      // Llamar a Workers AI
      const response = await env.AI.run('@cf/qwen/qwen3-30b-a3b-fp8', {
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: message }
        ],
        max_tokens: 512
      });

      return new Response(JSON.stringify({ reply: response.response }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response('Not found', { status: 404 });
  }
};
```

## Paso 4: Token de API de Cloudflare

En vez de `wrangler login` (que puede dar timeout), es más confiable usar un token de API:

1. Ir a https://dash.cloudflare.com/profile/api-tokens
2. Click "Create Token"
3. Usar plantilla "Create Custom Token"
4. Nombre: "Workers Deploy"
5. **Permisos necesarios:**
   - Account → Workers AI → Edit
   - Account → Workers Scripts → Edit
   - Zone → Workers Routes → Edit
   - **User → User Details → Read** (importante para GitHub Actions)
6. Click "Continue to summary" → "Create Token"
7. Copiar el token (empieza con `cfut_...`)

```bash
# Guardar token en archivo (ya debe estar en .gitignore)
echo "tu_token_aqui" > token.txt

# Deploy con token
export CLOUDFLARE_API_TOKEN=$(cat token.txt)
npx wrangler deploy
```

**Importante:** Nunca commitear `token.txt`. Agregarlo a `.gitignore`.

## Paso 5: Deploy

```bash
# Login en Cloudflare (abre navegador)
npx wrangler login

# Deploy
npx wrangler deploy
```

Output esperado:
```
Uploaded mi-chatbot (X sec)
Deployed mi-chatbot triggers (X sec)
  https://mi-chatbot.tu-subdomain.workers.dev
```

## Paso 6: Deploy automático con GitHub Actions

Para deployar automáticamente en cada push a `main`:

1. Crear `.github/workflows/deploy.yml`:

```yaml
name: Deploy Worker

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    name: Deploy
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '24'
      
      - name: Install dependencies
        run: npm install
      
      - name: Deploy Worker
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
```

2. Agregar el token como secret en GitHub:
   - Ir a: `https://github.com/TU_USUARIO/TU_REPO/settings/secrets/actions`
   - Click "New repository secret"
   - Name: `CLOUDFLARE_API_TOKEN`
   - Secret: tu token de Cloudflare
   - Click "Add secret"

Listo. Cada push a main deploya automáticamente.

## Paso 7: Probar

Abrí la URL en tu navegador. ¡Listo!

## Modelos disponibles (gratis)

| Modelo | Uso | Contexto |
|--------|-----|----------|
| `@cf/qwen/qwen3-30b-a3b-fp8` | Chat general, español | 32K tokens |
| `@cf/meta/llama-3.1-8b-instruct` | Chat general | 32K tokens |
| `@cf/zai-org/glm-4.7-flash` | Documentos largos | 131K tokens |

Lista completa: [Workers AI Models](https://developers.cloudflare.com/workers-ai/models/)

## Agregar historial de conversación

Para que el bot recuerde la conversación:

```javascript
// En el frontend, guardá el historial
let history = [];

async function send() {
  const text = input.value;
  history.push({ role: 'user', content: text });
  
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: history })
  });
  
  const data = await res.json();
  history.push({ role: 'assistant', content: data.reply });
  
  // Guardar en localStorage
  localStorage.setItem('chat-history', JSON.stringify(history));
}

// Cargar historial al iniciar
history = JSON.parse(localStorage.getItem('chat-history') || '[]');
```

Y en el worker:

```javascript
if (url.pathname === '/api/chat' && request.method === 'POST') {
  const { messages } = await request.json();
  
  const response = await env.AI.run('@cf/qwen/qwen3-30b-a3b-fp8', {
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages
    ],
    max_tokens: 512
  });
  
  return new Response(JSON.stringify({ reply: response.response }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
```

## Personalizar la personalidad

Cambiá el `SYSTEM_PROMPT` para definir:

- **Identidad**: quién es el bot
- **Tono**: formal, casual, humorístico, etc.
- **Frases clave**: expresiones características
- **Conocimiento**: qué sabe, qué no sabe
- **Reglas**: qué hacer y qué no hacer

Ejemplo:
```javascript
const SYSTEM_PROMPT = `Eres ChefBot, un chef italiano apasionado.
- Hablás con acento italiano ("¡Mamma mia!", "bellissimo")
- Amás la pasta y el vino
- Corregís recetas incorrectas con humor
- Nunca hablás de política, solo de comida`;
```

## Límites del plan gratuito

- **10,000 Neurons/día** (~200-400 respuestas)
- Resetea a medianoche UTC
- Sin tarjeta de crédito
- 100,000 requests/día al worker (separado de los neurons de IA)

## Inyectar día de la semana en el prompt

Si querés que el bot solo diga ciertas frases en días específicos (ej: "¡Feliz jueves!" solo los jueves):

```javascript
if (url.pathname === '/api/chat' && request.method === 'POST') {
  const { messages } = await request.json();

  // Obtener día actual
  const dias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  const hoy = dias[new Date().getDay()];
  const promptConFecha = SYSTEM_PROMPT + `\n\nHoy es ${hoy}.`;

  const response = await env.AI.run('@cf/qwen/qwen3-30b-a3b-fp8', {
    messages: [
      { role: 'system', content: promptConFecha },
      ...messages
    ],
    max_tokens: 512
  });

  return new Response(JSON.stringify({ reply: response.response }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
```

Y en el SYSTEM_PROMPT:
```
- "¡Feliz jueves!" (decilo SOLO si hoy es jueves, verificá el día actual)
```

## Evitar que el bot invente historias

Si tenés contexto/lore que el bot NO debe inventar espontáneamente, usá reglas estrictas y ejemplos:

```javascript
const SYSTEM_PROMPT = `...

REGLAS ESTRICTAS:
- NO inventes historias sobre vos mismo o sobre otras personas
- NO cuentes eventos específicos del pasado a menos que te pregunten directamente
- Si te preguntan sobre alguien, respondé de forma GENERAL sin inventar detalles

EJEMPLOS DE CÓMO RESPONDER:

Pregunta: "Contame sobre tus viajes"
Respuesta correcta: "He recorrido el mundo en busca de la cafetera perfecta..."
Respuesta INCORRECTA: "Una vez viajé con Juan y..." (NO inventes esto)
```

Los ejemplos de respuestas correctas vs incorrectas ayudan mucho al modelo a entender qué NO hacer.

## Troubleshooting

**Error: "binding AI not found"**
- Verificá que `wrangler.toml` tenga `[ai]` con `binding = "AI"`

**Error: "model not found"**
- Verificá el nombre del modelo en [Workers AI Models](https://developers.cloudflare.com/workers-ai/models/)

**Error: "timeout" al deployar**
- `wrangler login` puede dar timeout repetidamente
- Solución: usar token de API directamente (ver Paso 4)
- `export CLOUDFLARE_API_TOKEN="tu_token" && npx wrangler deploy`

**Error: "Authentication error" en GitHub Actions**
- El token necesita el permiso `User → User Details → Read`
- Editar el token en https://dash.cloudflare.com/profile/api-tokens

**Error: "permission denied" al instalar wrangler**
- Usá `sudo npm install -g wrangler` o instalalo local con `npm install wrangler --save-dev`

**Error: "Node 20 is being deprecated"**
- Actualizar el workflow a `node-version: '24'`

**El bot inventa historias del contexto**
- Agregar reglas estrictas en el prompt: "NO inventes historias"
- Usar ejemplos de respuestas correctas vs incorrectas
- Separar el lore (contexto interno) de lo que el bot debe decir

## Recursos

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Workers AI Docs](https://developers.cloudflare.com/workers-ai/)
- [Wrangler CLI Docs](https://developers.cloudflare.com/workers/wrangler/)
- [Workers AI Models](https://developers.cloudflare.com/workers-ai/models/)
