# AncletoChat

Chatbot que simula a **Ancleto**, el autoproclamado "mejor CEO del mundo" y obsesionado con la cultura del café.

## Características

- Personalidad única con tono rioplatense y metáforas cafeteras
- Respuestas en español con estilo teatral pero cariñoso
- Deploy gratuito en Cloudflare Workers
- Usa Cloudflare Workers AI (modelo Qwen3, gratis)
- Sin base de datos - historial en localStorage del navegador
- Sin API keys de terceros - todo dentro de tu cuenta de Cloudflare

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
│   └── index.js          # Worker + UI + prompt de Ancleto
├── wrangler.toml         # Configuración de Cloudflare
├── package.json          # Dependencies (solo wrangler)
└── Contexto/             # Lore y ejemplos de emails de Ancleto
```

## Deploy

```bash
# Instalar dependencias
npm install

# Login en Cloudflare
npx wrangler login

# Deploy
npx wrangler deploy
```

Tu chatbot estará en: `https://ancleto-chatbot.<tu-subdomain>.workers.dev`

## Uso gratuito

- **10,000 Neurons/día** (~200-400 respuestas de chat)
- Resetea a medianoche UTC
- No requiere tarjeta de crédito
- Sin límites de tiempo

## Personalización

Editá el `SYSTEM_PROMPT` en `src/index.js` para cambiar:
- Frases características
- Tono y estilo
- Lore interno
- Comportamiento en conversaciones

## Licencia

MIT
