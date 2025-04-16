import { createFlowRouting } from "@builderbot-plugins/langchain";
import { EVENTS } from "@builderbot/bot";
import { menuFlow } from "./menuFlow";
import { faqFlow } from "./faqFlow";
import { config } from "../config";
import path from "path";
import fs from "fs";

// Leemos el prompt para detección de intención
const Prompt_DETECTED = path.join(
  process.cwd(),
  "public/assets/prompts",
  "prompt_Detection.txt"
);
const promptDetected = fs.readFileSync(Prompt_DETECTED, "utf8");

// Configuramos la cadena base de detección de intención
let routing = createFlowRouting
  .setKeyword(EVENTS.ACTION)
  .setIntentions({
    intentions: ["MENU_OPCIONES", "FAQ", "NO_DETECTED"],
    description: promptDetected,
  });

// Si USE_GPT está activado (es decir, es "true"), configuramos la llamada a OpenAI.
// De lo contrario, no se llama a setAIModel, evitando que se inicialice ChatOpenAI.
if (config.USE_GPT === "true") {
  routing = routing.setAIModel({
    modelName: "openai" as any,
    args: {
      modelName: config.Model,
      apikey: config.ApiKey,
    },
  });
}

export const DetectIntention = routing.create({
  afterEnd(flow) {
    return flow.addAction(async (ctx, { state, gotoFlow, flowDynamic }) => {
      try {
        const detected = await state.get("intention");
        console.log("INTENCION DETECT ", detected);

        // Si no se detecta una intención válida o se obtiene "NO_DETECTED",
        // redirige al menú.
        if (!detected || detected === "NO_DETECTED") {
          await flowDynamic("❌ No se detectó una intención válida, redirigiendo al menú...");
          return gotoFlow(menuFlow);
        }
        // Si se detecta intención válida, redirige según corresponda.
        if (detected === "MENU_OPCIONES") {
          return gotoFlow(menuFlow);
        }
        if (detected === "FAQ") {
          return gotoFlow(faqFlow);
        }
      } catch (error) {
        console.error("Error en DetectIntention: ", error);
      }
    });
  },
});
