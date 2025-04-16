import { createFlowRouting } from "@builderbot-plugins/langchain";
import { EVENTS } from "@builderbot/bot";
import { menuFlow } from "./menuFlow";
import { faqFlow } from "./faqFlow";
import { config } from "../config";
import path from "path";
import fs from "fs";

// Leemos el prompt que se usará para la detección de intención.
const Prompt_DETECTED = path.join(
  process.cwd(),
  "public/assets/prompts",
  "prompt_Detection.txt"
);
const promptDetected = fs.readFileSync(Prompt_DETECTED, "utf8");

// Configuramos la llamada a la API en función de USE_GPT.
// Si USE_GPT es "true", se usa la configuración real de OpenAI.
// Si no, se pasa un objeto dummy para evitar llamar a la API.
const aiModelConfig =
  config.USE_GPT === "true"
    ? {
        modelName: "openai" as any,
        args: {
          modelName: config.Model,
          apikey: config.ApiKey,
        },
      }
    : {
        modelName: "dummy",
        args: {
          modelName: "dummy",
          apikey: "",
        },
      };

export const DetectIntention = createFlowRouting
  .setKeyword(EVENTS.ACTION)
  .setIntentions({
    intentions: ["MENU_OPCIONES", "FAQ", "NO_DETECTED"],
    description: promptDetected,
  })
  .setAIModel(aiModelConfig)
  .create({
    afterEnd(flow) {
      return flow.addAction(async (ctx, { state, gotoFlow, flowDynamic }) => {
        try {
          const detected = await state.get("intention");
          console.log("INTENCION DETECT ", detected);
          
          // Si USE_GPT está desactivado o no se detectó intención, redirige al menú.
          if (config.USE_GPT !== "true" || !detected || detected === "NO_DETECTED") {
            await flowDynamic("❌ No se detectó una intención válida, redirigiendo al menú...");
            return gotoFlow(menuFlow);
          }
          // Si se detectó intención válida, redirige según corresponda.
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
