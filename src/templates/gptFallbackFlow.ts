import { addKeyword } from '@builderbot/bot';
import OpenAI from 'openai';
import { config } from '../config';
import { menuFlow } from './menuFlow';
import { faqFlow } from './faqFlow';

const openai = new OpenAI({
  apiKey: config.ApiKey,
});

export const gptFallbackFlow = addKeyword(['__FALLBACK__'])
  .addAction(async (ctx, ctxFn) => {
    // Convertir el mensaje a minúsculas para uniformidad
    const message = ctx.body ? ctx.body.toLowerCase() : "";
    try {
      // Redirigir a menú si se detecta "menu" u "opciones"
      if (message.includes("menu") || message.includes("opciones")) {
        await ctxFn.reply("🔁 Te redirijo al menú de opciones...");
        return ctxFn.gotoFlow(menuFlow);
      }
      // Redirigir a FAQs si se detecta "faq"
      if (message.includes("faq")) {
        await ctxFn.reply("📚 Aquí están las preguntas frecuentes.");
        return ctxFn.gotoFlow(faqFlow);
      }
      // Llamada a la API de OpenAI
      const completion = await openai.chat.completions.create({
        model: config.Model || "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Responde como un asistente útil, claro y preciso.",
          },
          {
            role: "user",
            content: message,
          },
        ],
        temperature: 0.7,
      });
      const replyContent = completion?.choices?.[0]?.message?.content;
      if (!replyContent || typeof replyContent !== "string") {
        await ctxFn.reply("🤖 No pude generar una respuesta útil.");
      } else {
        await ctxFn.reply(replyContent);
      }
    } catch (error: any) {
      console.error("❌ GPT Fallback Error:", error);
      // Manejar respuesta de error de OpenAI si existe
      if (error.response && error.response.status) {
        const status = error.response.status;
        const msg =
          error.response.data?.error?.message ||
          "Error desconocido de la IA";
        await ctxFn.reply(`⚠️ Error ${status}: ${msg}`);
      } else if (error.message && error.message.includes("exceeded your current quota")) {
        await ctxFn.reply(
          "⚠️ Has excedido la cuota de OpenAI. Revisa tu plan y la facturación."
        );
      } else {
        await ctxFn.reply(
          "⚠️ Hubo un error al conectar con la IA. Intenta nuevamente."
        );
      }
    }
  });
