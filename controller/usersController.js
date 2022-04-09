const { validationResult } = require('express-validator');
const { errResponse } = require('../middleware/HandleError/HandleError');

const { sequelize, tab_users } = require('../models/database');
const { Op } = require('sequelize');
const { messageError } = require('../utils/strings');


const createUser = async(req, res) => {
    let err = await errResponse(validationResult(req), res, 'error');
    if (err !== null) {
        return res.status(422).send({
            status: 422,
            message: messageError,
            data: {}
        });
    }
    const tran = await sequelize.transaction();
    try {
        let {
            sNombre,
            sApellido_Paterno,
            sApellido_Materno,
            sCorreo,
            sPassword
        } = req.body;

        const [dataUser, created] = await tab_users.findOrCreate({
            where: {
                [Op.or]: [
                    { sCorreo: sCorreo.toLowerCase() },
                ]
            },
            defaults: {
                sNombre: sNombre.toUpperCase(),
                sApellido_Paterno: sApellido_Paterno.toUpperCase(),
                sApellido_Materno: sApellido_Materno.toUpperCase(),
                sCorreo: sCorreo.toLowerCase(),
                sPassword: sPassword
            },
            raw: true,
            transaction: tran
        });
        if (created) {
            delete dataUser.dataValues.dFechaRegistro;
            delete dataUser.dataValues.nEstatus;
            delete dataUser.dataValues.sPassword;

            await tran.commit();
            return res.status(201).send({
                status: 201,
                message: 'Se ha registrado el usuario con éxito.',
                data: dataUser
            });
        } else if (dataUser) {
            await tran.rollback();
            return res.status(409).send({
                status: 409,
                message: 'El Usuario ya se encuentra registrado.',
                data: {},
            });
        } else {
            await tran.rollback();
            return res.status(400).send({
                status: 400,
                message: 'Ocurrió un error al intentar registrar al Usuario.',
                data: {},
            });
        }
    } catch (error) {
        console.log(error);
        await tran.rollback();
        return res.status(500).send({
            status: 500,
            message: 'Ocurrió un error al intentar registar el Usuario.',
            data: { error: error.toString() }
        });
    }
}



module.exports = {
    createUser,
}