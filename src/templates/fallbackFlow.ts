import { addKeyword } from "@builderbot/bot";
import { menuFlow } from "./menuFlow";

export const fallbackFlow = addKeyword(["__FALLBACK__"])
  .addAction(async (_, { flowDynamic, gotoFlow }) => {
    // Mensaje de fallback
    await flowDynamic([
      "🤖 No entendí tu mensaje.",
      "🧭 Te redirijo al menú de opciones para que puedas elegir la acción que deseas realizar."
    ]);
    // Redirigir al menú principal
    return gotoFlow(menuFlow);
  });
