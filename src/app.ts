import { ChatwootClass } from "./services/chatwoot/chatwoot.class";
import { MemoryDB as Database } from "@builderbot/bot";
import { handlerMessage } from "./services/chatwoot";
import downloadFile from "./utils/downloaderUtils";
import { createBot } from "@builderbot/bot";
import ServerHttp from "./services/http";
import { provider } from "./provider";
import templates from "./templates";
import { config } from "./config";
import Queue from "queue-promise";
import path from "path";
import fs from "fs";

const ASSETS_FOLDER = path.join(process.cwd(), "public/assets");

const chatwoot = new ChatwootClass({
  account: config.CHATWOOT_ACCOUNT_ID,
  token: config.CHATWOOT_TOKEN,
  endpoint: config.CHATWOOT_ENDPOINT,
});

const queue = new Queue({
  concurrent: 1,
  interval: 500,
});

const main = async () => {
  const bot = await createBot(
    {
      flow: templates,
      provider,
      database: new Database(),
    },
    {
      queue: {
        timeout: 20000,
        concurrencyLimit: 50,
      },
    }
  );
  const { handleCtx, httpServer } = await bot;

  new ServerHttp(provider, bot);

  // ✅ HEALTH CHECK
  provider.server.get("/v1/health", (res) => {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "ok" }));
  });

  // ✅ BLACKLIST
  provider.server.post(
    "/v1/blacklist",
    handleCtx(async (bot, req, res) => {
      const { number, intent } = req.body;
      if (intent === "remove") {
        bot.blacklist.remove(number);
        await bot.dispatch("GRACIA_FLOW", { from: number, name: "Cliente" });
        return res.end("trigger");
      }
      if (intent === "add") {
        bot.blacklist.add(number);
      }
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ status: "ok", number, intent }));
    })
  );

  // ✅ WEBHOOK BLINDADO (🔥 FIX principal)
  provider.server.post("/webhook", async (req, res) => {
    try {
      console.log("[📩 Webhook recibido]", {
        headers: req.headers,
        body: req.body,
      });

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true }));
    } catch (err: any) {
      console.error("❌ Error en /webhook:", err);

      res.writeHead(400, { "Content-Type": "application/json" });
      const safeMessage =
        err instanceof Error ? err.message : "Error inesperado en webhook";
      res.end(JSON.stringify({ error: safeMessage }));
    }
  });

  // ✅ MENSAJES ENTRANTES
  provider.on("message", (payload) => {
    queue.enqueue(async () => {
      try {
        const attachment = [];

        if (payload?.body?.includes("_event_") && payload?.url) {
          const { filePath } = await downloadFile(payload.url, config.jwtToken);
          if (filePath) {
            attachment.push(filePath);
            console.log("FILE PATH", filePath);
          } else {
            console.log("No se pudo descargar el archivo.");
          }
        }

        await handlerMessage(
          {
            phone: payload.from,
            name: payload.pushName,
            message: payload?.body?.includes("_event_")
              ? "Archivo adjunto"
              : payload.body,
            attachment,
            mode: "incoming",
          },
          chatwoot
        );

        if (attachment.length > 0 && attachment[0]) {
          const absoluteFilePath = path.resolve(attachment[0]);
          const absoluteAssetsFolder = path.resolve(ASSETS_FOLDER);

          if (!absoluteFilePath.startsWith(absoluteAssetsFolder)) {
            try {
              if (fs.existsSync(absoluteFilePath)) {
                fs.unlinkSync(absoluteFilePath);
                console.log(`Archivo eliminado: ${absoluteFilePath}`);
              } else {
                console.log(`Archivo no encontrado: ${absoluteFilePath}`);
              }
            } catch (err) {
              console.error(
                `Error al eliminar el archivo: ${absoluteFilePath}`,
                err
              );
            }
          }
        }
      } catch (err) {
        console.log("ERROR", err);
      }
    });
  });

  // ✅ MENSAJES SALIENTES
  bot.on("send_message", (payload) => {
    queue.enqueue(async () => {
      const attachment = [];
      let absoluteFilePath = null;

      if (payload.options?.media) {
        if (
          typeof payload.options.media === "string" &&
          (payload.options.media.includes("http") ||
            payload.options.media.includes("https"))
        ) {
          const { filePath } = await downloadFile(payload.options.media);
          if (filePath) {
            attachment.push(filePath);
            absoluteFilePath = path.resolve(filePath);
            console.log("FILE PATH", filePath);
          }
        } else if (typeof payload.options.media === "string") {
          attachment.push(payload.options.media);
          absoluteFilePath = path.resolve(payload.options.media);
        }
      }

      await handlerMessage(
        {
          phone: payload.from,
          name: payload.from,
          message: payload.answer,
          mode: "outgoing",
          attachment: attachment,
        },
        chatwoot
      );

      if (absoluteFilePath) {
        const absoluteAssetsFolder = path.resolve(ASSETS_FOLDER);

        if (!absoluteFilePath.startsWith(absoluteAssetsFolder)) {
          try {
            if (fs.existsSync(absoluteFilePath)) {
              fs.unlinkSync(absoluteFilePath);
              console.log(`Archivo eliminado: ${absoluteFilePath}`);
            } else {
              console.log(`Archivo no encontrado: ${absoluteFilePath}`);
            }
          } catch (err) {
            console.error(
              `Error al eliminar el archivo: ${absoluteFilePath}`,
              err
            );
          }
        } else {
          console.log(
            `Archivo no eliminado porque está en la carpeta de assets: ${absoluteFilePath}`
          );
        }
      }
    });
  });

  // ✅ INICIAR SERVIDOR
  httpServer(+config.PORT);
};

main();
