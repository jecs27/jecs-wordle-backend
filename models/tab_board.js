'use strict';
const moment = require("moment");
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class tab_board extends Model {
        static associate(models) {
            tab_board.belongsTo(models.tab_users, {
                as: 'tab_users',
                foreignKey: 'nIdUsuario',
            });
        }
    }
    tab_board.init({
        dFechaRegistro: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
            get: function() {
                return moment.utc(this.getDataValue('dFechaRegistro')).local().format('YYYY-MM-DD HH:mm:ss');
            }
        },
        nIdBoard: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrementIdentity: true,
            autoIncrement: true,
            allowNull: false,
        },
        nPalabrasJugadas: {
            type: DataTypes.BIGINT,
            allowNull: false,
            defaultValue: 0
        },
        nPalabrasAcertadas: {
            type: DataTypes.BIGINT,
            allowNull: false,
            defaultValue: 0
        },
        sUuid: {
            type: DataTypes.UUID,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
        },
        nEstatus: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },
    }, {
        sequelize,
        timestamps: false,
        indexes: [
            { fields: ['nIdBoard'], unique: true }
        ],
        freezeTableName: true,
        modelName: 'tab_board',
    });
    return tab_board;
};