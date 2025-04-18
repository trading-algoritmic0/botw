import { addKeyword } from "@builderbot/bot";
import { menuFlow } from "./menuFlow";

const flowMensaje = addKeyword('mecanica_general')
    .addAnswer(
        'Aqui va un mensaje',
        {
            capture: false
        },
        async (ctx, {provider}) => {
            const list = {
                "header": {
                    "type": "text",
                    "text": "<HEADER_TEXT>"
                },
                "body": {
                    "text": "<BODY_TEXT>"
                },
                "footer": {
                    "text": "<FOOTER_TEXT>"
                },
                "action": {
                    "button": "<BUTTON_TEXT>",
                    "sections": [
                        {
                            "title": "<LIST_SECTION_1_TITLE>",
                            "rows": [
                                {
                                    "id": "<LIST_SECTION_1_ROW_1_ID>",
                                    "title": "<SECTION_1_ROW_1_TITLE>",
                                    "description": "<SECTION_1_ROW_1_DESC>"
                                },
                                {
                                    "id": "<LIST_SECTION_1_ROW_2_ID>",
                                    "title": "<SECTION_1_ROW_2_TITLE>",
                                    "description": "<SECTION_1_ROW_2_DESC>"
                                }
                            ]
                        },
                        {
                            "title": "<LIST_SECTION_2_TITLE>",
                            "rows": [
                                {
                                    "id": "<LIST_SECTION_2_ROW_1_ID>",
                                    "title": "<SECTION_2_ROW_1_TITLE>",
                                    "description": "<SECTION_2_ROW_1_DESC>"
                                },
                                {
                                    "id": "<LIST_SECTION_2_ROW_2_ID>",
                                    "title": "<SECTION_2_ROW_2_TITLE>",
                                    "description": "<SECTION_2_ROW_2_DESC>"
                                }
                            ]
                        }
                    ]
                }
            }
            await provider.sendList(ctx.from, list)
        }
    )

export { flowMensaje as mechanicalFlow };
