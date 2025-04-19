import { sendVoiceFlow } from "./list_templates/sendVoiceFlow";
import { sendImageFlow } from "./list_templates/sendImageFlow";
import { sendPdfFlow } from "./list_templates/sendPdfFlow";
import { DetectIntention } from "./intention.flow";
import { registerFlow } from "./registerFlow";
import { createFlow } from "@builderbot/bot";
import { mainFlow } from "./mainFlow";
import { menuFlow } from "./menuFlow";
import { faqFlow } from "./faqFlow";
import { fallbackFlow } from "./fallbackFlow";
import { mechanicalFlow } from "./mechanicalFlow";
import { mechanicalFlow2 } from "./mechanical/mechanicalFlow2";
import { ayBalanceo } from "./mechanical/ayBalanceo";

export default createFlow([
  mainFlow,
  faqFlow,
  registerFlow,
  menuFlow,
  mechanicalFlow,
  ayBalanceo,
  mechanicalFlow2,
  sendImageFlow,
  sendPdfFlow,
  sendVoiceFlow,
  DetectIntention,
  fallbackFlow,
]);
