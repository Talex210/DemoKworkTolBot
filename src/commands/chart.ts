import TelegramBot from "node-telegram-bot-api";
import { getUsdRubChartData } from "../core/currencyService";
import { generateChart } from "../core/chartGenerator";
import { withErrorHandler } from "../utils/errorHandler";

const handleChartRequest = async (bot: TelegramBot, chatId: number) => {
    await bot.sendMessage(chatId, 'Запрашиваю данные и генерирую график...');
    const chartData = await getUsdRubChartData();
    if (chartData.length === 0) {
        bot.sendMessage(chatId, 'Недостаточно данных для построения графика.');
        return;
    }
    const chartImage = await generateChart(chartData);
    bot.sendPhoto(chatId, chartImage, { caption: 'График курса USD/RUB за последние 30 дней' }, { filename: 'chart.png', contentType: 'image/png' });
};

export const chartCommand = (bot: TelegramBot) => {
    bot.onText(/\/chart/, withErrorHandler(bot, async (msg) => {
        await handleChartRequest(bot, msg.chat.id);
    }));
};

export { handleChartRequest };