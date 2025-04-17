import { addKeyword, EVENTS, END_FLOW } from "@builderbot/bot";
import { chatwoot } from "../app";

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
            ],
          },
        ],
      },
    };

    await provider.sendList(`${ctx.from}@s.whatsapp.net`, list);
  })
  .addAnswer(null, { capture: true }, async (ctx, { flowDynamic }) => {
    const option = ctx?.id || ctx?.body?.toLowerCase().replace(/ /g, "_");

    switch (option) {
      case "mecanica_general":
        await flowDynamic("🔧 Este flujo aún está en construcción.");
        return END_FLOW;

      case "repuestos":
        await flowDynamic("🛠️ Este flujo aún está en construcción.");
        return END_FLOW;

      case "consultar_citas":
        await flowDynamic("📅 Este flujo aún está en construcción.");
        return END_FLOW;

      case "contactar_asesor":
        await chatwoot.checkAndSetCustomAttribute();

        const inbox = await chatwoot.findOrCreateInbox({ name: "TecniRacer" });

        const contact = await chatwoot.findOrCreateContact({
          from: ctx.from,
          name: ctx.pushName || "Cliente",
          inbox: inbox.id,
        });

        const conversation = await chatwoot.getOpenConversation({
          contact_id: contact.id,
          inbox_id: inbox.id,
        });

        if (!conversation) {
          const newConversation = await chatwoot.createConversation({
            contact_id: contact.id,
            inbox_id: inbox.id,
            phone_number: ctx.from,
          });

          await chatwoot.createMessage({
            msg: "📩 El cliente ha solicitado hablar con un asesor desde el menú.",
            mode: "incoming",
            conversation_id: newConversation.id,
            attachment: [],
          });
        } else {
          await chatwoot.createMessage({
            msg: "📩 El cliente ha vuelto a solicitar hablar con un asesor desde el menú.",
            mode: "incoming",
            conversation_id: conversation.id,
            attachment: [],
          });
        }

        await flowDynamic("🧑‍💼 Listo, en breve un asesor se pondrá en contacto con vos.");
        return END_FLOW;

      default:
        await flowDynamic("❌ Opción no válida. Por favor seleccioná del menú.");
        return END_FLOW;
    }
  });

export { menuFlow };
