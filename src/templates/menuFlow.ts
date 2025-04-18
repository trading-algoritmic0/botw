import { addKeyword, EVENTS } from "@builderbot/bot";
import { chatwoot } from "../app";
import { mechanicalFlow } from "./mechanicalFlow";
import { partsFlow } from "./partsFlow";
import { appointmentsFlow } from "./appointmentsFlow";
// Si luego creas otro flow, solo importa aquí:
// import { customFlow } from "./customFlow";

const menuFlow = addKeyword(EVENTS.ACTION)
  .addAction(async (ctx, { provider }) => {
    const list = {
      header: { type: "text", text: "Menú de Opciones" },
      body: { text: "Seleccioná lo que necesitás 👇\n\nTecniRacer 💠" },
      footer: { text: "" },
      action: {
        button: "📋 Ver opciones",
        sections: [
          {
            title: "Opciones disponibles",
            rows: [
              {
                id: "mecanica_general",
                title: "🔧 Mecánica General",
                description: "Servicios y mantenimiento",
              },
              {
                id: "repuestos",
                title: "🛠️ Repuestos",
                description: "Pedir repuestos o consultar stock",
              },
              {
                id: "consultar_citas",
                title: "📅 Consultar Citas",
                description: "Ver tus citas agendadas",
              },
              {
                id: "contactar_asesor",
                title: "💬 Contactar Asesor",
                description: "Hablar con una persona del equipo",
              },
              {
                id: "porsiacaso",
                title: "✨ Función adicional",
                description: "Ejecutar flujo extra",
              },
            ],
          },
        ],
      },
    };

    // Enviar lista interactiva
    await provider.sendList(`${ctx.from}@s.whatsapp.net`, list);
  })
  .addAnswer(
    "",
    { capture: true },
    async (ctx, { flowDynamic, gotoFlow, endFlow }) => {
      const option = ctx.id || ctx.body?.toLowerCase().replace(/ /g, "_");

      switch (option) {
        case "mecanica_general":
          // redirige a mechanicalFlow
          return gotoFlow(mechanicalFlow);

        case "repuestos":
          // redirige a partsFlow
          return gotoFlow(partsFlow);

        case "consultar_citas":
          // redirige a appointmentsFlow
          return gotoFlow(appointmentsFlow);

        case "contactar_asesor":
          // lógica Chatwoot para contacto humano
          const inbox = await chatwoot.findOrCreateInbox({ name: "Chatbot" });
          await chatwoot.checkAndSetCustomAttribute();
          const contact = await chatwoot.findOrCreateContact({
            from: ctx.from,
            name: ctx.pushName || "Cliente",
            inbox: inbox.id,
          });
          const openConversation = await chatwoot.getOpenConversation({
            contact_id: contact.id,
            inbox_id: inbox.id,
          });
          if (openConversation) {
            await chatwoot.createMessage({
              msg: "📩 El cliente ha vuelto a solicitar hablar con un asesor desde el menú.",
              mode: "incoming",
              conversation_id: openConversation.id,
              attachment: [],
            });
          } else {
            const newConversation = await chatwoot.findOrCreateConversation({
              inbox_id: inbox.id,
              contact_id: contact.id,
              phone_number: ctx.from,
            });
            if (newConversation && "id" in newConversation) {
              await chatwoot.createMessage({
                msg: "📩 El cliente ha solicitado hablar con un asesor desde el menú.",
                mode: "incoming",
                conversation_id: newConversation.id,
                attachment: [],
              });
            }
          }
          await flowDynamic("🧑‍💼 Listo, en breve un asesor se pondrá en contacto con vos.");
          return endFlow();

        case "porsiacaso":
          // flujo extra o respuesta directa
          await flowDynamic("🚀 Has ejecutado la función adicional. ¿En qué más te puedo ayudar?");
          // podrías redirigir a otro flow:
          // return gotoFlow(customFlow);
          return gotoFlow(menuFlow);

        default:
          // si no coincide ninguna opción
          await flowDynamic("❌ Opción no válida. Por favor, seleccioná una del menú.");
          return gotoFlow(menuFlow);
      }
    }
  );

export { menuFlow };
