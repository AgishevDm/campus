const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot('7966297212:AAHQc7S1umeyY4qE8xczoTQi7iL8kYhJcPk', { polling: true });

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const webAppUrl = 'https://imaps-psu.ru';

  bot.sendMessage(chatId, 'Открыть прикложение как:', {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Открыть мини-приложение', web_app: { url: webAppUrl } }],
        [{ text: 'Открыть сайт', url: webAppUrl }]
      ]
    }
  });
});