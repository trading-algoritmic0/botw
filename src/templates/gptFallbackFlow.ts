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
      // Redirección por palabra clave
      if (message.includes("menu") || message.includes("opciones")) {
        await ctx.sendText("🔁 Te redirijo al menú de opciones...")
        return ctxFn.gotoFlow(menuFlow)
      }

      if (message.includes("faq")) {
        await ctx.sendText("📚 Aquí están las preguntas frecuentes.")
        return ctxFn.gotoFlow(faqFlow)
      }

      // Llamada segura a OpenAI
      const completion = await openai.chat.completions.create({
        model: config.Model || 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Responde como un asistente útil y preciso.'
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.7 // estabilidad en las respuestas
      })

      const reply = completion?.choices?.[0]?.message?.content

      if (!reply) {
        await ctx.sendText("🤖 No encontré una respuesta adecuada.")
      } else {
        await ctx.sendText(reply)
      }

    } catch (error: any) {
      // 🧠 Diagnóstico del error con OpenAI
      console.error('❌ GPT Fallback Error:', error)

      if (error.response) {
        const { status, data } = error.response
        console.error(`🧾 OpenAI Response Error [${status}]:`, data)
        await ctx.sendText(`⚠️ Error ${status}: ${data?.error?.message || "Fallo en la IA."}`)
      } else {
        await ctx.sendText('⚠️ Ocurrió un error inesperado. Intentalo más tarde.')
      }
    }
  })
