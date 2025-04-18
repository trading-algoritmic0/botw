import { addKeyword, EVENTS } from "@builderbot/bot";
import { menuFlow } from "./menuFlow";
import { appointmentsFlow } from "./appointmentsFlow";

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
  .addAnswer(
    "🔧 Servicios de Mecánica General",
    { capture: true },
    async (ctx, { provider, flowDynamic }) => {
      const list = {
        header: {
          type: "text",
          text: "Taller Mecánico Automotriz"
        },
        body: {
          text: "Selecciona un servicio:"
        },
        footer: {
          text: "Horario de atención: L-V 8am a 6pm"
        },
        action: {
          button: "Ver servicios disponibles",
          sections: [
            {
              title: "🏭 Servicios en Sede",
              rows: services
                .filter(s => s.type === "sede")
                .map(s => ({
                  id: s.id,
                  title: s.title,
                  description: "Realizado en nuestras instalaciones"
                }))
            },
            {
              title: "🤝 Servicios Tercerizados",
              rows: services
                .filter(s => s.type === "aliado")
                .map(s => ({
                  id: s.id,
                  title: s.title,
                  description: "Realizado con aliados certificados"
                }))
            }
          ]
        }
      };

      await provider.sendLists(ctx.from, list);
    }
  )
  .addAnswer(
    "¿Listo para seleccionar un servicio?",
    { capture: true }, 
    async (ctx, { flowDynamic, gotoFlow }) => {
      const selectedService = services.find(s => s.id === ctx.body);
      
      if (!selectedService) {
        await flowDynamic("⚠️ Opción no reconocida, por favor selecciona una opción válida");
        return gotoFlow(mechanicalFlow);
      }

      await flowDynamic(`✅ Elegiste: *${selectedService.title}*`);
      await flowDynamic([
        "¿Deseas agendar una cita ahora?",
        "Escribe *si* para continuar o *no* para volver al menú"
      ].join('\n'));

      return addKeyword(EVENTS.ACTION)
        .addAnswer(
          { capture: true },
          async (ctx, { flowDynamic, gotoFlow }) => {
            const response = ctx.body.toLowerCase();
            
            if (response === 'si') {
              await flowDynamic("🚀 Perfecto, vamos a agendar tu cita...");
              return gotoFlow(appointmentsFlow);
            }
            
            if (response === 'no') {
              await flowDynamic("🔙 Regresando al menú principal...");
              return gotoFlow(menuFlow);
            }
            
            await flowDynamic("❌ Respuesta no válida");
            return gotoFlow(mechanicalFlow);
          }
        );
    }
  );

export { mechanicalFlow };
