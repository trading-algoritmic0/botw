import { addKeyword } from "@builderbot/bot";
import { menuFlow } from "./menuFlow";
import { mechanicalFlow2 } from "./mechanical/mechanicalFlow2";

// Importa tus flujos específicos
import { camAceite } from "./mechanical/camAceite";
import { revFrenos } from "./mechanical/revFrenos";
import { diagElectronico } from "./mechanical/diagElectronico";
import { revSuspe } from "./mechanical/revSuspe";

const mechanicalFlow = addKeyword(["mecanica_general"])
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
                { id: "SER1", title: "Cambio de aceite", description: "En sede principal" },
                { id: "SER2", title: "Revisión de frenos", description: "En sede principal" },
                { id: "SER3", title: "Diagnóstico electrónico", description: "En sede principal" },
                { id: "SER4", title: "Revisión suspensión", description: "En sede principal" },
                { id: "SER5", title: "Servicio 5", description: "En sede principal" },
                { id: "SER6", title: "Servicio 6", description: "En sede principal" },
                { id: "SER7", title: "Servicio 7", description: "En sede principal" },
                { id: "SER8", title: "Servicio 8", description: "En sede principal" },
              ],
            },
            {
              title: "Otras opciones 🔄",
              rows: [
                { id: "volver_menu", title: "Volver al menú", description: "" },
                { id: "mas_servicios", title: "…Más servicios", description: "Ver más opciones" },
              ],
            },
          ],
        },
      };
      await provider.sendList(ctx.from, list);
    }
  )
  .addAnswer(
    "",
    { capture: true },
    async (ctx, { gotoFlow }) => {
      switch (ctx.body) {
        case "volver_menu":
          return gotoFlow(menuFlow);

        case "mas_servicios":
          return gotoFlow(mechanicalFlow2);

        case "SER1":
          return gotoFlow(camAceite);

        case "SER2":
          return gotoFlow(revFrenos);

        case "SER3":
          return gotoFlow(diagElectronico);

        case "SER4":
          return gotoFlow(revSuspe);

        // Aquí puedes continuar enlazando:
        // case "SER5": return gotoFlow(servicio5Flow);
        // case "SER6": return gotoFlow(servicio6Flow);
        // case "SER7": return gotoFlow(servicio7Flow);
        // case "SER8": return gotoFlow(servicio8Flow);

        default:
          return gotoFlow(menuFlow);
      }
    }
  );

export { mechanicalFlow };
