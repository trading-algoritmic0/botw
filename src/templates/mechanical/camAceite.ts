import { addKeyword } from "@builderbot/bot";
import path from "path";
import { menuFlow } from "../menuFlow";
import { appointmentsFlow } from "../appointmentsFlow";

const camAceite = addKeyword(["camAceite"])
  .addAction(async (ctx, { provider }) => {
    const imagePath = path.resolve(process.cwd(), "./public/assets/photo1.jpg");

    await provider.sendButtonsMedia(
      ctx.from,
      "image",
      [
        { body: "Confirmar ✅" },   // <= máx 20 caracteres
        { body: "Cancelar ❌" }     // <= máx 20 caracteres
      ],
      "🛢️ Cambio de Aceite\nRevisión de niveles y filtros.\n¿Agendamos tu cita?",
      imagePath
    );
  })
  .addAnswer("", { capture: true }, async (ctx, { flowDynamic, gotoFlow }) => {
    const userResponse = ctx.body.trim().toLowerCase();

    if (userResponse === "confirmar ✅".toLowerCase()) {
      await flowDynamic("✅ ¡Perfecto! Vamos a agendar tu cita.");
      return gotoFlow(appointmentsFlow);
    } else if (userResponse === "cancelar ❌".toLowerCase()) {
      await flowDynamic("❌ Sin problema, te regreso al menú.");
      return gotoFlow(menuFlow);
    } else {
      await flowDynamic("Por favor selecciona una opción válida.");
      return gotoFlow(menuFlow);
    }
  });

export { camAceite };
