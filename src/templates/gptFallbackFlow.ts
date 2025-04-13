import { addKeyword } from '@builderbot/bot'
import OpenAI from 'openai'
import { config } from '../config'

const openai = new OpenAI({
  apiKey: config.ApiKey
})

export const gptFallbackFlow = addKeyword(['__FALLBACK__']) // Palabra clave segura
  .addAction(async (ctx) => {
    try {
      const completion = await openai.chat.completions.create({
        model: config.Model || 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Responde como un asistente claro, directo y útil.'
          },
          {
            role: 'user',
            content: ctx.body
          }
        ]
      })

      const reply = completion.choices[0].message?.content
      await ctx.sendText(reply || 'Lo siento, no pude responder con precisión.')
    } catch (error) {
      console.error('Error de OpenAI:', error)
      await ctx.sendText('⚠️ No pude conectarme a la IA en este momento.')
    }
  })
