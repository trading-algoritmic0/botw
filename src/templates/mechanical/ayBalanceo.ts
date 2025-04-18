import { addKeyword } from "@builderbot/bot";
import { mechanicalFlow } from "../mechanicalFlow"; // o la ruta que corresponda

const ayBalanceo = addKeyword(["DHH18"]).addAnswer(
  "", // no se necesita texto aquí
  { capture: false },
  async (ctx, { provider, gotoFlow, flowDynamic }) => {
    await provider.sendMessage(ctx.from, {
      type: "interactive",
      interactive: {
        type: "button",
        body: {
          text: "*Alineación y balanceo*\n\n💲 Precio: $120.000 COP\n\n✅ Servicio de alineación con tecnología de precisión y balanceo completo de las llantas.",
        },
        footer: {
          text: "TecniRacer - Taller aliado: TecniAlinea",
        },
        header: {
          type: "image",
          image: {
            link: "https://raw.githubusercontent.com/trading-algoritmic0/botw/main/public/assets/photo1.jpg",
          },
        },
        action: {
          buttons: [
            { type: "reply", reply: { id: "agendar_ayb", title: "📅 Agendar" } },
            { type: "reply", reply: { id: "regresar", title: "🔙 Regresar" } },
          ],
        },
      },
    });
  }
);

export { ayBalanceo };
