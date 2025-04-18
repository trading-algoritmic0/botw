import { addKeyword } from "@builderbot/bot";

const mechanicalFlow = addKeyword(['mecanica_general'])
  .addAnswer(
    '🔧 ¿Con qué servicio de mecánica general podemos ayudarte?',
    { capture: false },
    async (ctx, { provider }) => {
      const list = {
        header: {
          type: "text",
          text: "🔧 Servicios de Mecánica General"
        },
        body: {
          text: "Seleccioná uno de los siguientes servicios 👇"
        },
        footer: {
          text: "TecniRacer - Taller de confianza"
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
                  description: "Servicio realizado en la sede principal"
                },
                {
                  id: "revision_frenos",
                  title: "Revisión de frenos",
                  description: "Servicio realizado en la sede principal"
                },
                {
                  id: "alineacion_balanceo",
                  title: "Alineación y balanceo",
                  description: "Servicio realizado en la sede principal"
                },
                {
                  id: "revision_suspension",
                  title: "Revisión de suspensión",
                  description: "Servicio realizado en la sede principal"
                },
                {
                  id: "escaneo_testigo",
                  title: "Escaneo por testigo encendido",
                  description: "Servicio realizado en la sede principal"
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
