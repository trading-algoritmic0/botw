import { addKeyword } from "@builderbot/bot";
import { mechanicalFlow2 } from "./mechanicalFlow2";

const mechanicalFlow = addKeyword(["mecanica_general"])
  .addAnswer(
    'Por favor selecciona una opción:',
    { capture: false },
    async (ctx, { provider }) => {
      const list = {
        header: { type: "text", text: "Servicio mecánico TecniRacer" },
        body:   { text: "¿En qué podemos ayudarte hoy?" },
        footer: { text: "✅ Selecciona una opción" },
        action: {
          button: "Servicios",
          sections: [
            {
              title: "Sede Principal 🔧",
              rows: [
                { id: "PNDM98", title: "Cambio de aceite",             description: "En sede principal" },
                { id: "PNDM97", title: "Revisión frenos",             description: "En sede principal" },
                { id: "PNDM96", title: "Diagnóstico electrónico",     description: "En sede principal" },
                { id: "PNDM95", title: "Revisión suspensión",         description: "En sede principal" },
                { id: "PNDM94", title: "Sincronización",             description: "En sede principal" },
              ],
            },
            {
              title: "Talleres Aliados 🔧",
              rows: [
                { id: "DHH18", title: "Alineación/balanceo",    description: "Taller ElectroCar" },
                { id: "DHH19", title: "Latonería y pintura",     description: "Taller PaintPro" },
                { id: "DHH20", title: "Tapicería y cojinería",    description: "Taller UpholsteryX" },
                { id: "DHH21", title: "Accesorios y lujos",      description: "Taller LuxuryMods" },
                { id: "DHH22", title: "Más Servicios",           description: "Ver más servicios disponibles" },
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
      const selection = ctx.body?.trim();

      // **Redirijo** si pulsa "Más Servicios"
      if (selection === "DHH22") {
        return gotoFlow(mechanicalFlow2);
      }

      // Cualquier otra opción válida:
      await flowDynamic(`✅ Has seleccionado *${selection}*`);
      await flowDynamic("¿Deseás agendar una cita para este servicio?");
      await flowDynamic("📆 Responde *sí* para continuar o *no* para volver al menú.");
    }
  );

export { mechanicalFlow };
