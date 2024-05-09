const TelegramBot = require("node-telegram-bot-api");
const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

const gSh = require("./gSheetsController.js");
const logger = require("./logger.js");

const questions = require("./questions.json");
const users = new Map();

bot.setMyCommands([{ command: "/start", description: "Запустити бота" }]);

// Роблю все всередині юзкейсу бо 2 команди всього і немає навіщо писати перевірки на команди в bot.on("message")
bot.on("message", (msg) => {
    try {
        const chatId = msg.chat.id;
        // Щоб ніхто не зламав скрипт, додаючи бота до чату
        if (msg.from.id != chatId) {
            return bot.sendMessage(
                chatId,
                "На жаль, бот працює тільки в приватних чатах"
            );
        }
        switch (msg.text) {
            case "/start":
                users.set(msg.from.id, {
                    user: msg.from,
                    progress: 0,
                    answers: [],
                });
                let user = users.get(msg.from.id);
                return bot.sendMessage(
                    chatId,
                    questions[user.progress].question,
                    {
                        reply_markup: {
                            keyboard: questions[user.progress].answers,
                            one_time_keyboard: true,
                            input_field_placeholder:
                                "Натисніть кнопку відповіді:",
                        },
                    }
                );
                break;
            default:
                if (users.has(chatId)) {
                    let user = users.get(msg.from.id);
                    user.progress++;

                    // Якщо відправлений контакт, щоб не писало undefined
                    if (msg.contact) {
                        user.answers.push(msg.contact.phone_number);
                    } else {
                        user.answers.push(msg.text);
                    }

                    // Сама логіка тесту
                    if (user.progress < questions.length) {
                        return bot.sendMessage(
                            chatId,
                            questions[user.progress].question,
                            {
                                reply_markup: {
                                    keyboard: questions[user.progress].answers,
                                    one_time_keyboard: true,
                                    remove_keyboard: true,
                                    input_field_placeholder:
                                        "Натисніть кнопку відповіді:",
                                },
                            }
                        );
                    } else {
                        // Коли тест пройдений
                        logger.logItems(user);
                        users.delete(msg.from.id);
                        gSh.addUserResults(user);
                        return bot.sendMessage(
                            chatId,
                            "Дякую вам за відповіді!",
                            {
                                reply_markup: {
                                    inline_keyboard: [
                                        [
                                            {
                                                text: "Перейти до каналу",
                                                url: process.env.CHANNEL_LINK,
                                            },
                                        ],
                                    ],
                                },
                            }
                        );
                    }
                }
                break;
        }
    } catch (error) {
        logger.logError(error);
    }
});

bot.on("polling_error", (error) => {
    if (Math.floor(process.uptime()) >= 60) {
        process.exit(0);
    }
});

module.exports = { bot, users };
