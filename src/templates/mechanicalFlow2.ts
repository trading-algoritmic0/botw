import { addKeyword } from "@builderbot/bot";
import { mechanicalFlow } from "./mechanicalFlow";

const mechanicalFlow2 = addKeyword(["mecanica_general2"])
 .addAnswer(
    'Por favor selecciona una opción:',
    { capture: false },
    async (ctx, { provider }) => {
      const list = {
        header: {
          type: "text",
          text: "Servicio mecánico TecniRacer 2"
        },
        body: {
          text: "MENU 2"
        },
        footer: {
          text: "✅ Selecciona una opción"
        },
        action: {
          button: "Servicios",
          sections: [
            {
              title: "Sede Principal 🔧",
              rows: [
                {
                  id: "PNDM9",
                  title: "Cambio de aceite",
                  description: "Servicio realizado en sede principal"
                },
                {
                  id: "PNDM8",
                  title: "Revision Frenos",
                  description: "Revision de Frenos"
                },
                {
                  id: "PNDM7",
                  title: "Revision Suspencion",
                  description: "Revision de Suspencion"
                },
                {
                  id: "PNDM6",
                  title: "Sincronizacion",
                  description: "Sincronizacion de motor"
                }
              ]
            },
            {
              title: "Talleres Aliados 🔧",
              rows: [
                {
                  id: "ZDDY4",
                  title: "Alineacion/balanceo",
                  description: "Alineacion y balanceo"
                },
                {
                  id: "ZDDY2",
                  title: "Tapiceria y cojineria",
                  description: "Tapicería y cojineria"
                },
                {
                  id: "ZDDY1",
                  title: "Accesorios y lujos",
                  description: "Accesorios y lujos"
                },
                {
                  id: "VOLVER1",
                  title: "VOLVER",
                  description: "REGRESAR"
                }
              ]
            }
          ]
        }
      }
      await provider.sendList(ctx.from, list)
    }
  )
  .addAnswer(
    "", 
    { capture: true },
    async (ctx, { flowDynamic, gotoFlow }) => {
      const sel = ctx.body?.trim();

      // Si pulsa “Volver” regreso al primer flujo
      if (sel === "VOLVER1") {
        return gotoFlow(mechanicalFlow);
      }

      // Cualquier otro servicio:
      await flowDynamic(`✅ Has seleccionado *${sel}*`);
      await flowDynamic("¿Deseás agendar una cita para este servicio?");
      await flowDynamic("📆 Responde *sí* para continuar o *no* para volver al menú.");
    }
  );

export { mechanicalFlow2 };
