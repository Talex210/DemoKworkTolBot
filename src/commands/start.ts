import TelegramBot from "node-telegram-bot-api";
import { withErrorHandler } from "../utils/errorHandler";
import { mainKeyboard } from "../core/messageHandler";

export const startCommand = (bot: TelegramBot) => {
    bot.onText(/\/start/, withErrorHandler(bot, async (msg) => {
        const chatId = msg.chat.id;
        const welcomeMessage = 'Добро пожаловать! Выберите одну из опций в меню или используйте команды: /portfolio, /skills, /rate, /chart, /ping';
        const opts: TelegramBot.SendMessageOptions = {
            reply_markup: {
                keyboard: mainKeyboard,
                resize_keyboard: true,
                one_time_keyboard: false,
            },
        };
        await bot.sendMessage(chatId, welcomeMessage, opts);
    }));
};
