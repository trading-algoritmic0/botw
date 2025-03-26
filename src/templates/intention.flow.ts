import { createFlowRouting } from "@builderbot-plugins/langchain";
import { EVENTS } from "@builderbot/bot";
import { menuFlow } from "./menuFlow";
import { faqFlow } from "./faqFlow";
import { config } from "../config";
import path from "path";
import fs from "fs";

const Prompt_DETECTED = path.join(
  process.cwd(),
  "public/assets/prompts",
  "prompt_Detection.txt"
);

const promptDetected = fs.readFileSync(Prompt_DETECTED, "utf8");

export const DetectIntention = createFlowRouting
  .setKeyword(EVENTS.ACTION)
  .setIntentions({
    intentions: ["MENU_OPCIONES", "FAQ", "NO_DETECTED"],
    description: promptDetected,
  })
  .setAIModel({
    modelName: "openai" as any,
    args: {
      modelName: config.Model,
      apikey: config.ApiKey,
    },
  })
  .create({
    afterEnd(flow) {
      return flow.addAction(async (ctx, { state, endFlow, gotoFlow }) => {
        try {
          console.log("INTENCION DETECT ", await state.get("intention"));

          if ((await state.get("intention")) === "NO_DETECTED") {
            return endFlow("Tu mensaje esta fuera de contexto");
          }

          if ((await state.get("intention")) === "MENU_OPCIONES") {
            return gotoFlow(menuFlow);
          }

          if ((await state.get("intention")) === "FAQ") {
            return gotoFlow(faqFlow);
          }
        } catch (error) {
          console.error("Error en DetectIntention: ", error);
        }
      });
    },
  });
