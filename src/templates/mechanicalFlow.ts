import { addKeyword } from "@builderbot/bot";
import { menuFlow } from "./menuFlow";

const mechanicalFlow = addKeyword(['mecanica_general'])
  .addAnswer(
    'Por favor selecciona un servicio:',
    { capture: false },
    async (ctx, { provider }) => {
      const list = {
        header: {
          type: "text",
          text: "Servicio mecánico TecniRacer"
        },
        body: {
          text: "¿En qué podemos ayudarte hoy?"
        },
        footer: {
          text: "✅ Selecciona una opción"
        },
        action: {
          button: "Servicios",
          sections: [
            {
              title: "Sede Principal 🔧",  // hasta 24 char
              rows: [
                { id: "PNDM98", title: "Cambio de aceite",      description: "En sede principal" },
                { id: "PNDM97", title: "Revisión de frenos",    description: "En sede principal" },
                { id: "PNDM96", title: "Diagnóstico electrónico",description: "En sede principal" },
                { id: "PNDM95", title: "Revisión suspensión",    description: "En sede principal" },
              ],
            },
            {
              title: "Talleres Aliados 🔧",
              rows: [
                { id: "DHH18", title: "Alineación/balanceo",  description: "Tercerizado" },
                { id: "DHH19", title: "Latonería y pintura",   description: "Tercerizado" },
                { id: "DHH20", title: "Tapicería y cojinería", description: "Tercerizado" },
                { id: "DHH21", title: "Accesorios y lujos",   description: "Tercerizado" },
              ],
            },
            {
              title: "Otras opciones 🔄",  // sección extra para navegación
              rows: [
                { id: "volver_menu", title: "Volver al menú", description: "" },
                { id: "DHH22", title: "…Más servicios", description: "Ver más opciones" },
              ],
            },
          ]
        }
      };
      await provider.sendList(ctx.from, list);
    }
  )
  .addAnswer(
    "", { capture: true },
    async (ctx, { flowDynamic, gotoFlow }) => {
      switch (ctx.id) {
        case "volver_menu":
          return gotoFlow(menuFlow);
        case "DHH22":
          // si pulsó “…Más servicios”
          return gotoFlow(mechanicalFlow2);
        default:
          // tu lógica actual de cita
          await flowDynamic(✅ Has seleccionado *${ctx.body}*);
          await flowDynamic("¿Deseas agendar una cita para este servicio?");
          // …
          return gotoFlow(menuFlow);
      }
    }
  );

export { mechanicalFlow };
