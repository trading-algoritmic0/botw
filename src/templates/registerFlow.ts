import { addKeyword, EVENTS } from "@builderbot/bot"
import sheetsService from "../services/sheetsService"
import { menuFlow } from "./menuFlow" // ✅ Importamos el flujo al que queremos redirigir

const registerFlow = addKeyword(EVENTS.ACTION)
  .addAnswer(
    `¿Querés comenzar con el Registro?`,
    {
      capture: true,
      buttons: [{ body: "Si, quiero!" }, { body: "No, gracias!" }],
    },
    async (ctx, ctxFn) => {
      if (ctx.body === "No, gracias!") {
        return ctxFn.endFlow(
          "El registro fue cancelado. Podés volver a escribirle al bot para registrarte."
        )
      } else if (ctx.body === "Si, quiero!") {
        await ctxFn.flowDynamic(
          "Perfecto, voy a proceder a hacerte algunas preguntas 📝"
        )
      } else {
        return ctxFn.fallBack("Tenés que elegir alguna de las opciones.")
      }
    }
  )
  .addAnswer(
    `Primero, ¿cuál es tu nombre?`,
    { capture: true },
    async (ctx, ctxFn) => {
      await ctxFn.flowDynamic("Perfecto " + ctx.body + "! 🙌")
      await ctxFn.state.update({ name: ctx.body })
    }
  )
  .addAnswer(
    `Ahora, ¿cuál es tu mail?`,
    { capture: true },
    async (ctx, ctxFn) => {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      if (!emailRegex.test(ctx.body)) {
        return ctxFn.fallBack(
          "Por favor, ingresá un correo electrónico válido. 📧"
        )
      }

      const state = ctxFn.state.getMyState()
      await sheetsService.createUser(ctx.from, state.name, ctx.body)

      await ctxFn.flowDynamic(
        "✅ ¡Excelente! Tus datos ya fueron cargados con éxito. Ahora podés ver las opciones disponibles 👇"
      )

      return ctxFn.gotoFlow(menuFlow) // ✅ Redirección automática al menú
    }
  )

export { registerFlow }
