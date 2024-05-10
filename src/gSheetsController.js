const { GoogleSpreadsheet } = require("google-spreadsheet");
const { JWT } = require("google-auth-library");

// Initialize auth - see https://theoephraim.github.io/node-google-spreadsheet/#/guides/authentication
const creds = JSON.parse(process.env.CREDENTIALS);
const serviceAccountAuth = new JWT({
    email: creds.client_email,
    key: creds.private_key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const logger = require("./logger");

class gSheetsController {
    async addUserResults(user) {
        try {
            const doc = new GoogleSpreadsheet(
                process.env.GOOGLE_SHEETS_FILE_ID,
                serviceAccountAuth
            );
            await doc.loadInfo();
            const sheet = doc.sheetsByIndex[0];
            await sheet.addRow({
                "chatID користувача": user.user.id,
                "ID користувача": user.user.username,
                "1 питання": user.answers[1],
                "2 питання": user.answers[2],
                "3 питання": user.answers[3],
                "4 питання": user.answers[4],
                "5 питання": user.answers[5],
                "Номер телефону": user.answers[6],
                "Ім'я": user.answers[7],
            });
        } catch (error) {
            logger.logError(error);
        }
    }

    async getNonSignedUsers() {
        try {
            const doc = new GoogleSpreadsheet(
                process.env.GOOGLE_SHEETS_FILE_ID,
                serviceAccountAuth
            );
            await doc.loadInfo();
            const sheet = doc.sheetsByIndex[1];
            const rows = await sheet.getRows();
            const objRows = [];
            for (const row of rows) {
                objRows.push(row.toObject());
            }
            return objRows;
        } catch (error) {
            logger.logError(error);
        }
    }

    async addNonSignedUsers(user) {
        try {
            const doc = new GoogleSpreadsheet(
                process.env.GOOGLE_SHEETS_FILE_ID,
                serviceAccountAuth
            );
            await doc.loadInfo();
            const sheet = doc.sheetsByIndex[1];
            await sheet.addRow({
                "chatID користувача": user.user.id,
                "ID користувача": user.user.username,
            });
        } catch (error) {
            logger.logError(error);
        }
    }

    async deleteNonSignedUsers(userId) {
        try {
            const doc = new GoogleSpreadsheet(
                process.env.GOOGLE_SHEETS_FILE_ID,
                serviceAccountAuth
            );
            await doc.loadInfo();
            const sheet = doc.sheetsByIndex[1];
            const rows = await sheet.getRows();
            const objRows = [];
            for (const row of rows) {
                if (row.get("chatID користувача") == userId) {
                    row.delete();
                }
            }
            return objRows;
        } catch (error) {
            logger.logError(error);
        }
    }
}

module.exports = new gSheetsController();
