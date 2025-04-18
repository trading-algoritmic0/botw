import { addKeyword } from "@builderbot/bot";
import { mechanicalFlow2 } from "./mechanicalFlow2";

const mechanicalFlow = addKeyword(['mecanica_general'])
  .addAnswer(
    'Por favor selecciona una opción:',
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
              title: "Sede Principal 🔧",
              rows: [
                { id: "PNDM98", title: "Cambio de aceite", description: "Servicio realizado en sede principal" },
                { id: "PNDM97", title: "Revisión frenos", description: "Revisión de frenos" },
                { id: "PNDM96", title: "Diagnóstico electrónico", description: "Scanner electrónico" },
                { id: "PNDM95", title: "Revisión suspensión", description: "Revisión de suspensión" },
                { id: "PNDM94", title: "Sincronización", description: "Sincronización de motor" }
              ]
            },
            {
              title: "Talleres Aliados 🔧",
              rows: [
                { id: "DHH18", title: "Alineación/balanceo", description: "Alineación y balanceo" },
                { id: "DHH19", title: "Latonería y pintura", description: "Latonería y pintura" },
                { id: "DHH20", title: "Tapicería y cojinería", description: "Servicio de tapicería" },
                { id: "DHH21", title: "Accesorios y lujos", description: "Personalización del vehículo" },
                { id: "DHH22", title: "Más Servicios", description: "Ver más servicios disponibles" }
              ]
            }
          ]
        }
      };
      await provider.sendList(ctx.from, list);
    }
  )
  .addAnswer('', { capture: true }, async (ctx, { flowDynamic, gotoFlow }) => {
    if (ctx?.id === 'DHH22') {
      return gotoFlow(mechanicalFlow2);
    }

    // Para cualquier otra opción válida
    await flowDynamic(`✅ Has seleccionado *${ctx.body}*`);
    await flowDynamic("¿Deseás agendar una cita para este servicio?");
    await flowDynamic("📆 Escribí *sí* para continuar o *no* para volver al menú.");
  });

export { mechanicalFlow };
