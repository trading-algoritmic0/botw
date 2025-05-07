import { addKeyword, EVENTS } from "@builderbot/bot";
import { menuFlow } from "./menuFlow";
import sheetsService from "../services/sheetsService";
import { DetectIntention } from "./intention.flow";
import fs from "fs";
import path from "path";

/**
 * mainFlow: Maneja el evento de bienvenida y el registro de usuarios.
 * Envía imagen y audio usando archivos locales.
 */
const mainFlow = addKeyword([
  EVENTS.WELCOME,
  EVENTS.VOICE_NOTE,
  EVENTS.MEDIA,
  EVENTS.DOCUMENT,
]).addAction(async (ctx, { provider, flowDynamic, gotoFlow, endFlow }) => {
  if (ctx.body.includes("_event_")) {
    return endFlow(
      "Aun no tengo la capacidad de procesar documentos, multimedia o notas de voz."
    );
  }

  const isUser = await sheetsService.userExists(ctx.from);
  if (!isUser) {
    // Rutas locales a tus assets
    const imgPath   = path.resolve(__dirname, "../public/assets/photo1.jpg");
    const audioPath = path.resolve(__dirname, "../public/assets/audio.mp3");

    // Enviar imagen como stream
    await provider.sendFile(
      ctx.from,
      fs.createReadStream(imgPath),
      ""      // caption opcional
    );

    // Mensaje de bienvenida
    await provider.sendText(
      ctx.from,
      "¡Hola! Bienvenid@ a *TecniRacer B/ga*, servicio de mantenimiento automotriz. Te saluda el Ing. Daniel Palacio."
    );

    // Enviar audio como stream
    await provider.sendFile(
      ctx.from,
      fs.createReadStream(audioPath),
      ""      // caption opcional
    );

    // Invita al usuario a escoger del menú
    await flowDynamic("🛠️ Por favor selecciona una opción del menú:");
    return gotoFlow(menuFlow);
  } else {
    return gotoFlow(DetectIntention);
  }
});

export { mainFlow };
