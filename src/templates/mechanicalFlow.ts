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
                  id: "cambio_aceite",
                  title: "Cambio de aceite",
                  description: "Servicio realizado en sede principal"
                },
                {
                  id: "revision_frenos",
                  title: "Revision de frenos",
                  description: "Cambio de pastillas etc"
                },
                {
                  id: "sing_motor",
                  title: "Sincronizacion de motor",
                  description: "Servicio en sede principal"
                },
                {
                  id: "scanner_diag",
                  title: "Diagnostico por scanner",
                  description: "Diagnostico electrónico y scanner"
                },
                {
                  id: "fugasmotor",
                  title: "Corrección de fugas en motor",
                  description: "Corrección de fugas en motor"
                }
              ]
            },
            {
              title: "Servicio 🔧 y Pago 💳",
              rows: [
                {
                  id: "mantenimiento",
                  title: "Mantenimiento/Garantía",
                  description: "Agendar cita o soporte"
                },
                {
                  id: "pagos",
                  title: "Métodos de pago",
                  description: "Ver métodos de pago"
                },
                {
                  id: "preguntas",
                  title: "Tengo preguntas",
                  description: "Contactar con asesor"
                },
                {
                  id: "preguntas1",
                  title: "Tengo preguntas",
                  description: "Contactar con asesor"
                },
                {
                  id: "preguntas2",
                  title: "Tengo preguntas",
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
export { mechanicalFlow };
