import TelegramBot from "node-telegram-bot-api";
import { portfolioText, skillsText } from "./text";
import { getUsdRubRate, pingApi } from "./currencyService";
import { handleChartRequest } from "../commands/chart";
import { withErrorHandler } from "../utils/errorHandler";

export const messageHandler = (bot: TelegramBot) => {
    bot.on('message', withErrorHandler(bot, async (msg) => {
        const chatId = msg.chat.id;
        const text = msg.text;

        if (!text || text.startsWith('/')) {
            return;
        }

        switch (text) {
            case 'Портфолио':
                bot.sendMessage(chatId, portfolioText, { parse_mode: 'Markdown' });
                break;
            case 'Навыки':
                bot.sendMessage(chatId, skillsText, { parse_mode: 'Markdown' });
                break;
            case 'Курс USD => RUB':
                await bot.sendMessage(chatId, 'Запрашиваю курс...');
                const rate = await getUsdRubRate();
                bot.sendMessage(chatId, `Текущий курс: 1 USD ≈ ${rate.toFixed(2)} RUB`);
                break;
            case 'График USD => RUB':
                await handleChartRequest(bot, chatId);
                break;
            case 'Проверка API':
                await bot.sendMessage(chatId, 'Проверяю доступность API...');
                const isApiUp = await pingApi();
                const message = isApiUp ? '✅ API CoinGecko доступно.' : '❌ API CoinGecko недоступно.';
                bot.sendMessage(chatId, message);
                break;
            default:
                bot.sendMessage(chatId, `Вы написали: "${text}"`);
                console.log(`Получено сообщение от ${msg.from?.first_name || 'пользователя'}: ${text}`);
                break;
        }
    }));
};
