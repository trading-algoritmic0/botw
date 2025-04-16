import { createFlowRouting } from "@builderbot-plugins/langchain";
import { EVENTS } from "@builderbot/bot";
import { menuFlow } from "./menuFlow";
import { faqFlow } from "./faqFlow";
import { config } from "../config";
import path from "path";
import fs from "fs";

// Leemos el prompt de detección de intención
const Prompt_DETECTED = path.join(
  process.cwd(),
  "public/assets/prompts",
  "prompt_Detection.txt"
);
const promptDetected = fs.readFileSync(Prompt_DETECTED, "utf8");

// Configuración base del flujo de detección
const setupIntentionFlow = () => {
  let routing = createFlowRouting
    .setKeyword(EVENTS.ACTION)
    .setIntentions({
      intentions: ["MENU_OPCIONES", "FAQ", "NO_DETECTED"],
      description: promptDetected,
    });

  // Solo configuramos el modelo AI si USE_GPT está activado
  if (config.USE_GPT === "true") {
    if (!config.Model || !config.ApiKey) {
      throw new Error("Configuración de OpenAI incompleta cuando USE_GPT=true");
    }
    
    routing = routing.setAIModel({
      modelName: "openai",
      args: {
        modelName: config.Model,
        apikey: config.ApiKey,
        maxOutputTokens: 2048
      }
    });
  }

  return routing;
};

export const DetectIntention = setupIntentionFlow().create({
  afterEnd(flow) {
    return flow.addAction(async (ctx, { state, gotoFlow, flowDynamic }) => {
      try {
        // Comportamiento cuando OpenAI está desactivado
        if (config.USE_GPT !== "true") {
          await flowDynamic("🔍 Analizando tu mensaje...");
          // Lógica simple de detección sin IA
          const message = ctx.body.toLowerCase();
          
          if (message.includes('menu') || message.includes('opciones')) {
            return gotoFlow(menuFlow);
          }
          if (message.includes('pregunta') || message.includes('faq')) {
            return gotoFlow(faqFlow);
          }
          
          await flowDynamic("No logré entender tu solicitud. Te muestro el menú principal...");
          return gotoFlow(menuFlow);
        }

        // Comportamiento cuando OpenAI está activado
        const detected = await state.get("intention");
        console.log("Intención detectada:", detected);

        if (!detected || detected === "NO_DETECTED") {
          await flowDynamic("No pude identificar tu solicitud. Te redirijo al menú...");
          return gotoFlow(menuFlow);
        }

        if (detected === "MENU_OPCIONES") return gotoFlow(menuFlow);
        if (detected === "FAQ") return gotoFlow(faqFlow);

      } catch (error) {
        console.error("Error en DetectIntention:", error);
        await flowDynamic("⚠️ Ocurrió un error. Te redirijo al menú principal...");
        return gotoFlow(menuFlow);
      }
    });
  },
});
