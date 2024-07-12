const express = require('express');
const fileUpload = require('express-fileupload');

const app = express();
const hbs = require('hbs');
const path = require('path');
require('dotenv').config();
const fs = require('fs');


const { Telegraf } = require('telegraf');

// Токен вашего Telegram бота
const token = process.env.BOT_TOKEN;


const chatId = process.env.CHAT_ID_TISHKOVA;

const bot = new Telegraf(token);
const port = 3005;


// Подключаем handlebars
app.set('view engine', 'hbs');

// Используем middleware для обработки загрузки файлов
app.use(fileUpload());

// Отображаем форму для загрузки файлов
app.get('/', (req, res) => {
    res.render('index.hbs');
});



app.post('/upload', (req, res) => {
    const direction = req.body.direction;
    const date = req.body.date;
    const theme = req.body.theme;
    const text = req.body.text;

    // Объединяем данные события в одну переменную
    const eventData = `Направление события: ${direction}\nДата события: ${date}\nТема события: ${theme}\nТекст события: ${text}`;

    // Отправляем данные события в Telegram
    bot.telegram.sendMessage(chatId, eventData)
        .then(() => {
            console.log('Данные события успешно отправлены в Telegram');
        })
        .catch((error) => {
            console.error('Ошибка при отправке данных события в Telegram:', error);
        });

    if (!req.files || Object.keys(req.files).length === 0) {
        res.render('sucessful.hbs');
    }
    

if (req.files) {
    
    
     const photos = req.files.photos;
}

    
    // console.log(photos)

    

  
    if (req.files && !Array.isArray(photos)) {
        // photos = [photos];
   
        const file = req.files.photos;
      
    const fileName = file.name;
    const uploadPath = path.join(__dirname, 'uploads', fileName);

    file.mv(uploadPath, (err) => {
        if (err) {
            return res.status(500).send(err);
        }

        bot.telegram.sendPhoto(chatId, {
            source: fs.createReadStream(uploadPath),
            caption: `Фотография события: ${theme}`
        }).then(() => {
            console.log('Фотография успешно отправлена в Telegram');
        }).catch((error) => {
            console.error('Ошибка при отправке фотографии в Telegram:', error);
        });

        res.render('sucessful.hbs');
    });


    }


    ///Для одной фотографии
if (req.files && Array.isArray(photos))  {

    photos.forEach((file) => {
        const fileName = file.name;
        const uploadPath = path.join(__dirname, 'uploads', fileName);

        file.mv(uploadPath, (err) => {
            if (err) {
                return res.status(500).send(err);
            }

            // Отправляем фотографию в Telegram
            bot.telegram.sendPhoto(chatId, {
                source: fs.createReadStream(uploadPath),
                caption: `Фотография события: ${theme}`
            }).then(() => {
                console.log('Фотография успешно отправлена в Telegram');
            }).catch((error) => {
                console.error('Ошибка при отправке фотографии в Telegram:', error);
            });
        });
    });

    res.render('sucessful.hbs');
 }
});




app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});






