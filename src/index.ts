import TelegramBot from 'node-telegram-bot-api';
import * as dotenv from 'dotenv';
import { portfolioText, skillsText } from './core/text';
import { getUsdRubRate, pingApi, getUsdRubChartData } from './core/currencyService';
import { generateChart } from './core/chartGenerator';

dotenv.config();

const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token) {
  console.error('Ошибка: Токен Telegram-бота не найден. Убедитесь, что вы создали файл .env и добавили в него TELEGRAM_BOT_TOKEN.');
  process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });

console.log('Бот успешно запущен...');

const handleChartRequest = async (chatId: number) => {
    try {
        await bot.sendMessage(chatId, 'Запрашиваю данные и генерирую график...');
        const chartData = await getUsdRubChartData();
        if (chartData.length === 0) {
            bot.sendMessage(chatId, 'Недостаточно данных для построения графика.');
            return;
        }
        const chartImage = await generateChart(chartData);
        bot.sendPhoto(chatId, chartImage, { caption: 'График курса USD/RUB за последние 30 дней' });
    } catch (error) {
        console.error(error);
        bot.sendMessage(chatId, 'Не удалось сгенерировать график. Попробуйте позже.');
    }
};

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const opts: TelegramBot.SendMessageOptions = {
    reply_markup: {
      keyboard: [
        [{ text: 'Портфолио' }, { text: 'Навыки' }],
        [{ text: 'Курс USD => RUB' }, { text: 'График USD => RUB' }],
        [{ text: '/ping' }]
      ],
      resize_keyboard: true,
      one_time_keyboard: false,
    },
  };
  bot.sendMessage(chatId, 'Добро пожаловать! Выберите одну из опций в меню:', opts);
});

bot.onText(/\/ping/, async (msg) => {
  const chatId = msg.chat.id;
  try {
    await bot.sendMessage(chatId, 'Проверяю доступность API...');
    const isApiUp = await pingApi();
    const message = isApiUp ? '✅ API CoinGecko доступно.' : '❌ API CoinGecko недоступно.';
    bot.sendMessage(chatId, message);
  } catch (error) {
    bot.sendMessage(chatId, '❌ Произошла ошибка при проверке API.');
  }
});

bot.onText(/\/rate/, async (msg) => {
  const chatId = msg.chat.id;
  try {
    await bot.sendMessage(chatId, 'Запрашиваю курс...');
    const rate = await getUsdRubRate();
    bot.sendMessage(chatId, `Текущий курс: 1 USD ≈ ${rate.toFixed(2)} RUB`);
  } catch (error) {
    bot.sendMessage(chatId, 'Не удалось получить курс валют. Попробуйте позже.');
  }
});

bot.onText(/\/chart/, (msg) => {
    handleChartRequest(msg.chat.id);
});

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  // Ignore commands that are handled by onText
  if (!text || text.startsWith('/')) {
    return;
  }

  if (text === 'Портфолио') {
    bot.sendMessage(chatId, portfolioText, { parse_mode: 'Markdown' });
  } else if (text === 'Навыки') {
    bot.sendMessage(chatId, skillsText, { parse_mode: 'Markdown' });
  } else if (text === 'Курс USD => RUB') {
    try {
      await bot.sendMessage(chatId, 'Запрашиваю курс...');
      const rate = await getUsdRubRate();
      bot.sendMessage(chatId, `Текущий курс: 1 USD ≈ ${rate.toFixed(2)} RUB`);
    } catch (error) {
      bot.sendMessage(chatId, 'Не удалось получить курс валют. Попробуйте позже.');
    }
  } else if (text === 'График USD => RUB') {
    handleChartRequest(chatId);
  } else {
    bot.sendMessage(chatId, `Вы написали: "${text}"`);
    console.log(`Получено сообщение от ${msg.from?.first_name || 'пользователя'}: ${text}`);
  }
});
