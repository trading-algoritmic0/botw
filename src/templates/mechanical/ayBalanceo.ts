import { addKeyword } from "@builderbot/bot";
import { mechanicalFlow } from "../mechanicalFlow";

const ayBalanceo = addKeyword()
  .addAnswer(
    "", // sin texto inicial
    { capture: false },
    async (ctx, { provider }) => {
      // Enviar imagen
      await provider.sendImage(ctx.from, {
        url: "https://raw.githubusercontent.com/trading-algoritmic0/botw/main/public/assets/photo1.jpg",
        caption: "🔧 *Alineación y balanceo*",
      });

      // Enviar botones
      await provider.sendButtons(ctx.from, {
        body: "💲 *Precio:* $120.000 COP\n\n✅ Servicio especializado con alineación precisa y balanceo completo.",
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
        // return gotoFlow(appointmentsFlow);
      }

      if (ctx.body === "🔙 Regresar") {
        return gotoFlow(mechanicalFlow);
      }
    }
  );

export { ayBalanceo };
