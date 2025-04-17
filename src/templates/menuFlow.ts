import { addKeyword } from "@builderbot/bot";
import { mechanicalFlow } from "./mechanicalFlow";
import { partsFlow } from "./partsFlow";
import { appointmentsFlow } from "./appointmentsFlow";
import { chatwoot } from "../app"; // Asegúrate que esté exportado en app.ts

const menuFlow = addKeyword(["menu", "menú", "opciones", "volver"])
  .addAction(async (ctx, { provider, state, gotoFlow, fallBack, flowDynamic }) => {
    const list = {
      header: {
        type: "text",
        text: "Menú de Opciones",
      },
      body: {
        text: "Seleccioná lo que necesitás 👇",
      },
      footer: {
        text: "TecniRacer - Sin adornos, solo mecánica pura 🛠️",
      },
      action: {
        button: "📋 Ver opciones",
        sections: [
          {
            title: "Servicios disponibles",
            rows: [
              {
                id: "mecanica_general",
                title: "🔧 Mecánica General",
                description: "Mantenimiento, revisión, diagnóstico",
              },
              {
                id: "repuestos",
                title: "🛠️ Repuestos",
                description: "Consulta repuestos con un asesor",
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

  // Manejamos la selección
  .addAction(async (ctx, { gotoFlow, fallBack, flowDynamic, state }) => {
    const option = ctx?.body?.toLowerCase();

    switch (option) {
      case "🔧 mecánica general":
        return gotoFlow(mechanicalFlow);

      case "🛠️ repuestos":
        return gotoFlow(partsFlow);

      case "📅 consultar citas":
        return gotoFlow(appointmentsFlow);

      case "💬 contactar asesor": {
        const userState = state.getMyState();

        // Creamos conversación con Chatwoot
        await chatwoot.findOrCreateInbox({ name: "Chatbot" });
        await chatwoot.checkAndSetCustomAttribute();

        const contact = await chatwoot.findOrCreateContact({
          from: ctx.from,
          name: userState?.name || "Cliente",
          inbox: "Chatbot",
        });

        const conversation = await chatwoot.findOrCreateConversation({
          inbox_id: contact.inbox_id || contact.inbox?.id,
          contact_id: contact.id,
          phone_number: ctx.from,
        });

        await chatwoot.createMessage({
          msg: `📥 *Nuevo cliente solicita hablar con un asesor*\n\n📱 Número: +${ctx.from}\n👤 Nombre: ${userState?.name || "Desconocido"}`,
          mode: "incoming",
          conversation_id: conversation.id,
          attachment: [],
        });

        await flowDynamic("✅ Te he conectado con un asesor. En breve te responderán.");

        return;
      }

      default:
        return fallBack("⚠️ Por favor seleccioná una opción válida del menú.");
    }
  });

export { menuFlow };
