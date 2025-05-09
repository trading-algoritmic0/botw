import { addKeyword } from "@builderbot/bot";
import path from "path";
import { menuFlow } from "../menuFlow";
import { registerFlow } from "../registerFlow";

const camAceite = addKeyword(["camAceite"])
  .addAction(async (ctx, { provider }) => {

    await provider.sendButtonsMedia(
      ctx.from,
      "image",
      [
        { body: "Confirmar ✅" },   // <= máx 20 caracteres
        { body: "Cancelar ❌" }     // <= máx 20 caracteres
      ],
      "🛢️ Cambio de Aceite\nRevisión de niveles y filtros.\n¿Agendamos tu cita?",
      "https://raw.githubusercontent.com/trading-algoritmic0/botw/refs/heads/main/public/assets/photo1.jpg"
    );
  })
  .addAnswer("", { capture: true }, async (ctx, { flowDynamic, gotoFlow }) => {
    const userResponse = ctx.body.trim().toLowerCase();

    if (userResponse === "confirmar ✅".toLowerCase()) {
      await flowDynamic("✅ ¡Perfecto! Vamos a agendar tu cita.");
      return gotoFlow(registerFlow);
    } else if (userResponse === "cancelar ❌".toLowerCase()) {
      await flowDynamic("❌ Sin problema, te regreso al menú.");
      return gotoFlow(menuFlow);
    } else {
      await flowDynamic("Por favor selecciona una opción válida.");
      return gotoFlow(menuFlow);
    }
  });

export { camAceite };
