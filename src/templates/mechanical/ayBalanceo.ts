import { addKeyword } from "@builderbot/bot";
import { mechanicalFlow } from "../mechanicalFlow";

const ayBalanceo = addKeyword(["DHH18"])
  .addAnswer(
    "", // sin texto
    { capture: false },
    async (ctx, { provider }) => {
      await provider.sendButtons(ctx.from, {
        body: "🔧 *Alineación y Balanceo*\n\n💲 *Precio:* $120.000 COP\n\n✅ Servicio especializado con alineación precisa y balanceo completo.",
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
        await flowDynamic("Perfecto, vamos a agendar tu cita para *Alineación y Balanceo*.");
        // return gotoFlow(appointmentsFlow);
      }

      if (ctx.body === "🔙 Regresar") {
        return gotoFlow(mechanicalFlow);
      }
    }
  );

export { ayBalanceo };
