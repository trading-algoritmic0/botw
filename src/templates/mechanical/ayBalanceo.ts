import { addKeyword } from "@builderbot/bot";
import { mechanicalFlow } from "../mechanicalFlow";

const ayBalanceo = addKeyword(["DHH18"])
  .addAnswer(
    "", // sin texto, todo se maneja en la función
    { capture: false },
    async (ctx, { provider }) => {
      // 1. Enviar imagen con descripción
      await provider.sendImage(ctx.from, {
        url: "https://raw.githubusercontent.com/trading-algoritmic0/botw/main/public/assets/photo1.jpg",
        caption: "🔧 *Alineación y balanceo*",
      });

      // 2. Enviar botones interactivos
      await provider.sendButtons(ctx.from, {
        body: "💲 *Precio:* $120.000 COP\n\n✅ Servicio con alineación precisa y balanceo completo de llantas.",
        footer: "TecniRacer - Taller aliado: TecniAlinea",
        buttons: [
          { body: "📅 Agendar" },
          { body: "🔙 Regresar" },
        ],
      });
    }
  )
  .addAnswer(
    "",
    { capture: true },
    async (ctx, { gotoFlow, flowDynamic }) => {
      if (ctx.body === "📅 Agendar") {
        await flowDynamic("Perfecto, vamos a agendar tu cita para *Alineación y balanceo*.");
        // return gotoFlow(appointmentsFlow); // cuando esté listo
      }

      if (ctx.body === "🔙 Regresar") {
        return gotoFlow(mechanicalFlow);
      }
    }
  );

export { ayBalanceo };
