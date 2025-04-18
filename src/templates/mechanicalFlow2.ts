import { addKeyword } from "@builderbot/bot";

const mechanicalFlow2 = addKeyword(['mecanica_general'])
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
                  id: "ZXXY15",
                  title: "Cambio de aceite",
                  description: "Servicio realizado en sede principal"
                },
                {
                  id: "ZXXY14",
                  title: "Revision Frenos",
                  description: "Revision de Frenos"
                },
                {
                  id: "ZXXY13",
                  title: "Diagnostico Electronico",
                  description: "Scanner electronico"
                },
                {
                  id: "ZXXY12",
                  title: "Revision Suspencion",
                  description: "Revision de Suspencion"
                },
                {
                  id: "ZXXY11",
                  title: "Sincronizacion",
                  description: "Sincronizacion de motor"
                }
              ]
            },
            {
              title: "Talleres Aliados 🔧",
              rows: [
                {
                  id: "ZDDY006",
                  title: "Alineacion/balanceo",
                  description: "Alineacion y balanceo"
                },
                {
                  id: "ZDDY005",
                  title: "Latoneria y pintura",
                  description: "Ver métodos de pago"
                },
                {
                  id: "ZDDY004",
                  title: "Tapiceria y cojineria",
                  description: "Tapicería y cojineria"
                },
                {
                  id: "ZDDY003",
                  title: "Accesorios y lujos",
                  description: "Accesorios y lujos"
                },
                {
                  id: "ZDDY002",
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
export { mechanicalFlow2 };
