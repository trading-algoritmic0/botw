import { createFlowRouting } from "@builderbot-plugins/langchain";
import { EVENTS } from "@builderbot/bot";
import { menuFlow } from "./menuFlow";
import { faqFlow } from "./faqFlow";
import { config } from "../config";
import path from "path";
import fs from "fs";

// Se lee el prompt que se usará para la detección de intención
const Prompt_DETECTED = path.join(
  process.cwd(),
  "public/assets/prompts",
  "prompt_Detection.txt"
);
const promptDetected = fs.readFileSync(Prompt_DETECTED, "utf8");

// Se crea el flujo de detección de intención
export const DetectIntention = createFlowRouting
  .setKeyword(EVENTS.ACTION)
  .setIntentions({
    intentions: ["MENU_OPCIONES", "FAQ", "NO_DETECTED"],
    description: promptDetected,
  })
  // Solo se configura la llamada a OpenAI si USE_GPT está activado.
  .setAIModel(
    config.USE_GPT === "true"
      ? {
          modelName: "openai" as any,
          args: {
            modelName: config.Model,
            apikey: config.ApiKey,
          },
        }
      : undefined
  )
  .create({
    afterEnd(flow) {
      return flow.addAction(async (ctx, { state, endFlow, gotoFlow, flowDynamic }) => {
        try {
          const detected = await state.get("intention");
          console.log("INTENCION DETECT ", detected);

          // Si GPT NO está activado o no se detectó intención, se invoca el fallback.
          if (config.USE_GPT !== "true" || !detected || detected === "NO_DETECTED") {
            await flowDynamic("❌ No se detectó una intención válida. Redirigiendo al menú...");
            return gotoFlow(menuFlow);
          }

          // Si se detectó una intención válida, redirige según corresponda.
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
