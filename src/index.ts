import TelegramBot from 'node-telegram-bot-api';
import * as dotenv from 'dotenv';

dotenv.config();

const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token) {
  console.error('Ошибка: Токен Telegram-бота не найден. Убедитесь, что вы создали файл .env и добавили в него TELEGRAM_BOT_TOKEN.');
  process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });

console.log('Бот успешно запущен...');

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const opts: TelegramBot.SendMessageOptions = {
    reply_markup: {
      keyboard: [
        [{ text: 'Портфолио' }, { text: 'Навыки' }],
        [{ text: 'Курс валют' }]
      ],
      resize_keyboard: true,
      one_time_keyboard: true,
    },
  };
  bot.sendMessage(chatId, 'Добро пожаловать! Выберите одну из опций в меню:', opts);
});

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (!text || text === '/start') {
    return;
  }

  if (text === 'Портфолио') {
    bot.sendMessage(chatId, 'Раздел \"Портфолио\" находится в разработке');
  } else if (text === 'Навыки') {
    bot.sendMessage(chatId, 'Раздел \"Навыки\" находится в разработке');
  } else if (text === 'Курс валют') {
    bot.sendMessage(chatId, 'Раздел \"Курс валют\" находится в разработке');
  } else {
    bot.sendMessage(chatId, `Вы написали: "${text}"`);
    console.log(`Получено сообщение от ${msg.from?.first_name || 'пользователя'}: ${text}`);
  }
});
