import { addKeyword } from "@builderbot/bot";

const mechanicalFlow = addKeyword(['mecanica_general'])
  .addAnswer(
    'Hola, bienvenido a TecniRacer. Por favor selecciona un servicio de mecánica general:',
    { capture: false },
    async (ctx, { provider }) => {
      const list = {
        header: {
          type: "text",
          text: "Servicios de Mecánica General"
        },
        body: {
          text: "Selecciona un servicio disponible"
        },
        footer: {
          text: "TecniRacer"
        },
        action: {
          button: "Ver servicios",
          sections: [
            {
              title: "Servicios en sede principal",
              rows: [
                {
                  id: "cambio_aceite",
                  title: "Cambio de aceite",
                  description: "Servicio en sede principal"
                },
                {
                  id: "revision_frenos",
                  title: "Revisión de frenos",
                  description: "Servicio en sede principal"
                },
                {
                  id: "alineacion_balanceo",
                  title: "Alineación y balanceo",
                  description: "Servicio en sede principal"
                },
                {
                  id: "revision_suspension",
                  title: "Revisión de suspensión",
                  description: "Servicio en sede principal"
                },
                {
                  id: "escaneo_testigo",
                  title: "Escaneo testigo encendido",
                  description: "Servicio en sede principal"
                }
              ]
            },
            {
              title: "Servicios tercerizados",
              rows: [
                {
                  id: "diagnostico_electronico",
                  title: "Diagnóstico electrónico",
                  description: "Taller aliado"
                },
                {
                  id: "sincronizacion_motor",
                  title: "Sincronización de motor",
                  description: "Taller aliado"
                },
                {
                  id: "revision_caja",
                  title: "Revisión de caja automática",
                  description: "Taller aliado"
                },
                {
                  id: "instalacion_sensores",
                  title: "Instalación de sensores",
                  description: "Taller aliado"
                },
                {
                  id: "otro_servicio",
                  title: "Otro servicio",
                  description: "Consultar asesor"
                }
              ]
            }
          ]
        }
      }

      await provider.sendList(ctx.from, list)
    }
  )

export { mechanicalFlow }
