import { addKeyword } from "@builderbot/bot";
import { menuFlow } from "./menuFlow";
import { mechanicalFlow2 } from "./mechanical/mechanicalFlow2";

const mechanicalFlow = addKeyword(["mecanica_general"])
  // 1) addAction envía la lista interactiva
  .addAction(async (ctx, { provider }) => {
    const list = {
      header: { type: "text", text: "Servicio mecánico TecniRacer" },
      body:   { text: "¿En qué podemos ayudarte hoy?" },
      footer: { text: "✅ Selecciona una opción" },
      action: {
        button: "Servicios",
        sections: [
          {
            title: "Sede Principal 🔧",
            rows: [
              { id: "PNDM98", title: "Cambio de aceite",        description: "En sede principal" },
              { id: "PNDM97", title: "Revisión de frenos",      description: "En sede principal" },
              { id: "PNDM96", title: "Diagnóstico electrónico", description: "En sede principal" },
              { id: "PNDM95", title: "Revisión suspensión",     description: "En sede principal" },
            ],
          },
          {
            title: "Talleres Aliados 🔧",
            rows: [
              { id: "DHH18", title: "Alineación/balanceo",  description: "Tercerizado" },
              { id: "DHH19", title: "Latonería y pintura",   description: "Tercerizado" },
              { id: "DHH20", title: "Tapicería y cojinería", description: "Tercerizado" },
              { id: "DHH21", title: "Accesorios y lujos",   description: "Tercerizado" },
            ],
          },
          {
            title: "Otras opciones 🔄",
            rows: [
              { id: "volver_menu", title: "Volver al menú",   description: "aaaa" },
              { id: "DHH22",      title: "…Más servicios",    description: "Ver más opciones" },
            ],
          },
        ],
      },
    };
    await provider.sendList(ctx.from, list);
  })
  // 2) addAnswer captura el click y redirige
  .addAnswer(
    "",              // captura cualquier texto, pero aquí viene el ctx.id de la lista
    { capture: true },
    async (ctx, { flowDynamic, gotoFlow }) => {
      const sel = ctx.id;
      if (sel === "volver_menu") {
        return gotoFlow(menuFlow);
      }
      if (sel === "DHH22") {
        return gotoFlow(mechanicalFlow2);
      }

      // cualquier otro servicio
      await flowDynamic(`✅ Has seleccionado *${ctx.body}*`);
      await flowDynamic("¿Deseas agendar una cita para este servicio?");
      // aquí podrías: return gotoFlow(appointmentsFlow);
      return;
    }
  )
export { mechanicalFlow };
