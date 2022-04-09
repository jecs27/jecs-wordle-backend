'use strict';
const moment = require("moment");
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class tab_words extends Model {
        static associate(models) {}
    }
    tab_words.init({
        dFechaRegistro: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
            get: function() {
                return moment.utc(this.getDataValue('dFechaRegistro')).local().format('YYYY-MM-DD HH:mm:ss');
            }
        },
        nIdPalabra: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrementIdentity: true,
            autoIncrement: true,
            allowNull: false,
        },
        sPalabra: { //electroencefalografista
            type: DataTypes.STRING(25),
            allowNull: false,
        },
        nLongitud: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },
        sUuid: {
            type: DataTypes.UUID,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
        },
        nEstatus: { //0 - sin usar 1 - en uso 2-usada
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
    }, {
        sequelize,
        timestamps: false,
        indexes: [
            { fields: ['nIdPalabra'], unique: true }
        ],
        freezeTableName: true,
        modelName: 'tab_words',
    });
    return tab_words;
};