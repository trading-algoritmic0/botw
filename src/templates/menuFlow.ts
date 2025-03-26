import { addKeyword, EVENTS } from "@builderbot/bot";

const menuFlow = addKeyword(EVENTS.ACTION).addAction(
  async (ctx, { provider }) => {
    const list = {
      header: {
        type: "text",
        text: "Menu de Opciones",
      },
      body: {
        text: "Te voy a dar las opciones que tengo disponibles",
      },
      footer: {
        text: "",
      },
      action: {
        button: "Opciones",
        sections: [
          {
            title: "Acciones",
            rows: [
              {
                id: "GS0310971",
                title: "Audio",
                description: "🔊 Quiero escuchar un audio",
              },
              {
                id: "GS0310972",
                title: "Imagen",
                description: "🖼️ Quiero recibir una imagen",
              },
              {
                id: "GS0310973",
                title: "PDF",
                description: "🧾 Quiero recibir un PDF",
              },
            ],
          },
        ],
      },
    };
    await provider.sendList(`${ctx.from}@s.whatsapp.net`, list);
  }
);

export { menuFlow };
