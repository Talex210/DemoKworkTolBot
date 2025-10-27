import TelegramBot from "node-telegram-bot-api";

type AsyncFunction<T extends any[], R> = (...args: T) => Promise<R>;

export const withErrorHandler = <T extends any[], R>(bot: TelegramBot, fn: AsyncFunction<T, R>) => {
    return async (...args: T): Promise<R | undefined> => {
        const msg = args[0] as TelegramBot.Message;
        const chatId = msg.chat.id;
        try {
            return await fn(...args);
        } catch (error) {
            console.error('Произошла ошибка:', error);
            bot.sendMessage(chatId, 'Произошла непредвиденная ошибка. Пожалуйста, попробуйте позже.');
            return undefined; // Or re-throw if you want to propagate the error further
        }
    };
};
