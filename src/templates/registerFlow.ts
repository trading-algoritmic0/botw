import { addKeyword, EVENTS } from "@builderbot/bot";
import sheetsService from "../services/sheetsService";
import { appointmentsFlow } from "./appointmentsFlow";

const registerFlow = addKeyword(EVENTS.ACTION)
  // Paso 1: compruebo si el usuario ya existe
  .addAction(async (ctx, { state, flowDynamic, gotoFlow }) => {
    const isUser = await sheetsService.userExists(ctx.from);
    // lo guardo en el estado
    await state.update({ isUser });

    if (isUser) {
      // si ya existía, voy directo a agendar
      await flowDynamic("✅ Ya estás registrado, ¡vamos a agendar tu cita!");
      return gotoFlow(appointmentsFlow);
    }
    // si NO existe, cae al primer addAnswer
  })

  // Paso 2: primera pregunta solo para nuevos
  .addAnswer(
    `📋 Antes de agendar, necesito registrarte rápidamente.\n¿Cuál es tu *nombre completo*?`,
    { capture: true },
    async (ctx, ctxFn) => {
      // si por alguna razón isUser se volvió true, abortamos
      if (ctxFn.state.getMyState().isUser) {
        return ctxFn.endFlow();
      }
      await ctxFn.state.update({ name: ctx.body.trim() });
      await ctxFn.flowDynamic(`Gracias ${ctx.body.trim()} 🙌`);
    }
  )

  // Paso 3: placa
  .addAnswer(
    `¿Cuál es la *placa* de tu vehículo? (Ej: ABC123)`,
    { capture: true },
    async (ctx, ctxFn) => {
      if (ctxFn.state.getMyState().isUser) {
        return ctxFn.endFlow();
      }
      const raw = ctx.body.toUpperCase().replace(/[^A-Z0-9]/g, "");
      if (raw.length < 6 || raw.length > 7) {
        return ctxFn.fallBack("🚫 Placa inválida. Ejemplo correcto: ABC123.");
      }
      await ctxFn.state.update({ plate: raw });
    }
  )

  // Paso 4: marca y modelo
  .addAnswer(
    `¿Cuál es la *marca y modelo* de tu vehículo? (Ej: Toyota Corolla)`,
    { capture: true },
    async (ctx, ctxFn) => {
      if (ctxFn.state.getMyState().isUser) {
        return ctxFn.endFlow();
      }
      await ctxFn.state.update({ brandModel: ctx.body.trim() });
    }
  )

  // Paso 5: combustible y transmisión + guardado final y salto a appointmentsFlow
  .addAnswer(
    `¿Cuál es el *tipo de combustible y transmisión*? (Ej: Gasolina Automático)`,
    { capture: true },
    async (ctx, ctxFn) => {
      if (ctxFn.state.getMyState().isUser) {
        return ctxFn.endFlow();
      }
      await ctxFn.state.update({ fuelTransmission: ctx.body.trim() });

      // leo todo el estado y guardo en Sheets
      const s = ctxFn.state.getMyState();
      await sheetsService.createUser(
        ctx.from,
        s.name,
        "-",              // sin mail
        s.plate,
        s.brandModel,
        s.fuelTransmission
      );

      await ctxFn.flowDynamic([
        "✅ ¡Registro completo!",
        "🚀 Ahora vamos a agendar tu cita."
      ]);

      return ctxFn.gotoFlow(appointmentsFlow);
    }
  );

export { registerFlow };
