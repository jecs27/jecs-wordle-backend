const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const config = require('../config/config');
const db = {};

let sequelize = new Sequelize(config.dbName, config.dbUser, config.dbPassword, {
    logging: !config.DEV,
    host: config.dbHost,
    dialect: config.dbDialect,
    quoteIdentifiers: true,
    timezone: '-07:00',
    dialectOptions: {
        dateStrings: true,
        typeCast: true,
    },

});

try {
    fs.readdirSync(__dirname)
        .filter(file => {
            return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
        })
        .forEach(file => {
            const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
            db[model.name] = model;
        });

    Object.keys(db).forEach(modelName => {
        if (db[modelName].associate) {
            db[modelName].associate(db);
        }
    });

    db.sequelize = sequelize;
    db.Sequelize = Sequelize;
} catch (error) {
    console.log("DB error: " + error);
}

module.exports = db;