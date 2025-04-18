// src/templates/mechanicalFlow.ts
import { addKeyword } from "@builderbot/bot";
import { menuFlow } from "./menuFlow";
import { mechanicalFlow2 } from "./mechanical/mechanicalFlow2";

const mechanicalFlow = addKeyword(["mecanica_general"])
  // 1) Primera parte: enviamos la lista
  .addAnswer(
    "Por favor selecciona un servicio:",
    { capture: false },
    async (ctx, { provider }) => {
      const list = {
        header: { type: "text", text: "Servicio mecánico TecniRacer" },
        body: { text: "¿En qué podemos ayudarte hoy?" },
        footer: { text: "✅ Selecciona una opción" },
        action: {
          button: "Servicios",
          sections: [
            {
              title: "Sede Principal 🔧",
              rows: [
                { id: "PNDM98", title: "Cambio de aceite", description: "En sede principal" },
                { id: "PNDM97", title: "Revisión de frenos", description: "En sede principal" },
                { id: "PNDM96", title: "Diagnóstico electrónico", description: "En sede principal" },
                { id: "PNDM95", title: "Revisión suspensión", description: "En sede principal" },
              ],
            },
            {
              title: "Talleres Aliados 🔧",
              rows: [
                { id: "DHH18", title: "Alineación/balanceo", description: "Tercerizado" },
                { id: "DHH19", title: "Latonería y pintura", description: "Tercerizado" },
                { id: "DHH20", title: "Tapicería y cojinería", description: "Tercerizado" },
                { id: "DHH21", title: "Accesorios y lujos", description: "Tercerizado" },
              ],
            },
            {
              title: "Otras opciones 🔄",
              rows: [
                { id: "volver_menu", title: "Volver al menú", description: "" },
                { id: "DHH22",     title: "…Más servicios", description: "Ver más opciones" },
              ],
            },
          ],
        },
      };
      await provider.sendList(ctx.from, list);
    }
  )
  // 2) Capturamos el clic sobre cualquiera de esas opciones
  .addAnswer(
    "",
    { capture: true },
    async (ctx, { flowDynamic, gotoFlow }) => {
      // 2a) Si pulsa "volver_menu"
      if (ctx.id === "volver_menu") {
        return gotoFlow(menuFlow);
      }

      // 2b) Si pulsa "…Más servicios"
      if (ctx.id === "DHH22") {
        return gotoFlow(mechanicalFlow2);
      }

      // 2c) Cualquier otro id será uno de los servicios -> mostramos reserva
      // (puedes mapear ctx.id a un nombre amigable, aquí uso ctx.body para simplificar)
      await flowDynamic(`✅ Has seleccionado *${ctx.body}*`);
      await flowDynamic("¿Deseas agendar una cita para este servicio?");
      await flowDynamic("🗓️ Responde con *sí* para continuar o *no* para volver al menú.");

      // tras esto podrías gotoFlow(appointmentsFlow) o simplemente volver al menú:
      return; // si no pones gotoFlow, se mantiene en este mismo handler esperando "sí"/"no"
    }
  );

export { mechanicalFlow };
