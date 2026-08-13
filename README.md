# AncletoChat

Chatbot que simula a **Ancleto**, el autoproclamado "mejor CEO del mundo" y obsesionado con la cultura del café.

## Características

- Personalidad única con tono rioplatense y metáforas cafeteras
- Respuestas en español con estilo teatral pero cariñoso
- Deploy gratuito en Cloudflare Workers
- Usa Cloudflare Workers AI (modelo Qwen3, gratis)
- Sin base de datos - historial en localStorage del navegador
- Sin API keys de terceros - todo dentro de tu cuenta de Cloudflare
- **Deploy automático con GitHub Actions** en cada push a main
- Solo dice "¡Feliz jueves!" cuando realmente es jueves

## Demo

**https://ancleto-chatbot.lucasbonch.workers.dev**

## Stack

- **Runtime**: Cloudflare Workers
- **IA**: Cloudflare Workers AI (`@cf/qwen/qwen3-30b-a3b-fp8`)
- **Frontend**: HTML/CSS/JS vanilla (todo en un solo archivo)
- **Config**: wrangler.toml

## Estructura

```
.
├── src/
│   └── index.js              # Worker + UI + prompt de Ancleto
├── .github/
│   └── workflows/
│       └── deploy.yml        # GitHub Actions para deploy automático
├── wrangler.toml             # Configuración de Cloudflare
├── package.json              # Dependencies (solo wrangler)
└── Contexto/                 # Lore y ejemplos de emails de Ancleto
```

## Deploy

### Deploy manual

```bash
# Instalar dependencias
npm install

# Crear token de API en Cloudflare
# Ir a: https://dash.cloudflare.com/profile/api-tokens
# Crear token con permisos:
#   - Account → Workers AI → Edit
#   - Account → Workers Scripts → Edit
#   - Zone → Workers Routes → Edit
#   - User → User Details → Read

# Guardar token en token.txt (ya está en .gitignore)
echo "tu_token_aqui" > token.txt

# Deploy con token
export CLOUDFLARE_API_TOKEN=$(cat token.txt)
npx wrangler deploy
```

Tu chatbot estará en: `https://ancleto-chatbot.<tu-subdomain>.workers.dev`

### Deploy automático con GitHub Actions

Cada push a `main` deploya automáticamente:

1. Crear el workflow en `.github/workflows/deploy.yml`
2. Agregar el token de Cloudflare como secret en GitHub:
   - Ir a: `https://github.com/TU_USUARIO/TU_REPO/settings/secrets/actions`
   - Click "New repository secret"
   - Name: `CLOUDFLARE_API_TOKEN`
   - Secret: tu token de Cloudflare
   - Click "Add secret"

Listo. Cada push a main ahora deploya automáticamente.

## Uso gratuito

- **10,000 Neurons/día** (~200-400 respuestas de chat)
- Resetea a medianoche UTC
- No requiere tarjeta de crédito
- Sin límites de tiempo

## Troubleshooting

### Error: "Authentication error" en GitHub Actions
El token de Cloudflare necesita el permiso `User → User Details → Read`. Editar el token en https://dash.cloudflare.com/profile/api-tokens y agregar ese permiso.

### Error: "timeout" al deployar
Si `npx wrangler login` da timeout repetidamente, usar token de API directamente:
```bash
export CLOUDFLARE_API_TOKEN="tu_token"
npx wrangler deploy
```

### Node 20 deprecado
El workflow usa Node 24. Si ves warnings sobre Node 20, actualizar `node-version: '24'` en el workflow.

## Notas importantes

- **token.txt** está en `.gitignore` - nunca commitear el token
- El prompt de Ancleto está diseñado para NO inventar historias del contexto
- Solo dice "¡Feliz jueves!" cuando realmente es jueves (el worker inyecta el día actual)
- El modelo Qwen3-30B-A3B es fuerte en español y gratis en el tier gratuito

## Personalización

Editá el `SYSTEM_PROMPT` en `src/index.js` para cambiar:
- Frases características
- Tono y estilo
- Lore interno
- Comportamiento en conversaciones

## Licencia

MIT
