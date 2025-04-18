import { addKeyword } from "@builderbot/bot";
import { mechanicalFlow } from "../mechanicalFlow"; // para volver

const ayBalanceo = addKeyword(["DHH18"]).addAnswer(
  {
    body: {
      text: "*Alineación y balanceo*\n\n💲 Precio: $120.000 COP\n\n✅ Servicio de alineación con tecnología de precisión y balanceo completo de las llantas.",
    },
    buttons: [
      { body: "📅 Agendar" },
      { body: "🔙 Regresar" },
    ],
    header: {
      type: "image",
      image: {
        link: "https://raw.githubusercontent.com/trading-algoritmic0/botw/main/public/assets/photo1.jpg",
      },
    },
    footer: {
      text: "TecniRacer - Taller autorizado",
    },
  },
  { capture: true },
  async (ctx, { flowDynamic, gotoFlow }) => {
    if (ctx.body === "📅 Agendar") {
      await flowDynamic("Perfecto, vamos a agendar tu cita para Alineación y balanceo.");
      // return gotoFlow(appointmentsFlow); // se conecta más adelante
    }

    if (ctx.body === "🔙 Regresar") {
      return gotoFlow(mechanicalFlow);
    }
  }
);

export { ayBalanceo };
