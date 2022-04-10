let fs = require('fs');
var express = require('express');
var path = require('path');
var cron = require('node-cron');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

const db = require('./models/database');
const { changeActiveWord } = require('./controller/wordsController');

async function crearDB() {
    let bForceDB = true;
    await db.sequelize
        .sync({ force: bForceDB })
        .then(async() => {
            if (bForceDB) {
                await llenaDiccionario();
                changeActiveWord();
            }
            return Promise.resolve();
        })
        .catch(err => {
            return Promise.reject(err);
        });
}
crearDB();

async function llenaDiccionario() {
    const tran = await db.sequelize.transaction();
    try {
        fs.readFile('./utils/words.txt', 'utf-8', (err, data) => {
            if (err) {
                console.log('error: ', err);
            } else {
                let jsonData = [];
                let arr = data.toString().replace(/\r\n/g, '\n').split('\n');
                for (let i of arr) {
                    if (i.length == 5) {
                        jsonData.push({
                            sPalabra: i,
                            nLongitud: i.length
                        });
                    }
                }

                if (jsonData.length > 0) {
                    db.tab_words.bulkCreate(jsonData);
                }
            }
        });
        await tran.commit();
        return true;
    } catch (error) {
        await tran.rollback();
    }
}

var app = express();
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

let {
    userRoute,
    utilsRoute,
    wordsRoute,
} = require("./routes/");

app.use('/users', userRoute);
app.use('/utils', utilsRoute);
app.use('/word', wordsRoute);

cron.schedule('*/5 * * * *', () => {
    changeActiveWord();
}, {
    scheduled: true,
    timezone: "America/Mazatlan"
});

module.exports = app;