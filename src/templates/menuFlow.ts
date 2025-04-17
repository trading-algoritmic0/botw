import { addKeyword, EVENTS } from "@builderbot/bot";
import { chatwoot } from "../app";

const menuFlow = addKeyword(EVENTS.ACTION)
  .addAction(async (ctx, { provider }) => {
    const list = {
      header: {
        type: "text",
        text: "Menú de Opciones",
      },
      body: {
        text: "Seleccioná lo que necesitás 👇\n\nTecniRacer 💠",
      },
      footer: {
        text: "",
      },
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
  .addAction(async (ctx, { flowDynamic, ctxFn }) => {
    const option = ctx?.id;

    // Validación: si no viene de una opción seleccionada
    if (!option) {
      await flowDynamic("⚠️ Por favor seleccioná una opción del listado usando *Ver opciones*.");
      return ctxFn.endFlow(); // finaliza el flujo para evitar que siga "escuchando"
    }

    switch (option) {
      case "mecanica_general":
        await flowDynamic("🔧 Este flujo aún está en construcción.");
        return ctxFn.endFlow();

      case "repuestos":
        await flowDynamic("🛠️ Este flujo aún está en construcción.");
        return ctxFn.endFlow();

      case "consultar_citas":
        await flowDynamic("📅 Este flujo aún está en construcción.");
        return ctxFn.endFlow();

      case "contactar_asesor":
        await chatwoot.checkAndSetCustomAttribute();

        const inbox = await chatwoot.findOrCreateInbox({ name: "TecniRacer" });

        const contact = await chatwoot.findOrCreateContact({
          from: ctx.from,
          name: ctx.pushName || "Cliente",
          inbox: inbox.id,
        });

        const conversation = await chatwoot.findOrCreateConversation({
          inbox_id: inbox.id,
          contact_id: contact.id,
          phone_number: ctx.from,
        });

        await chatwoot.createMessage({
          msg: "📩 El cliente ha solicitado hablar con un asesor desde el menú.",
          mode: "incoming",
          conversation_id: conversation.id,
          attachment: [],
        });

        await flowDynamic("🧑‍💼 Listo, en breve un asesor se pondrá en contacto con vos.");
        return ctxFn.endFlow();
    }
  });

export { menuFlow };
