import TelegramBot from "node-telegram-bot-api";
import { getUsdRubRate } from "../core/currencyService";
import { withErrorHandler } from "../utils/errorHandler";

export const rateCommand = (bot: TelegramBot) => {
    bot.onText(/\/rate/, withErrorHandler(bot, async (msg) => {
        const chatId = msg.chat.id;
        await bot.sendMessage(chatId, 'Запрашиваю курс...');
        const rate = await getUsdRubRate();
        bot.sendMessage(chatId, `Текущий курс: 1 USD ≈ ${rate.toFixed(2)} RUB`);
    }));
};
