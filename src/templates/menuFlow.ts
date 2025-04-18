import { addKeyword, EVENTS } from "@builderbot/bot";
import { menuFlow } from "./menuFlow";

const mechanicalFlow = addKeyword(EVENTS.ACTION)
  .addAnswer("🔧 ¿Con qué servicio de mecánica general podemos ayudarte?", {}, async (ctx, { provider }) => {
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
            title: "Sede Principal - Calle 123 #45-67",
            rows: [
              { id: "cambio_aceite", title: "Cambio de aceite", description: "En sede principal" },
              { id: "revision_frenos", title: "Revisión de frenos", description: "En sede principal" },
              { id: "alineacion_balanceo", title: "Alineación y balanceo", description: "En sede principal" },
              { id: "revision_suspension", title: "Revisión de suspensión", description: "En sede principal" },
              { id: "escaneo_testigo", title: "Escaneo por testigo encendido", description: "En sede principal" },
            ],
          },
          {
            title: "Talleres Aliados",
            rows: [
              { id: "diagnostico_electronico", title: "Diagnóstico electrónico", description: "Taller ElectroCar" },
              { id: "sincronizacion_motor", title: "Sincronización de motor", description: "Taller SyncMotor" },
              { id: "revision_caja", title: "Revisión de caja automática", description: "Taller TransTec" },
              { id: "instalacion_sensores", title: "Instalación de sensores", description: "Taller SensorTech" },
              { id: "otro_servicio", title: "Otro servicio / Consultar asesor", description: "Taller Asistencia" },
            ],
          },
        ],
      },
    };

    await provider.sendLists(ctx.from, list);
  })
  .addAnswer("", { capture: true }, async (ctx, { flowDynamic, gotoFlow }) => {
    const selectedServiceId = ctx?.id || "";
    const allServiceIds = [
      "cambio_aceite", "revision_frenos", "alineacion_balanceo", "revision_suspension", "escaneo_testigo",
      "diagnostico_electronico", "sincronizacion_motor", "revision_caja", "instalacion_sensores", "otro_servicio",
    ];

    if (!allServiceIds.includes(selectedServiceId)) {
      await flowDynamic("❌ Opción inválida. Por favor, seleccioná un servicio del menú.");
      return gotoFlow(mechanicalFlow);
    }

    await flowDynamic(`✅ Has seleccionado el servicio: *${ctx.body}*`);
    await flowDynamic("¿Deseás agendar una cita para este servicio?");
    await flowDynamic("📆 Responde con *sí* para continuar o *no* para volver al menú.");

    // Aquí en el futuro conectamos con appointmentsFlow
    return gotoFlow(menuFlow);
  });

export { mechanicalFlow };
