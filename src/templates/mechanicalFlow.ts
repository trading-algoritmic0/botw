import { addKeyword } from "@builderbot/bot";

const mechanicalFlow = addKeyword(['mecanica_general'])
 .addAnswer(
    '🔧 ¡Hola! Bienvenido a *TecniRacer* 🚗. Por favor selecciona un servicio de mecánica general:',
    { capture: false },
    async (ctx, { provider }) => {
      const list = {
        header: {
          type: "text",
          text: "🔧 Mecánica General - TecniRacer"
        },
        body: {
          text: "¿Con qué servicio podemos ayudarte hoy?"
        },
        footer: {
          text: "✅ Seleccioná una opción para continuar"
        },
        action: {
          button: "Ver servicios",
          sections: [
            {
              title: "Sede Principal - Calle 123 #45-67",
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
              title: "Talleres Aliados",
              rows: [
                {
                  id: "diagnostico_electronico",
                  title: "Diagnóstico electrónico",
                  description: "Taller ElectroCar"
                },
                {
                  id: "sincronizacion_motor",
                  title: "Sincronización de motor",
                  description: "Taller SyncMotor"
                },
                {
                  id: "revision_caja",
                  title: "Revisión de caja automática",
                  description: "Taller TransTec"
                },
                {
                  id: "instalacion_sensores",
                  title: "Instalación de sensores",
                  description: "Taller SensorTech"
                },
                {
                  id: "otro_servicio",
                  title: "Otro servicio / Consultar asesor",
                  description: "Taller Asistencia"
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
