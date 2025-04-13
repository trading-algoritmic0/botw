import { addKeyword } from '@builderbot/bot'
import OpenAI from 'openai'
import { config } from '../config'
import { menuFlow } from './menuFlow'
import { faqFlow } from './faqFlow'

const openai = new OpenAI({
  apiKey: config.ApiKey
})

export const gptFallbackFlow = addKeyword(['__FALLBACK__'])
  .addAction(async (ctx, ctxFn) => {
    const message = ctx.body.toLowerCase()

    try {
      // 🔁 Redirección por palabra clave
      if (message.includes("menu") || message.includes("opciones")) {
        await ctx.sendText("🔁 Te redirijo al menú de opciones...")
        return ctxFn.gotoFlow(menuFlow)
      }

      if (message.includes("faq")) {
        await ctx.sendText("📚 Aquí están las preguntas frecuentes.")
        return ctxFn.gotoFlow(faqFlow)
      }

      // 🤖 Llamada segura a OpenAI
      const completion = await openai.chat.completions.create({
        model: config.Model || 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Responde como un asistente útil, claro y preciso.'
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.7
      })

      const reply = completion?.choices?.[0]?.message?.content

      if (!reply || typeof reply !== 'string') {
        await ctx.sendText("🤖 No pude generar una respuesta útil.")
      } else {
        await ctx.sendText(reply)
      }

    } catch (error: any) {
      console.error('❌ GPT Fallback Error:', error)

      if (error.response && error.response.status) {
        const status = error.response.status
        const message = error.response.data?.error?.message || "Error desconocido de la IA"
        await ctx.sendText(`⚠️ Error ${status}: ${message}`)
      } else {
        await ctx.sendText('⚠️ Hubo un error al conectar con la IA. Intenta nuevamente.')
      }
    }
  })
