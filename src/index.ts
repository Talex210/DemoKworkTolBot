import TelegramBot from 'node-telegram-bot-api';
import * as dotenv from 'dotenv';
import { startCommand } from './commands/start';
import { pingCommand } from './commands/ping';
import { rateCommand } from './commands/rate';
import { chartCommand } from './commands/chart';
import { messageHandler } from './core/messageHandler';

dotenv.config();

const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token) {
  console.error('Ошибка: Токен Telegram-бота не найден. Убедитесь, что вы создали файл .env и добавили в него TELEGRAM_BOT_TOKEN.');
  process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });

console.log('Бот успешно запущен...');

// Register all commands
startCommand(bot);
pingCommand(bot);
rateCommand(bot);
chartCommand(bot);

// Register message handler
messageHandler(bot);