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
        await ctx.sendText("🔄 Te redirijo al menú de opciones...")
        return ctxFn.gotoFlow(menuFlow)
      }

      if (message.includes("faq")) {
        await ctx.sendText("📚 Aquí están las preguntas frecuentes.")
        return ctxFn.gotoFlow(faqFlow)
      }

      // OpenAI
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
        ]
      })

      const reply = completion.choices?.[0]?.message?.content
      await ctx.sendText(reply || '🤖 No pude generar una respuesta.')

    } catch (error: any) {
      console.error('🔥 GPT Fallback Error:', error)
      await ctx.sendText('⚠️ No pude responder en este momento.')
    }
  })
