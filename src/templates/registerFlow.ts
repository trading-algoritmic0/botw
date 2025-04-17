import { addKeyword, EVENTS } from "@builderbot/bot";
import sheetsService from "../services/sheetsService";
import { menuFlow } from "./menuFlow"; // Asegúrate de que este archivo exista

const registerFlow = addKeyword(EVENTS.ACTION)
  .addAnswer(
    `¿Querés comenzar con el registro?`,
    {
      capture: true,
      buttons: [{ body: "Sí, quiero!" }, { body: "No, gracias!" }],
    },
    async (ctx, ctxFn) => {
      if (ctx.body === "No, gracias!") {
        return ctxFn.endFlow(
          "✅ Registro cancelado. Podés escribirme en cualquier momento para registrarte."
        );
      } else if (ctx.body === "Sí, quiero!") {
        await ctxFn.flowDynamic("Perfecto, voy a hacerte algunas preguntas. ✍️");
      } else {
        return ctxFn.fallBack("⚠️ Tenés que elegir alguna de las opciones.");
      }
    }
  )
  .addAnswer(
    `Primero, ¿cuál es tu *nombre*?`,
    { capture: true },
    async (ctx, ctxFn) => {
      await ctxFn.flowDynamic(`Gracias ${ctx.body} 🙌`);
      await ctxFn.state.update({ name: ctx.body });
    }
  )
  .addAnswer(
    `Ahora, ¿cuál es tu *correo electrónico*?`,
    { capture: true },
    async (ctx, ctxFn) => {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(ctx.body)) {
        return ctxFn.fallBack("📧 Por favor, ingresá un correo electrónico válido.");
      }
      await ctxFn.state.update({ email: ctx.body });
    }
  )
  .addAnswer(
    `Por último, ¿cuál es la *placa* de tu vehículo? (Ej: DFG456 sin guión, todo junto y en mayúsculas)`,
    { capture: true },
    async (ctx, ctxFn) => {
      const rawPlate = ctx.body;
      const normalizedPlate = rawPlate.toUpperCase().replace(/[^A-Z0-9]/g, "");

      if (normalizedPlate.length < 6 || normalizedPlate.length > 7) {
        return ctxFn.fallBack(
          "🚫 Placa inválida. Asegurate de escribirla en este formato: *DFG456*, sin guiones ni espacios."
        );
      }

      const state = ctxFn.state.getMyState
      export { registerFlow }; // ← necesario para que el import nombrado funcione

