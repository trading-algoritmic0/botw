import { addKeyword, EVENTS } from "@builderbot/bot";
import sheetsService from "../services/sheetsService";
import { appointmentsFlow } from "./appointmentsFlow";

const registerFlow = addKeyword(EVENTS.ACTION)
  // 1) Compruebo si existe y guardo flag en el estado
  .addAction(async (ctx, { state, gotoFlow }) => {
    const isUser = await sheetsService.userExists(ctx.from);
    await state.update({ isUser });

    if (isUser) {
      // si ya existe, voy directo a agendar
      return gotoFlow(appointmentsFlow);
    }
    // si NO existe, sigo a los addAnswer
  })

  // 2) Estas respuestas solo se disparan si el usuario NO existe
  .addAnswer(
    `📋 Antes de agendar, necesito registrarte rápidamente.\n¿Cuál es tu *nombre completo*?`,
    {
      capture: true,
      // condición: solo si aún no está registrado
      condition: ({ state }) => !state.getMyState().isUser,
    },
    async (ctx, { state, flowDynamic }) => {
      await state.update({ name: ctx.body.trim() });
      await flowDynamic(`Gracias ${ctx.body.trim()} 🙌`);
    }
  )
  .addAnswer(
    `¿Cuál es la *placa* de tu vehículo? (Ej: ABC123)`,
    {
      capture: true,
      condition: ({ state }) => !state.getMyState().isUser,
    },
    async (ctx, { state, fallBack }) => {
      const raw = ctx.body.toUpperCase().replace(/[^A-Z0-9]/g, "");
      if (raw.length < 6 || raw.length > 7) {
        return fallBack("🚫 Placa inválida. Ejemplo correcto: ABC123.");
      }
      await state.update({ plate: raw });
    }
  )
  .addAnswer(
    `¿Cuál es la *marca y modelo* de tu vehículo? (Ej: Toyota Corolla)`,
    {
      capture: true,
      condition: ({ state }) => !state.getMyState().isUser,
    },
    async (ctx, { state }) => {
      await state.update({ brandModel: ctx.body.trim() });
    }
  )
  .addAnswer(
    `¿Cuál es el *tipo de combustible y transmisión*? (Ej: Gasolina Automático)`,
    {
      capture: true,
      condition: ({ state }) => !state.getMyState().isUser,
    },
    async (ctx, { state, flowDynamic, gotoFlow }) => {
      await state.update({ fuelTransmission: ctx.body.trim() });

      // al terminar de pedir datos, lo guardo en Sheets
      const s = state.getMyState();
      await sheetsService.createUser(
        ctx.from,
        s.name,
        "-",               // sin mail
        s.plate,
        s.brandModel,
        s.fuelTransmission
      );

      await flowDynamic([
        "✅ ¡Registro completo!",
        "🚀 Ahora vamos a agendar tu cita."
      ]);
      return gotoFlow(appointmentsFlow);
    }
  );

export { registerFlow };
