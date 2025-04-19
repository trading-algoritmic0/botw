import { addKeyword } from "@builderbot/bot";
import { mechanicalFlow } from "../mechanicalFlow";

const ayBalanceo = addKeyword(["DHH18"])
  .addAnswer(
    "", // sin texto, lo enviamos con sendButtons
    { capture: false },
    async (ctx, { provider }) => {
      await provider.sendButtons(ctx.from, {
        body: "🔧 *Alineación y balanceo*\n\n💲 *Precio:* $120.000 COP\n\n✅ Servicio especializado con alineación precisa y balanceo completo.",
        footer: "TecniRacer - Taller aliado: TecniAlinea",
        header: {
          type: "image",
          image: {
            link: "https://raw.githubusercontent.com/trading-algoritmic0/botw/main/public/assets/photo1.jpg",
          },
        },
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
