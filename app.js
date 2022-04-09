var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
const db = require('./models/database');

async function crearDB() {
    let bForceDB = true;
    await db.sequelize
        .sync({ force: bForceDB })
        .then(() => {
            return Promise.resolve();
        })
        .catch(err => {
            return Promise.reject(err);
        });
}

crearDB();

var app = express();
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


let {
    userRoute,
    utilsRoute
} = require("./routes/");

app.use('/users', userRoute);
app.use('/utils', utilsRoute);

module.exports = app;