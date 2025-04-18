import { addKeyword } from "@builderbot/bot";
import { menuFlow } from "./menuFlow";

const services = [
  {
    id: "cambio_aceite",
    title: "Cambio de aceite",
    description: "Sede Principal - Calle 123 #45-67",
  },
  {
    id: "revision_frenos",
    title: "Revisión de frenos",
    description: "Sede Principal - Calle 123 #45-67",
  },
  {
    id: "alineacion_balanceo",
    title: "Alineación y balanceo",
    description: "Sede Principal - Calle 123 #45-67",
  },
  {
    id: "revision_suspension",
    title: "Revisión de suspensión",
    description: "Sede Principal - Calle 123 #45-67",
  },
  {
    id: "escaneo_testigo",
    title: "Escaneo por testigo encendido",
    description: "Sede Principal - Calle 123 #45-67",
  },
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
];

const mechanicalFlow = addKeyword("mecanica_general")
  .addAction(async (ctx, { provider }) => {
    const list = {
      header: {
        type: "text",
        text: "🔧 Servicios de Mecánica General",
      },
      body: {
        text: "Seleccioná el servicio que necesitás 👇",
      },
      footer: {
        text: "TecniRacer - Taller confiable",
      },
      action: {
        button: "📋 Ver servicios",
        sections: [
          {
            title: "📍 Sede Principal - Calle 123 #45-67",
            rows: services
              .filter((s) => s.description.includes("Sede Principal"))
              .map((s) => ({
                id: s.id,
                title: s.title,
                description: s.description,
              })),
          },
          {
            title: "🏬 Talleres Aliados",
            rows: services
              .filter((s) => s.description.includes("Taller"))
              .map((s) => ({
                id: s.id,
                title: s.title,
                description: s.description,
              })),
          },
        ],
      },
    };

    await provider.sendLists(ctx.from, list); // ✅ Método correcto con provider Meta
  })
  .addAnswer("", { capture: true }, async (ctx, { flowDynamic, gotoFlow }) => {
    const selected = services.find((s) => s.id === ctx.id);
    if (!selected) {
      await flowDynamic("❌ Opción no válida. Por favor, seleccioná un servicio del menú.");
      return gotoFlow(mechanicalFlow);
    }

    await flowDynamic(`✅ Has seleccionado: *${selected.title}*`);
    await flowDynamic("¿Deseás agendar una cita para este servicio?");
    await flowDynamic("📆 Responde con *sí* para continuar o *no* para volver al menú.");

    return gotoFlow(menuFlow); // Luego se conectará a appointmentsFlow
  });

export { mechanicalFlow };
