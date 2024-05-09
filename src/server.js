const express = require("express");
const path = require("path");
const cors = require("cors");
const { bot, users } = require("./bot");

const app = express();
const PORT = process.env.SERVER_PORT || 5000;

app.options("*", cors());
app.use(express.json());
app.use(express.static(path.resolve(process.cwd(), "public")));

app.use("/admin", (req, res) => {
    return res.sendFile(
        path.resolve(process.cwd(), "public", "html", "index.html")
    );
});

app.get("/api/getSettings", async (req, res) => {
    try {
        const userArr = [...users.values()];
        const data = [];
        for (const user of userArr) {
            data.push({ user_id: user.user.id, username: user.user.username });
        }
        return res.send(data);
    } catch (error) {
        logger.logError(error);
        return res.sendStatus(500);
    }
});

app.post("/api/messageOneChat", async (req, res) => {
    const { chat_id, message } = req.body;
    try {
        if (chat_id && message) {
            await bot.sendMessage(chat_id, message, {
                parse_mode: "HTML",
            });
            return res.sendStatus(200);
        }
        return res.sendStatus(400);
    } catch (error) {
        logger.logError(error);
        return res.sendStatus(500);
    }
});

app.post("/api/messageAll", async (req, res) => {
    const { message } = req.body;
    try {
        if (message) {
            const userArr = [...users.values()];
            for (const user of userArr) {
                bot.sendMessage(user.user.id, message, {
                    parse_mode: "HTML",
                });
            }
            return res.sendStatus(200);
        }
        return res.sendStatus(400);
    } catch (error) {
        logger.logError(error);
        return res.sendStatus(500);
    }
});

app.post("/api/turnOff", (req, res) => {
    process.exit(0);
});

app.listen(PORT);

module.exports = app;
