import { addKeyword } from "@builderbot/bot";
import { mechanicalFlow } from "../mechanicalFlow";

const ayBalanceo = addKeyword(["DHH18"])
  .addAnswer("", { capture: false }, async (ctx, { provider }) => {
    await provider.sendMessage(ctx.from, {
      type: "interactive",
      interactive: {
        type: "button",
        header: {
          type: "image",
          image: {
            link: "https://raw.githubusercontent.com/trading-algoritmic0/botw/main/public/assets/photo1.jpg"
          }
        },
        body: {
          text: "🔧 *Alineación y Balanceo*\n\n💲 *Precio:* $120.000 COP\n\n✅ Servicio especializado con alineación precisa y balanceo completo de llantas."
        },
        footer: {
          text: "TecniRacer - Taller aliado: TecniAlinea"
        },
        action: {
          buttons: [
            {
              type: "reply",
              reply: {
                id: "agendar_ayb",
                title: "📅 Agendar"
              }
            },
            {
              type: "reply",
              reply: {
                id: "regresar",
                title: "🔙 Regresar"
              }
            }
          ]
        }
      }
    });
  })
  .addAnswer("", { capture: true }, async (ctx, { gotoFlow, flowDynamic }) => {
    if (ctx.body === "📅 Agendar") {
      await flowDynamic("Perfecto, vamos a agendar tu cita para *Alineación y Balanceo*.");
      // Aquí puedes redirigir al flujo de agendamiento cuando esté disponible
      // return gotoFlow(appointmentsFlow);
    }

    if (ctx.body === "🔙 Regresar") {
      return gotoFlow(mechanicalFlow);
    }
  });

export { ayBalanceo };
