import { addKeyword } from '@builderbot/bot'
import OpenAI from 'openai'
import { config } from '../config'

const openai = new OpenAI({
  apiKey: config.ApiKey
})

export const gptFallbackFlow = addKeyword(/.*/) // 👈 esto captura cualquier mensaje de texto
  .addAction(async (ctx) => {
    try {
      const completion = await openai.chat.completions.create({
        model: config.Model || 'gpt-4o-mini-2024-07-18',
        messages: [
          {
            role: 'system',
            content: 'Responde como un asistente útil, amable y preciso.'
          },
          {
            role: 'user',
            content: ctx.body
          }
        ]
      })

      const reply = completion.choices[0].message?.content
      await ctx.sendText(reply || 'Lo siento, no pude responderte correctamente.')
    } catch (error) {
      console.error('Error al consultar OpenAI:', error)
      await ctx.sendText('⚠️ Ocurrió un error al generar la respuesta con IA.')
    }
  })
