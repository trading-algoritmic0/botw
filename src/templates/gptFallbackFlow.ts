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
    // Aseguramos que si ctx.body existe, lo pasamos a minúsculas
    const message = ctx.body ? ctx.body.toLowerCase() : "";
    try {
      // Si el mensaje contiene "menu" o "opciones", redirigimos al menuFlow.
      if (message.includes("menu") || message.includes("opciones")) {
        await ctxFn.sendText("🔁 Te redirijo al menú de opciones...");
        return ctxFn.gotoFlow(menuFlow);
      }
      // Si contiene "faq", redirigimos al faqFlow.
      if (message.includes("faq")) {
        await ctxFn.sendText("📚 Aquí están las preguntas frecuentes.");
        return ctxFn.gotoFlow(faqFlow);
      }
      // Llamada a la API de OpenAI con un prompt definido.
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
      const reply = completion?.choices?.[0]?.message?.content;
      if (!reply || typeof reply !== "string") {
        await ctxFn.sendText("🤖 No pude generar una respuesta útil.");
      } else {
        await ctxFn.sendText(reply);
      }
    } catch (error: any) {
      console.error("❌ GPT Fallback Error:", error);
      // Si OpenAI devuelve una respuesta de error que incluye status y mensaje:
      if (error.response && error.response.status) {
        const status = error.response.status;
        const msg =
          error.response.data?.error?.message ||
          "Error desconocido de la IA";
        await ctxFn.sendText(`⚠️ Error ${status}: ${msg}`);
      } else if (
        error.message &&
        error.message.includes("exceeded your current quota")
      ) {
        await ctxFn.sendText(
          "⚠️ Has excedido la cuota de OpenAI. Revisa tu plan y la facturación."
        );
      } else {
        await ctxFn.sendText(
          "⚠️ Hubo un error al conectar con la IA. Intenta nuevamente."
        );
      }
    }
  });
