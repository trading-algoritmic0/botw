import { addKeyword, EVENTS } from "@builderbot/bot";
import { menuFlow } from "./menuFlow";
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
    await ctxFn.flowDynamic([
      {
        body: "¡Hola! Bienvenid@ a *TecniRacer B/ga*, servicio de mantenimiento especializado automotriz. Te saluda el Ing. Daniel Palacio.",
        media: "./public/assets/photo1.jpg",
      },
      {
        body: "Aquí tienes un mensaje de bienvenida en audio 🎧",
        media: "./public/assets/audio.mp3",
      },
    ]);

    await ctxFn.flowDynamic("Selecciona una opción del menú:");
    return ctxFn.gotoFlow(menuFlow);
  } else {
    return ctxFn.gotoFlow(DetectIntention);
  }
});

export { mainFlow };
