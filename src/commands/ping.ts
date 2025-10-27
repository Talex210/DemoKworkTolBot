import TelegramBot from "node-telegram-bot-api";
import { pingApi } from "../core/currencyService";
import { withErrorHandler } from "../utils/errorHandler";

export const pingCommand = (bot: TelegramBot) => {
    bot.onText(/\/ping/, withErrorHandler(bot, async (msg) => {
        const chatId = msg.chat.id;
        await bot.sendMessage(chatId, 'Проверяю доступность API...');
        const isApiUp = await pingApi();
        const message = isApiUp ? '✅ API CoinGecko доступно.' : '❌ API CoinGecko недоступно.';
        bot.sendMessage(chatId, message);
    }));
};
