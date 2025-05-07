import { addKeyword, EVENTS } from "@builderbot/bot";
import { menuFlow } from "./menuFlow";
import sheetsService from "../services/sheetsService";
import { DetectIntention } from "./intention.flow";
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs/promises';

// Resolver __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const mainFlow = addKeyword([
  EVENTS.WELCOME,
  EVENTS.VOICE_NOTE,
  EVENTS.MEDIA,
  EVENTS.DOCUMENT,
]).addAction(async (ctx, { provider, flowDynamic, gotoFlow, endFlow }) => {
  if (ctx.body.includes("_event_")) {
    return endFlow(
      "Aún no tengo la capacidad de procesar documentos, multimedia o notas de voz."
    );
  }

  const isUser = await sheetsService.userExists(ctx.from);
  if (!isUser) {
    try {
      // Rutas locales
      const imgPath   = resolve(__dirname, "../public/assets/photo1.jpg");
      const audioPath = resolve(__dirname, "../public/assets/audio.mp3");

      // Leer buffers
      const [imgBuffer, audioBuffer] = await Promise.all([
        fs.readFile(imgPath),
        fs.readFile(audioPath),
      ]);

      // Enviar imagen
      await provider.sendFile(ctx.from, imgBuffer, "");

      // Mensaje de bienvenida
      await provider.sendText(
        ctx.from,
        "¡Hola! Bienvenid@ a *TecniRacer B/ga*, servicio de mantenimiento automotriz. Te saluda el Ing. Daniel Palacio."
      );

      // Enviar audio
      await provider.sendFile(ctx.from, audioBuffer, "");

      // Invitación al menú
      await flowDynamic("🛠️ Por favor selecciona una opción del menú:");
      return gotoFlow(menuFlow);

    } catch (err: any) {
      console.error("Error en mainFlow:", err);
      return endFlow(
        "Lo siento, ha ocurrido un error enviando los archivos. Por favor intenta de nuevo más tarde."
      );
    }
  } else {
    return gotoFlow(DetectIntention);
  }
});

export { mainFlow };
