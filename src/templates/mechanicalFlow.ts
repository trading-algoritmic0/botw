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
              title: "Sede Principal - Calle 123 #45-67 🔧",
              rows: [
                {
                  id: "cambio_aceite",
                  title: "Cambio de aceite",
                  description: "Servicio realizado en sede principal"
                },
                {
                  id: "revision_frenos",
                  title: "Revisión de frenos",
                  description: "Chequeo completo del sistema de frenos"
                },
                {
                  id: "alineacion_balanceo",
                  title: "Alineación y balanceo",
                  description: "Alineación profesional y balanceo"
                },
                {
                  id: "revision_suspension",
                  title: "Revisión de suspensión",
                  description: "Inspección detallada de la suspensión"
                },
                {
                  id: "escaneo_testigo",
                  title: "Escaneo por testigo encendido",
                  description: "Diagnóstico con scanner automotriz"
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
