import { addKeyword, EVENTS } from "@builderbot/bot";
import { menuFlow } from "./menuFlow";
import sheetsService from "../services/sheetsService";
import { DetectIntention } from "./intention.flow";
import fs from "fs/promises";
import path from "path";

const mainFlow = addKeyword([
  EVENTS.WELCOME,
  EVENTS.VOICE_NOTE,
  EVENTS.MEDIA,
  EVENTS.DOCUMENT,
]).addAction(async (ctx, { provider, flowDynamic, gotoFlow, endFlow }) => {
  // 1) No soportamos notas de voz ni docs
  if (ctx.body.includes("_event_")) {
    return endFlow(
      "Aún no tengo la capacidad de procesar documentos, multimedia o notas de voz."
    );
  }

  // 2) ¿Usuario registrado?
  const isUser = await sheetsService.userExists(ctx.from);
  if (!isUser) {
    try {
      // 3) Carga buffers locales
      const imgPath   = path.resolve(__dirname, "../public/assets/photo1.jpg");
      const audioPath = path.resolve(__dirname, "../public/assets/audio.mp3");
      const imgBuffer   = await fs.readFile(imgPath);
      const audioBuffer = await fs.readFile(audioPath);

      // 4) Envía imagen (buffer) y texto
      await provider.sendFile(ctx.from, imgBuffer, "");
      await provider.sendText(
        ctx.from,
        "¡Hola! Bienvenid@ a *TecniRacer B/ga*, servicio de mantenimiento automotriz. Te saluda el Ing. Daniel Palacio."
      );

      // 5) Envía audio (buffer)
      await provider.sendFile(ctx.from, audioBuffer, "");

      // 6) Invitación al menú
      await flowDynamic("🛠️ Por favor selecciona una opción del menú:");
      return gotoFlow(menuFlow);

    } catch (err: any) {
      console.error("Error en mainFlow:", err);
      // Manejamos el error sin reventar el servidor
      return endFlow(
        "Lo siento, ha ocurrido un error enviando los archivos. Por favor intenta de nuevo más tarde."
      );
    }
  } else {
    return gotoFlow(DetectIntention);
  }
});

export { mainFlow };
