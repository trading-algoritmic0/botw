import { addKeyword, EVENTS } from "@builderbot/bot";
import { sheetsService } from "../services/sheetsService";
import { menuFlow } from "./menuFlow";

export const appointmentsFlow = addKeyword(EVENTS.ACTION)
  .addAnswer(
    `📅 ¿Qué día deseas tu cita? (Ej: 2025-05-10)`,
    { capture: true },
    async (ctx, ctxFn) => {
      await ctxFn.state.update({ date: ctx.body });
    }
  )
  .addAnswer(
    `🛠 ¿Qué servicio necesitas? (Ej: Cambio de aceite)`,
    { capture: true },
    async (ctx, ctxFn) => {
      await ctxFn.state.update({ service: ctx.body });
    }
  )
  .addAnswer(
    `🏢 ¿Prefieres sede *Principal* o *Aliado*?`,
    { capture: true },
    async (ctx, ctxFn) => {
      await ctxFn.state.update({ sede: ctx.body });
    }
  )
  .addAction(async (ctx, { flowDynamic, gotoFlow }) => {
    const state = ctx.state.getMyState();

    await sheetsService.addAppointmentToUser(ctx.from, {
      date: state.date,
      service: state.service,
      sede: state.sede,
      status: "Pendiente",
      notes: "-",
      lastUpdate: new Date().toISOString(),
      operator: "bot"
    });

    await flowDynamic([
      "✅ ¡Cita registrada!",
      "Te contactaremos para confirmar el horario exacto."
    ]);

    return gotoFlow(menuFlow);
  });
