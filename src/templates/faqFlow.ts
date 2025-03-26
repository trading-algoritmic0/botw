import { addKeyword, EVENTS } from "@builderbot/bot";
import aiServices from "~/services/aiServices";
import sheetsService from "~/services/sheetsService";
import { config } from "../config";
import path from "path";
import fs, { stat } from "fs";

const pathPrompt = path.join(
  process.cwd(),
  "public/assets/prompts",
  "prompt_OpenAi.txt"
);
const prompt = fs.readFileSync(pathPrompt, "utf8");

export const faqFlow = addKeyword(EVENTS.ACTION).addAction(
  async (ctx, { endFlow }) => {
    const history = await sheetsService.getUserConv(ctx.from);
    history.push({ role: "user", content: ctx.body });

    try {
      const AI = new aiServices(config.ApiKey);
      const response = await AI.chat(prompt, history);
      await sheetsService.addConverToUser(ctx.from, [
        { role: "user", content: ctx.body },
        { role: "assistant", content: response },
      ]);
      return endFlow(response);
    } catch (error) {
      console.log("Error en llamada GPT", error);
      return endFlow("Por favor, intenta de nuevo");
    }
  }
);
