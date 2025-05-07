import { addKeyword } from "@builderbot/bot";
import path from "path";
import { menuFlow } from "../menuFlow";
import { appointmentsFlow } from "../appointmentsFlow";

const camAceite = addKeyword(["revSuspe"])
  .addAction(async (ctx, { provider }) => {
    const imagePath = path.resolve(process.cwd(), "public/assets/photo1.jpg");

    await provider.sendButtonsMedia(
      ctx.from,
      "image",
      [
        { type: "reply", reply: { id: "confirmar", title: "✅ Confirmar" } },
        { type: "reply", reply: { id: "cancelar", title: "❌ Cancelar" } },
      ],
      "revSuspe para vehi",
      imagePath
    );
  })
  .addAnswer("", { capture: true }, async (ctx, { flowDynamic, gotoFlow }) => {
    if (ctx.body === "confirmar") {
      await flowDynamic("✅ ¡Perfecto! Vamos a agendar tu cita.");
      return gotoFlow(appointmentsFlow);
    } else if (ctx.body === "cancelar") {
      await flowDynamic("❌ Sin problema, te regreso al menú.");
      return gotoFlow(menuFlow);
    } else {
      await flowDynamic("Por favor selecciona una opción válida.");
      return gotoFlow(menuFlow);
    }
  });

export { revSuspe };
