import { google } from "googleapis";
import { sheets_v4 } from "googleapis/build/src/apis/sheets";
import { config } from "../config";

import { google } from "googleapis";
import { sheets_v4 } from "googleapis/build/src/apis/sheets";
import { config } from "../config";

class SheetManager {
    private sheets: sheets_v4.Sheets;
    private spreadsheetId: string;

    constructor(spreadsheetId: string, privateKey: string, clientEmail: string) {
        const auth = new google.auth.GoogleAuth({
            credentials: {
                private_key: privateKey,
                client_email: clientEmail,
            },
            scopes: ["https://www.googleapis.com/auth/spreadsheets"],
        });

        this.sheets = google.sheets({ version: "v4", auth });
        this.spreadsheetId = spreadsheetId;
    }

    private normalizeNumber(number: string): string {
        return number.replace(/\D/g, '');
    }

    async userExists(number: string): Promise<boolean> {
        try {
            const normalizedNumber = this.normalizeNumber(number);
            const result = await this.sheets.spreadsheets.values.get({
                spreadsheetId: this.spreadsheetId,
                range: 'Users!A:A',
            });
            
            const rows = result.data.values;
            if (rows) {
                const numbers = rows.map(row => this.normalizeNumber(row[0] || ''));
                return numbers.includes(normalizedNumber);
            }
            return false;
        } catch (error) {
            console.error("Error al verificar si el usuario existe:", error);
            return false;
        }
    }

    async createUser(
        number: string,
        name: string,
        mail: string,
        plate: string,
        brandModel: string,
        fuelTransmission: string
    ): Promise<void> {
        try {
            const normalizedNumber = this.normalizeNumber(number);
            await this.sheets.spreadsheets.values.append({
                spreadsheetId: this.spreadsheetId,
                range: 'Users!A:F',
                valueInputOption: 'RAW',
                requestBody: {
                    values: [[normalizedNumber, name, mail, plate, brandModel, fuelTransmission]],
                },
            });

            await this.sheets.spreadsheets.batchUpdate({
                spreadsheetId: this.spreadsheetId,
                requestBody: {
                    requests: [
                        { addSheet: { properties: { title: normalizedNumber } },
                        { addSheet: { properties: { title: `citas-${normalizedNumber}` } },
                    ],
                },
            });

            await this.sheets.spreadsheets.values.update({
                spreadsheetId: this.spreadsheetId,
                range: `citas-${normalizedNumber}!A1:G1`,
                valueInputOption: 'RAW',
                requestBody: {
                    values: [
                        ["Fecha cita", "Servicio", "Sede", "Estado", "Notas", "Última actualización", "Operador"]
                    ],
                },
            });
        } catch (error) {
            console.error("Error al crear usuario o nueva pestaña:", error);
        }
    }

    async getUserConv(number: string): Promise<any[]> {
        try {
            const result = await this.sheets.spreadsheets.values.get({
                spreadsheetId: this.spreadsheetId,
                range: `${number}!A:C`,
            });
            const rows = result.data.values;
            if (!rows || rows.length === 0) {
                return [];
            }
            const lastConversations = rows.slice(0, 3);
            const formattedConversations = [];
            for (let i = 0; i < lastConversations.length; i++) {
                const [userQuestion, assistantAnswer] = lastConversations[i];
                formattedConversations.push(
                    { role: "user", content: userQuestion },
                    { role: "assistant", content: assistantAnswer }
                );
            }
            return formattedConversations;
        } catch (error) {
            console.error("Error al obtener la conversación del usuario:", error);
            return [];
        }
    }

    async addConverToUser(number: string, conversation: { role: string, content: string }[]): Promise<void> {
        try {
            const question = conversation.find(c => c.role === "user")?.content;
            const answer = conversation.find(c => c.role === "assistant")?.content;
            const date = new Date().toISOString();
            if (!question || !answer) {
                throw new Error("La conversación debe contener tanto una pregunta como una respuesta.");
            }
            const sheetData = await this.sheets.spreadsheets.values.get({
                spreadsheetId: this.spreadsheetId,
                range: `${number}!A:C`,
            });
            const rows = sheetData.data.values || [];
            rows.unshift([question, answer, date]);
            await this.sheets.spreadsheets.values.update({
                spreadsheetId: this.spreadsheetId,
                range: `${number}!A:C`,
                valueInputOption: 'RAW',
                requestBody: { values: rows },
            });
        } catch (error) {
            console.error("Error al agregar la conversación:", error);
        }
    }

    async addAppointmentToUser(
        number: string,
        appointment: {
            date: string;
            service: string;
            sede: string;
            status: string;
            notes: string;
            lastUpdate: string;
            operator: string;
        }
    ): Promise<void> {
        try {
            const citasSheet = `citas-${number}`;

            await this.sheets.spreadsheets.values.append({
                spreadsheetId: this.spreadsheetId,
                range: `${citasSheet}!A:G`,
                valueInputOption: 'RAW',
                requestBody: {
                    values: [[
                        appointment.date,
                        appointment.service,
                        appointment.sede,
                        appointment.status,
                        appointment.notes,
                        appointment.lastUpdate,
                        appointment.operator
                    ]],
                },
            });
        } catch (error) {
            console.error("Error al agregar la cita:", error);
        }
    }

    // 🔧 Lugar preparado para futura función update
    // async updateAppointment(...) { 
    //     → aquí puedes implementar la actualización de citas (cambiar estado, fecha, etc.)
    // }
}

export default new SheetManager(
    config.spreadsheetId,
    config.privateKey,
    config.clientEmail
);
