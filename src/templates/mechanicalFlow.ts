import { addKeyword, EVENTS } from "@builderbot/bot";
import { menuFlow } from "./menuFlow";

const services = [
  { id: "cambio_aceite", title: "Cambio de aceite", type: "sede" },
  { id: "revision_frenos", title: "Revisión de frenos", type: "sede" },
  { id: "alineacion_balanceo", title: "Alineación y balanceo", type: "sede" },
  { id: "revision_suspension", title: "Revisión de suspensión", type: "sede" },
  { id: "escaneo_testigo", title: "Escaneo por testigo encendido", type: "sede" },
  { id: "diagnostico_electronico", title: "Diagnóstico electrónico", type: "aliado" },
  { id: "sincronizacion_motor", title: "Sincronización de motor", type: "aliado" },
  { id: "revision_caja", title: "Revisión de caja automática", type: "aliado" },
  { id: "instalacion_sensores", title: "Instalación de sensores", type: "aliado" },
  { id: "otro_servicio", title: "Otro servicio / Consultar asesor", type: "aliado" },
];

const mechanicalFlow = addKeyword(EVENTS.ACTION)
  .addAction(async (ctx, { provider }) => {
    const list = {
      header: { type: "text", text: "🔧 Servicios de Mecánica General" },
      body: { text: "¿Con qué servicio podemos ayudarte?" },
      footer: { text: "" },
      action: {
        button: "📋 Ver servicios",
        sections: [
          {
            title: "Disponibles",
            rows: services.map((s) => ({
              id: s.id,
              title: s.title,
              description: s.type === "sede" ? "Realizado en nuestra sede principal" : "Servicio tercerizado",
            })),
          },
        ],
      },
    };

    await provider.sendList(`${ctx.from}@s.whatsapp.net`, list);
  })
  .addAnswer("", { capture: true }, async (ctx, { flowDynamic, gotoFlow }) => {
    const selected = services.find((s) => s.id === ctx.id);

    if (!selected) {
      await flowDynamic("❌ Servicio no válido. Por favor, seleccioná uno del menú.");
      return gotoFlow(mechanicalFlow);
    }

    await flowDynamic(`✅ Has seleccionado: *${selected.title}*`);
    await flowDynamic("¿Deseás agendar una cita para este servicio?");
    await flowDynamic("📆 Responde con *sí* para continuar o *no* para volver al menú.");

    // Aquí en el futuro conectamos con appointmentsFlow
    return gotoFlow(menuFlow);
  });

export { mechanicalFlow };
