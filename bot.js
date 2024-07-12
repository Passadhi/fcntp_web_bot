

const { Telegraf } = require("telegraf");
require('dotenv').config();

const token = process.env.BOT_TOKEN;


const link = process.env.BOT_URL;

const bot = new Telegraf(token);

bot.start((ctx) =>
  ctx.reply(
    'Привет, это бот для отправки событий, нажмите на кнопку "отправить событие")',
    {
      reply_markup: {
        keyboard: [
          [
            {
              text: "Отправить событие",
              web_app: { url: link },
            },
          ],
        ],
      },
    }
  )
);



bot.launch();

