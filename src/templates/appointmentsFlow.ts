import { addKeyword, EVENTS } from "@builderbot/bot";
import sheetsService from "../services/sheetsService";
import { menuFlow } from "./menuFlow";

export const appointmentsFlow = addKeyword(EVENTS.ACTION)
  // 1) Fecha
  .addAnswer(
    `📅 ¿Qué día deseas tu cita? (Ej: 2025-05-10)`,
    { capture: true },
    async (ctx, { state }) => {
      await state.update({ date: ctx.body.trim() });
    }
  )
  // 2) Servicio
  .addAnswer(
    `🛠 ¿Qué servicio necesitas? (Ej: Cambio de aceite)`,
    { capture: true },
    async (ctx, { state }) => {
      await state.update({ service: ctx.body.trim() });
    }
  )
  // 3) Sede **y** GRABAR la cita
  .addAnswer(
    `🏢 ¿Prefieres sede *Principal* o *Aliado*?`,
    { capture: true },
    async (ctx, { state, flowDynamic, gotoFlow }) => {
      await state.update({ sede: ctx.body.trim() });

      const s = state.getMyState();
      // Guarda en Sheets
      await sheetsService.addAppointmentToUser(ctx.from, {
        date: s.date,
        service: s.service,
        sede: s.sede,
        status: "Pendiente",
        notes: "-",
        lastUpdate: new Date().toISOString(),
        operator: "bot",
      });

      // Mensaje de confirmación y volver al menú
      await flowDynamic([
        "✅ ¡Cita registrada!",
        "Te contactaremos para confirmar el horario exacto."
      ]);
      return gotoFlow(menuFlow);
    }
  );
