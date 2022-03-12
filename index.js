require('dotenv').config()
const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(process.env.TG_TOKEN, {polling: true});

const hasText = (message, needle) => message.text.toLowerCase().includes(needle);

const removeReplyButton = message => bot.editMessageReplyMarkup({}, { message_id: message.message_id, chat_id: message.chat.id });

bot.on('message', msg => {
    const firstName = msg.from.first_name;

    if (hasText(msg, 'hi')) return bot.sendMessage(msg.chat.id, `Hello ${firstName}`);
});

bot.onText(/\/start/, (msg) => {

    bot.sendMessage(msg.chat.id, "Welcome",{
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: `Home`,
                        callback_data: 'home',
                    },
                    {
                        text: `Office`,
                        callback_data: 'office',
                    },
                ],
                [
                    {
                        text: `On Leave`,
                        callback_data: 'on-leave',
                    }
                ]
            ]
        }
    });
    
});

bot.on('callback_query', ({ message, data }) => {
    removeReplyButton(message);
    if(data === 'on-leave') {
        return bot.sendMessage(message.chat.id, 'How many day is it?', { reply_markup: { inline_keyboard: [[{text: '1 day', callback_data: '1'}]] } });
    }
    if(data === '1') return bot.sendMessage(message.chat.id, 'Noted that you are on leave for 1 day');


    return bot.sendMessage(message.chat.id, 'Attendance Captured');
});