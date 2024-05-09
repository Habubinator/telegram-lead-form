const fs = require("fs");
const path = require("path");

class Logger {
    constructor() {
        this.logDirectory = "./logs";
        this.ensureDirectoryExists(this.logDirectory);
    }

    ensureDirectoryExists(dirPath) {
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath);
        }
    }

    logError(error, ...loggedItems) {
        if (!loggedItems) {
            loggedItems = [];
        }
        const logFilePath = path.join(this.logDirectory, `${Date.now()}.txt`);
        let logContent = `${new Date().toISOString()} - Error:\n${
            error.stack || error
        }\n\n`;

        loggedItems.forEach((item, index) => {
            logContent += `Logged Item ${index + 1}:\n${JSON.stringify(
                item,
                null,
                2
            )}\n\n`;
        });

        console.log(logContent);
        fs.writeFileSync(logFilePath, logContent, { flag: "a" });
    }

    logItems(...loggedItems) {
        if (!loggedItems) {
            loggedItems = [];
        }
        const logFilePath = path.join(this.logDirectory, `${Date.now()}.txt`);
        let logContent = ``;

        loggedItems.forEach((item, index) => {
            logContent += `Logged Item ${index + 1}:\n${JSON.stringify(
                item,
                null,
                2
            )}\n\n`;
        });

        console.log(logContent);
        fs.writeFileSync(logFilePath, logContent, { flag: "a" });
    }
}

module.exports = new Logger();
