import { addKeyword } from "@builderbot/bot";

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
                {
                  id: "PNDM98",
                  title: "Cambio de aceite",
                  description: "Servicio realizado en sede principal"
                },
                {
                  id: "PNDM97",
                  title: "Revision Frenos",
                  description: "Revision de Frenos"
                },
                {
                  id: "PNDM96",
                  title: "Diagnostico Electronico",
                  description: "Scanner electronico"
                },
                {
                  id: "PNDM95",
                  title: "Revision Suspencion",
                  description: "Revision de Suspencion"
                },
                {
                  id: "PNDM94",
                  title: "Sincronizacion",
                  description: "Sincronizacion de motor"
                }
              ]
            },
            {
              title: "Talleres Aliados 🔧",
              rows: [
                {
                  id: "DHH18",
                  title: "Alineacion/balanceo",
                  description: "Alineacion y balanceo"
                },
                {
                  id: "DHH19",
                  title: "Latoneria y pintura",
                  description: "Ver métodos de pago"
                },
                {
                  id: "DHH20",
                  title: "Tapiceria y cojineria",
                  description: "Tapicería y cojineria"
                },
                {
                  id: "DHH21",
                  title: "Accesorios y lujos",
                  description: "Accesorios y lujos"
                },
                {
                  id: "DHH22",
                  title: "Mas Servicios",
                  description: "Contactar con asesor"
                }
              ]
            }
          ]
        }
      }
      await provider.sendList(ctx.from, list)
    }
  )
  .addAnswer('', { capture: true }, async (ctx, { gotoFlow }) => {
    if (ctx?.id === 'DHH22') {
      return gotoFlow(mechanicalFlow2);
    }
  });
export { mechanicalFlow };
