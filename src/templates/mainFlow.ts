import { addKeyword, EVENTS } from "@builderbot/bot";
import { registerFlow } from "./registerFlow";
import sheetsService from "../services/sheetsService";
import { DetectIntention } from "./intention.flow";

const mainFlow = addKeyword([
  EVENTS.WELCOME,
  EVENTS.VOICE_NOTE,
  EVENTS.MEDIA,
  EVENTS.DOCUMENT,
]).addAction(async (ctx, ctxFn) => {
  if (ctx.body.includes("_event_")) {
    return ctxFn.endFlow(
      "Aun no tengo la capacidad de procesar documentos, multimedia o notas de voz."
    );
  }
  const isUser = await sheetsService.userExists(ctx.from);
  if (!isUser) {
    await ctxFn.flowDynamic(
      "Bienvenido a este Chabot! Para comenzar, necesito registrate!"
    );
    return ctxFn.gotoFlow(registerFlow);
  } else {
    return ctxFn.gotoFlow(DetectIntention);
  }
});

export { mainFlow };
