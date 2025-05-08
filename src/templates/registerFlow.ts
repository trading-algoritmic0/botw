import { addKeyword, EVENTS } from "@builderbot/bot";
import sheetsService from "../services/sheetsService";
import { appointmentsFlow } from "./appointmentsFlow";

const registerFlow = addKeyword(EVENTS.ACTION)
  .addAction(async (ctx, { flowDynamic, gotoFlow }) => {
    const isUser = await sheetsService.userExists(ctx.from);

    if (isUser) {
      await flowDynamic("✅ Ya estás registrado, ¡vamos a agendar tu cita!");
      return gotoFlow(appointmentsFlow);
    }

    await flowDynamic("📋 Antes de agendar, necesito registrarte rápidamente.");

    // ¡OJO! aquí **solo sigue con las preguntas si no está registrado**
    return;
  })
  .addAnswer(
    `¿Cuál es tu *nombre completo*?`,
    { capture: true },
    async (ctx, ctxFn) => {
      const isUser = await sheetsService.userExists(ctx.from);
      if (isUser) return;  // si ya está registrado, NO pregunta

      await ctxFn.state.update({ name: ctx.body });
      await ctxFn.flowDynamic(`Gracias ${ctx.body} 🙌`);
    }
  )
  .addAnswer(
    `¿Cuál es la *placa* de tu vehículo? (Ej: ABC123)`,
    { capture: true },
    async (ctx, ctxFn) => {
      const isUser = await sheetsService.userExists(ctx.from);
      if (isUser) return;

      const rawPlate = ctx.body.toUpperCase().replace(/[^A-Z0-9]/g, "");
      if (rawPlate.length < 6 || rawPlate.length > 7) {
        return ctxFn.fallBack("🚫 Placa inválida. Ejemplo correcto: ABC123.");
      }
      await ctxFn.state.update({ plate: rawPlate });
    }
  )
  .addAnswer(
    `¿Cuál es la *marca y modelo* de tu vehículo? (Ej: Toyota Corolla)`,
    { capture: true },
    async (ctx, ctxFn) => {
      const isUser = await sheetsService.userExists(ctx.from);
      if (isUser) return;

      await ctxFn.state.update({ brandModel: ctx.body });
    }
  )
  .addAnswer(
    `¿Cuál es el *tipo de combustible y transmisión*? (Ej: Gasolina Automático)`,
    { capture: true },
    async (ctx, ctxFn) => {
      const isUser = await sheetsService.userExists(ctx.from);
      if (isUser) return;

      await ctxFn.state.update({ fuelTransmission: ctx.body });

      const state = ctxFn.state.getMyState();
      await sheetsService.createUser(
        ctx.from,
        state.name,
        "-", // correo
        state.plate,
        state.brandModel,
        state.fuelTransmission
      );

      await ctxFn.flowDynamic([
        "✅ ¡Registro completo!",
        "🚀 Ahora vamos a agendar tu cita."
      ]);

      return ctxFn.gotoFlow(appointmentsFlow);
    }
  );

export { registerFlow };
