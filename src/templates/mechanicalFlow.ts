import { addKeyword } from "@builderbot/bot";
import { menuFlow } from "./menuFlow";

const mechanicalFlow = addKeyword("mecanica_general").addAnswer(
  "🔧 ¿Con qué servicio de mecánica general podemos ayudarte?",
  { capture: true },
  async (ctx, { provider }) => {
    const list = {
      header: {
        type: "text",
        text: "Servicios de Mecánica General",
      },
      body: {
        text: "Seleccioná uno de los siguientes servicios disponibles 👇",
      },
      footer: {
        text: "TecniRacer - Taller confiable",
      },
      action: {
        button: "📋 Ver servicios",
        sections: [
          {
            title: "📍 Sede Principal",
            rows: [
              {
                id: "cambio_aceite",
                title: "Cambio de aceite",
                description: "Realizado en sede principal",
              },
              {
                id: "revision_frenos",
                title: "Revisión de frenos",
                description: "Realizado en sede principal",
              },
              {
                id: "alineacion_balanceo",
                title: "Alineación y balanceo",
                description: "Realizado en sede principal",
              },
              {
                id: "revision_suspension",
                title: "Revisión de suspensión",
                description: "Realizado en sede principal",
              },
              {
                id: "escaneo_testigo",
                title: "Escaneo por testigo encendido",
                description: "Realizado en sede principal",
              },
            ],
          },
          {
            title: "🏬 Talleres Aliados",
            rows: [
              {
                id: "diagnostico_electronico",
                title: "Diagnóstico electrónico",
                description: "Taller ElectroCar – Cra. 10 #20-33",
              },
              {
                id: "sincronizacion_motor",
                title: "Sincronización de motor",
                description: "Taller SyncMotor – Av. Las Vegas #54-12",
              },
              {
                id: "revision_caja",
                title: "Revisión de caja automática",
                description: "Taller TransTec – Cra. 45 #17A – 06",
              },
              {
                id: "instalacion_sensores",
                title: "Instalación de sensores",
                description: "Taller SensorTech – Calle 80 #22-45",
              },
              {
                id: "otro_servicio",
                title: "Otro servicio / Consultar asesor",
                description: "Taller Asistencia – Flexible",
              },
            ],
          },
        ],
      },
    };

    await provider.sendList(ctx.from, list); // ✔️ Este es el método correcto para Meta
  }
);

export { mechanicalFlow };
