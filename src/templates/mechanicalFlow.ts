import { addKeyword } from "@builderbot/bot";

const mechanicalFlow = addKeyword(['mecanica_general'])
  .addAnswer(
    '🔧 ¡Bienvenido al área de Mecánica General de *TecniRacer*!',
    { capture: false },
    async (ctx, { provider }) => {
      const list = {
        header: {
          type: "text",
          text: "🔧 Servicios disponibles"
        },
        body: {
          text: "Seleccioná el servicio que necesitás 👇"
        },
        footer: {
          text: "TecniRacer - Tu taller de confianza"
        },
        action: {
          button: "📋 Ver servicios",
          sections: [
            {
              title: "Servicios en sede principal",
              rows: [
                {
                  id: "cambio_aceite",
                  title: "Cambio de aceite",
                  description: "Servicio en nuestra sede principal"
                },
                {
                  id: "revision_frenos",
                  title: "Revisión de frenos",
                  description: "Incluye inspección y ajuste"
                }
              ]
            },
            {
              title: "Talleres aliados",
              rows: [
                {
                  id: "diagnostico_electronico",
                  title: "Diagnóstico electrónico",
                  description: "Taller aliado: ElectroCar"
                },
                {
                  id: "instalacion_sensores",
                  title: "Instalación de sensores",
                  description: "Taller aliado: SensorTech"
                }
              ]
            }
          ]
        }
      };

      await provider.sendList(`${ctx.from}@s.whatsapp.net`, list);
    }
  );

export { mechanicalFlow };
