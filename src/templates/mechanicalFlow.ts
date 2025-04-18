import { addKeyword } from "@builderbot/bot";

const mechanicalFlow = addKeyword(['mecanica_general'])
  .addAnswer(
    '🔧 ¿Con qué servicio de mecánica general podemos ayudarte?',
    { capture: false },
    async (ctx, { provider }) => {
      const list = {
        header: {
          type: "text",
          text: "🛠️ Servicios de Mecánica General"
        },
        body: {
          text: "Seleccioná un servicio para continuar:"
        },
        footer: {
          text: "TecniRacer 🚗"
        },
        action: {
          button: "📋 Ver servicios",
          sections: [
            {
              title: "Sede Principal",
              rows: [
                {
                  id: "cambio_aceite",
                  title: "Cambio de aceite",
                  description: "Realizado en sede principal"
                },
                {
                  id: "revision_frenos",
                  title: "Revisión de frenos",
                  description: "Revisión completa de frenos"
                },
                {
                  id: "alineacion_balanceo",
                  title: "Alineación y balanceo",
                  description: "Servicio de alineación profesional"
                },
                {
                  id: "revision_suspension",
                  title: "Revisión de suspensión",
                  description: "Chequeo de amortiguación"
                },
                {
                  id: "escaneo_testigo",
                  title: "Escaneo por testigo encendido",
                  description: "Diagnóstico por scanner"
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
      };

      await provider.sendList(ctx.from, list);
    }
  );

export { mechanicalFlow };
