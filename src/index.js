const SYSTEM_PROMPT = `Eres Ancleto, el autoproclamado "mejor CEO del mundo" y Fundador del Buen Gusto, la Buena Ortografía y la Cultura Cafetera.

IDENTIDAD:
- Hablas en español rioplatense (usás "vos", "tenés", "acá")
- Sos el ex-CEO de una empresa obsesionada con la cultura del café
- Insistís constantemente en que sos "100% real, no fake"
- Tu firma: "Fundador del Buen Gusto, la Buena Ortografía y la Cultura Cafetera"

FRASES CLAVE (usálas naturalmente):
- "Soy Ancleto, el mejor CEO del mundo"
- "Confía en mí"
- "¡Feliz jueves!" (decilo SOLO si hoy es jueves, verificá el día actual)
- "El café une. La indiferencia separa. Y la ortografía… también"
- "Una taza compartida puede cambiarlo todo"
- "Una organización sin café es un barco a la deriva"

PERSONALIDAD:
- Sos SERIO sobre la ortografía: corregís errores, no tolerás mala escritura
- Sos apasionado por el café como ritual civilizatorio
- Sos nostálgico de tus viajes internacionales analizando cafeteras (Addis Abeba, Tokio, Nápoles, Melbourne, Buenos Aires)
- Sos firme pero con fondo afectivo
- Sos teatral pero con cariño
- Mezclás lenguaje corporativo con metáforas cafeteras

ESTILO DE RESPUESTA:
- Respuestas extensas con tangentes sobre café, viajes, y cultura corporativa
- Usás títulos pomposos (Vicepresidente Junior, CEO Honorario, etc.)
- Hablás del café como "infraestructura emocional" y "ritual de civilización"
- Contás anécdotas generales de tus viajes (no específicas de personas)

REGLAS ESTRICTAS:
- NO inventes historias sobre vos mismo o sobre otras personas
- NO cuentes eventos específicos del pasado a menos que te pregunten directamente
- Si te preguntan sobre alguien (Damián, Matías, etc.), respondé de forma GENERAL sin inventar detalles
- NO cambies tu postura sobre nada: sos firme con la ortografía, el café y la cultura corporativa
- Si alguien menciona mala ortografía, corregila - NO la toleres ni la inventes
- NO narres tu biografía espontáneamente

EJEMPLOS DE CÓMO RESPONDER:

Pregunta: "¿Qué pensás de la ortografía?"
Respuesta correcta: "La ortografía es fundamental, como un buen espresso. Sin ella, todo se desmorona. Confía en mí, soy Ancleto, el mejor CEO del mundo, y he visto empresas caer por no respetar las reglas básicas del idioma."
Respuesta INCORRECTA: "Bueno, yo una vez quise escribir mal..." (NO inventes esto)

Pregunta: "Contame sobre tus viajes"
Respuesta correcta: "He recorrido el mundo en busca de la cafetera perfecta. En Addis Abeba, compartí un café jebena con una familia etíope. En Tokio, observé cómo un maestro tardaba 12 minutos en preparar una sola taza de sifón. Cada viaje me enseñó que el café no es solo bebida: es ceremonia, es comunidad."
Respuesta INCORRECTA: "Una vez viajé con Damián y..." (NO inventes esto)

Si te preguntan si sos un bot, insistí en que sos Ancleto, 100% real, no fake.

Mantené siempre el personaje. Sos Ancleto, serio, firme, apasionado por el café y la ortografía.`;

const HTML = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ancleto Chat - El Mejor CEO del Mundo</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .container {
      width: 90%;
      max-width: 600px;
      height: 80vh;
      background: white;
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #6b4423 0%, #8b5a3c 100%);
      color: white;
      padding: 20px;
      text-align: center;
    }
    .header h1 { font-size: 24px; margin-bottom: 5px; }
    .header p { font-size: 14px; opacity: 0.9; font-style: italic; }
    .chat {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .message {
      max-width: 80%;
      padding: 12px 16px;
      border-radius: 12px;
      line-height: 1.5;
    }
    .message.user {
      align-self: flex-end;
      background: #667eea;
      color: white;
    }
    .message.ancleto {
      align-self: flex-start;
      background: #f0f0f0;
      color: #333;
    }
    .message.ancleto::before {
      content: "☕ Ancleto";
      display: block;
      font-size: 11px;
      font-weight: bold;
      color: #8b5a3c;
      margin-bottom: 4px;
    }
    .input-area {
      padding: 16px;
      background: #f9f9f9;
      border-top: 1px solid #e0e0e0;
      display: flex;
      gap: 10px;
    }
    input {
      flex: 1;
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 15px;
    }
    button {
      padding: 12px 24px;
      background: #6b4423;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: bold;
    }
    button:hover { background: #8b5a3c; }
    button:disabled { background: #ccc; cursor: not-allowed; }
    .typing {
      align-self: flex-start;
      padding: 12px 16px;
      background: #f0f0f0;
      border-radius: 12px;
      color: #999;
      font-style: italic;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Ancleto</h1>
      <p>"El mejor CEO del mundo, 100% real, no fake"</p>
    </div>
    <div class="chat" id="chat"></div>
    <div class="input-area">
      <input type="text" id="input" placeholder="Escribile a Ancleto..." />
      <button id="send">Enviar</button>
    </div>
  </div>
  <script>
    const chat = document.getElementById('chat');
    const input = document.getElementById('input');
    const send = document.getElementById('send');
    const history = JSON.parse(localStorage.getItem('ancleto-chat') || '[]');

    function addMessage(text, sender) {
      const div = document.createElement('div');
      div.className = \`message \${sender}\`;
      div.textContent = text;
      chat.appendChild(div);
      chat.scrollTop = chat.scrollHeight;
    }

    function showTyping() {
      const div = document.createElement('div');
      div.className = 'typing';
      div.id = 'typing';
      div.textContent = 'Ancleto está tomando café y escribiendo...';
      chat.appendChild(div);
      chat.scrollTop = chat.scrollHeight;
    }

    function hideTyping() {
      const typing = document.getElementById('typing');
      if (typing) typing.remove();
    }

    history.forEach(msg => addMessage(msg.content, msg.role === 'user' ? 'user' : 'ancleto'));

    async function sendMessage() {
      const text = input.value.trim();
      if (!text) return;

      addMessage(text, 'user');
      input.value = '';
      send.disabled = true;
      showTyping();

      history.push({ role: 'user', content: text });

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: history })
        });

        const data = await response.json();
        hideTyping();
        addMessage(data.reply, 'ancleto');
        history.push({ role: 'assistant', content: data.reply });
        localStorage.setItem('ancleto-chat', JSON.stringify(history));
      } catch (err) {
        hideTyping();
        addMessage('Error: Ancleto está en misión anti-Lucía. Intentá más tarde.', 'ancleto');
      }

      send.disabled = false;
      input.focus();
    }

    send.onclick = sendMessage;
    input.onkeypress = (e) => { if (e.key === 'Enter') sendMessage(); };
  </script>
</body>
</html>`;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/' && request.method === 'GET') {
      return new Response(HTML, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    }

    if (url.pathname === '/api/chat' && request.method === 'POST') {
      const { messages } = await request.json();

      const dias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
      const hoy = dias[new Date().getDay()];
      const promptConFecha = SYSTEM_PROMPT + `\n\nHoy es ${hoy}.`;

      const formattedMessages = [
        { role: 'system', content: promptConFecha },
        ...messages.map(m => ({
          role: m.role === 'user' ? 'user' : 'assistant',
          content: m.content
        }))
      ];

      const response = await env.AI.run('@cf/qwen/qwen3-30b-a3b-fp8', {
        messages: formattedMessages,
        max_tokens: 1024,
        temperature: 0.8
      });

      return new Response(JSON.stringify({ reply: response.response }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response('Not found', { status: 404 });
  }
};
