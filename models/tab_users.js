'use strict';
const moment = require("moment");
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class tab_users extends Model {
        static associate(models) {}
    }
    tab_users.init({
        dFechaRegistro: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
            get: function() {
                return moment.utc(this.getDataValue('dFechaRegistro')).local().format('YYYY-MM-DD HH:mm:ss');
            }
        },
        nIdUsuario: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrementIdentity: true,
            autoIncrement: true,
            allowNull: false,
        },
        sNombre: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        sApellido_Paterno: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        sApellido_Materno: {
            type: DataTypes.STRING(100),
            allowNull: false,
            defaultValue: ''
        },
        sCorreo: {
            type: DataTypes.STRING(100),
            allowNull: false,
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
            { fields: ['nIdUsuario'], unique: true }
        ],
        freezeTableName: true,
        modelName: 'tab_users',
    });
    return tab_users;
};