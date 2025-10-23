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

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text) {
    bot.sendMessage(chatId, `Вы написали: "${text}"`);
    console.log(`Получено сообщение от ${msg.from?.first_name || 'пользователя'}: ${text}`);
  }
});
