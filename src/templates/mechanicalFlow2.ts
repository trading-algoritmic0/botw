import { addKeyword } from "@builderbot/bot";
import { mechanicalFlow } from "./mechanicalFlow";

const mechanicalFlow2 = addKeyword(["mecanica_general2"])
  .addAnswer(
    "Aquí tienes más servicios:",
    { capture: false },
    async (ctx, { provider }) => {
      const list = {
        header: { type: "text", text: "Más Servicios TecniRacer" },
        body: { text: "Selecciona uno de los nuevos servicios 👇" },
        footer: { text: "🔙 Opción “Volver” para regresar" },
        action: {
          button: "Más Servicios",
          sections: [
            {
              title: "Servicios Extra 🔩",
              rows: [
                { id: "ZXXY15", title: "Revisión de frenos hidráulicos", description: "Taller BrakeMaster" },
                { id: "ZXXY14", title: "Pulido de carrocería", description: "Taller PolishPros" },
                { id: "ZXXY13", title: "Instalación de turbo", description: "Taller TurboBoost" },
                { id: "ZXXY12", title: "Revisión de aire acondicionado", description: "Taller CoolAir" },
                { id: "VOLVER", title: "🔙 Volver al menú", description: "Regresar al inicio de servicios" },
              ],
            },
          ],
        },
      };

      await provider.sendList(ctx.from, list);
    }
  )
  .addAnswer(
    "", 
    { capture: true },
    async (ctx, { flowDynamic, gotoFlow }) => {
      // Si pulsa “Volver” volvemos al primer flujo
      if (ctx.id === "VOLVER") {
        return gotoFlow(mechanicalFlow);
      }

      // Cualquier otro servicio:
      await flowDynamic(`✅ Has seleccionado *${ctx.body}*`);
      await flowDynamic("¿Deseás agendar una cita para este servicio?");
      await flowDynamic("📆 Responde *sí* para continuar o *no* para volver al menú.");
    }
  );

export { mechanicalFlow2 };
