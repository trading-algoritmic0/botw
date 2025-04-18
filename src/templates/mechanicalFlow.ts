import { addKeyword } from "@builderbot/bot";
import { menuFlow } from "./menuFlow";

const mechanicalFlow = addKeyword('mecanica_general')
    .addAnswer(
        '🔧 ¿Con qué servicio de mecánica general podemos ayudarte?',
        {
            capture: false
        },
        async (ctx, {provider}) => {
            const list = {
                "header": {
                    "type": "text",
                    "text": "Servicios de Mecánica General"
                },
                "body": {
                    "text": "Seleccioná uno de los siguientes servicios disponibles 👇"
                },
                "footer": {
                    "text": "TecniRacer - Taller confiable"
                },
                "action": {
                    "button": "📋 Ver servicios",
                    "sections": [
                        {
                            "title": "Sede Principal",
                            "rows": [
                                {
                                    "id": "cambio_aceite",
                                    "title": "Cambio de aceite",
                                    "description": "Realizado en sede principal"
                                },
                                {
                                    "id": "revision_frenos",
                                    "title": "Revisión de frenos",
                                    "description": "Realizado en sede principal"
                                }
                            ]
                        },
                        {
                            "title": "Talleres Aliados",
                            "rows": [
                                {
                                    "id": "revision_caja",
                                    "title": "Revisión de caja automática",
                                    "description": "Taller TransTec"
                                },
                                {
                                    "id": "otro_servicio",
                                    "title": "Otro servicio / Consultar asesor",
                                    "description": "Taller Asistencia"
                                }
                            ]
                        }
                    ]
                }
            };
            await provider.sendList(ctx.from, list)
        }
    );

export { mechanicalFlow };
