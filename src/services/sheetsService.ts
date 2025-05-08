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

    async userExists(number: string): Promise<boolean> {
        try {
            const result = await this.sheets.spreadsheets.values.get({
                spreadsheetId: this.spreadsheetId,
                range: 'Users!A:A',
            });
            const rows = result.data.values;
            if (rows) {
                const numbers = rows.map(row => row[0]);
                return numbers.includes(number);
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
            await this.sheets.spreadsheets.values.append({
                spreadsheetId: this.spreadsheetId,
                range: 'Users!A:F',
                valueInputOption: 'RAW',
                requestBody: {
                    values: [[number, name, mail, plate, brandModel, fuelTransmission]],
                },
            });

            await this.sheets.spreadsheets.batchUpdate({
                spreadsheetId: this.spreadsheetId,
                requestBody: {
                    requests: [
                        {
                            addSheet: {
                                properties: {
                                    title: number,
                                },
                            },
                        },
                    ],
                },
            });

            // Añadir encabezados en la pestaña del usuario
            await this.sheets.spreadsheets.values.update({
                spreadsheetId: this.spreadsheetId,
                range: `${number}!A1:G1`,
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

    async addAppointmentToUser(
        number: string,
        appointment: {
            date: string;
            service: string;
            sede: string; // "Principal" o "Aliado"
            status: string; // "Confirmada", "Pendiente", "Cancelada"
            notes: string;
            lastUpdate: string;
            operator: string;
        }
    ): Promise<void> {
        try {
            const sheetData = await this.sheets.spreadsheets.values.get({
                spreadsheetId: this.spreadsheetId,
                range: `${number}!A:G`,
            });

            const rows = sheetData.data.values || [];

            // Insertar al inicio (debajo de encabezado si ya está)
            if (rows.length > 0 && rows[0][0] === "Fecha cita") {
                rows.splice(1, 0, [
                    appointment.date,
                    appointment.service,
                    appointment.sede,
                    appointment.status,
                    appointment.notes,
                    appointment.lastUpdate,
                    appointment.operator
                ]);
            } else {
                rows.unshift([
                    appointment.date,
                    appointment.service,
                    appointment.sede,
                    appointment.status,
                    appointment.notes,
                    appointment.lastUpdate,
                    appointment.operator
                ]);
            }

            await this.sheets.spreadsheets.values.update({
                spreadsheetId: this.spreadsheetId,
                range: `${number}!A:G`,
                valueInputOption: 'RAW',
                requestBody: { values: rows },
            });

        } catch (error) {
            console.error("Error al agregar la cita:", error);
        }
    }
}

export default new SheetManager(
    config.spreadsheetId,
    config.privateKey,
    config.clientEmail
);
