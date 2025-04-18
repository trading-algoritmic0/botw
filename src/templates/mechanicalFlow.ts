import { addKeyword } from "@builderbot/bot";

const mechanicalFlow = addKeyword(['mecanica_general'])
 .addAnswer(
    '👋 ¡Hola! Bienvenido a *Urban Electric Riohacha* 🏍️. Por favor selecciona una opción:',
    { capture: false },
    async (ctx, { provider }) => {
      const list = {
        header: {
          type: "text",
          text: "🏍️ Urban Electric Riohacha"
        },
        body: {
          text: "¿En qué podemos ayudarte hoy?"
        },
        footer: {
          text: "✅ Selecciona una opción"
        },
        action: {
          button: "Menú",
          sections: [
            {
              title: "Vehículos 🚲 y Ubicación📍",
              rows: [
                {
                  id: "catalogo",
                  title: "Catálogo de vehículos",
                  description: "Ver catálogo de vehículos electricos"
                },
                {
                  id: "puntos",
                  title: "Puntos de venta",
                  description: "Ubicación y horarios"
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
