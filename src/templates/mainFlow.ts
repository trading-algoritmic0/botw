import { addKeyword, EVENTS } from "@builderbot/bot";
import { menuFlow } from "./menuFlow";
import sheetsService from "../services/sheetsService";
import { DetectIntention } from "./intention.flow";

/**
 * mainFlow: Maneja el evento de bienvenida y el registro de usuarios.
 * Envía imagen, texto de bienvenida y audio solo para nuevos usuarios,
 * luego redirige al menú principal o DetectIntention según corresponda.
 */
const mainFlow = addKeyword([
  EVENTS.WELCOME,
  EVENTS.VOICE_NOTE,
  EVENTS.MEDIA,
  EVENTS.DOCUMENT,
]).addAction(async (ctx, { provider, flowDynamic, gotoFlow, endFlow }) => {
  // Manejo de multimedia y notas de voz no soportadas
  if (ctx.body.includes("_event_")) {
    return endFlow(
      "Aun no tengo la capacidad de procesar documentos, multimedia o notas de voz."
    );
  }

  // Verificar si el usuario ya está registrado en Google Sheets
  const isUser = await sheetsService.userExists(ctx.from);

  if (!isUser) {
    // Secuencia de bienvenida para nuevos usuarios
    await provider.sendImageUrl(
      ctx.from,
      "https://raw.githubusercontent.com/trading-algoritmic0/botw/main/public/assets/photo1.jpg",
      ""
    );
    await provider.sendText(
      ctx.from,
      "¡Hola! Bienvenid@ a *TecniRacer B/ga*, servicio de mantenimiento especializado automotriz. Te saluda el Ing. Daniel Palacio."
    );
    await provider.sendFile(
      ctx.from,
      "https://raw.githubusercontent.com/trading-algoritmic0/botw/main/public/assets/audio.mp3",
      ""
    );

    // Indicar selección del menú y redirigir
    await flowDynamic(
      "🛠️ Por favor selecciona una opción del menú:"
    );
    return gotoFlow(menuFlow);
  } else {
    // Usuario ya registrado -> detectar intención
    return gotoFlow(DetectIntention);
  }
});

export { mainFlow };
