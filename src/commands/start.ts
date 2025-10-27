import TelegramBot from "node-telegram-bot-api";
import { withErrorHandler } from "../utils/errorHandler";

export const startCommand = (bot: TelegramBot) => {
    bot.onText(/\/start/, withErrorHandler(bot, async (msg) => {
        const chatId = msg.chat.id;
        const opts: TelegramBot.SendMessageOptions = {
            reply_markup: {
                keyboard: [
                    [{ text: 'Портфолио' }, { text: 'Навыки' }],
                    [{ text: 'Курс USD => RUB' }, { text: 'График USD => RUB' }],
                    [{ text: 'Проверка API' }]
                ],
                resize_keyboard: true,
                one_time_keyboard: false,
            },
        };
        bot.sendMessage(chatId, 'Добро пожаловать! Выберите одну из опций в меню:', opts);
    }));
};
