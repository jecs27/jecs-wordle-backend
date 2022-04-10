const { validationResult } = require('express-validator');
const { errResponse } = require('../middleware/HandleError/HandleError');

const { sequelize, tab_words } = require('../models/database');
const { Op } = require('sequelize');
const { messageError } = require('../utils/strings');

const getActiveWord = async(req, res) => {
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
        const dataWord = await tab_words.findOne({
            where: {
                nEstatus: 1,
                nLongitud: req.query.longitud || 5,
            },
            attributes: { exclude: ['dFechaRegistro', 'nEstatus', 'nIdPalabra'] },
            raw: true,
            transaction: tran
        });

        if (dataWord) {
            await tran.commit();
            return res.status(200).send({
                status: 200,
                message: '_OK_',
                data: dataWord
            });
        } else {
            await tran.commit();
            return res.status(404).send({
                status: 404,
                message: 'No se encontraron datos de palabras.',
                data: {}
            });
        }
    } catch (error) {
        console.log(error);
        await tran.rollback();
        return res.status(500).send({
            status: 500,
            message: 'Ocurrió un error al intentar obtener la palabra.',
            data: { error: error.toString() }
        });
    }
}

const changeActiveWord = async() => {
    const tran = await sequelize.transaction();
    try {
        const dataWord = await tab_words.findOne({
            where: {
                nEstatus: 1,
            },
            attributes: { exclude: ['dFechaRegistro', 'nEstatus', 'nIdPalabra'] },
            raw: true,
            transaction: tran
        });
        if (dataWord) {
            const randomWord = await tab_words.findOne({
                where: {
                    nEstatus: 0,
                },
                order: sequelize.random(),
                raw: true,
                transaction: tran
            });
            await tab_words.update({ nEstatus: 2 }, {
                returning: true,
                where: {
                    sUuid: dataWord.sUuid
                },
                transaction: tran
            });
            await tab_words.update({ nEstatus: 1 }, {
                returning: true,
                where: {
                    sUuid: randomWord.sUuid
                },
                transaction: tran
            });

        } else {
            await tab_words.update({ nEstatus: 0 }, {
                where: {
                    nIdPalabra: {
                        [Op.ne]: 0
                    }
                },
                returning: true,
                transaction: tran
            });
            await tab_words.update({ nEstatus: 1 }, {
                returning: true,
                where: {
                    nIdPalabra: 9
                },
                transaction: tran
            });
        }
        await tran.commit();
    } catch (error) {
        console.log(error);
        await tran.rollback();
    }
}

const getMoreAccurateWord = async(req, res) => {
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
        const dataWord = await tab_words.findOne({
            limit: 1,
            order: [
                ['nVecesAcertada', 'DESC'],
            ],
            attributes: { exclude: ['dFechaRegistro', 'nEstatus', 'nIdPalabra'] },
            raw: true,
            transaction: tran
        });

        if (dataWord) {
            await tran.commit();
            return res.status(200).send({
                status: 200,
                message: '_OK_',
                data: dataWord
            });
        } else {
            await tran.commit();
            return res.status(404).send({
                status: 404,
                message: 'No se encontraron datos de palabras.',
                data: {}
            });
        }
    } catch (error) {
        console.log(error);
        await tran.rollback();
        return res.status(500).send({
            status: 500,
            message: 'Ocurrió un error al intentar obtener la palabra.',
            data: { error: error.toString() }
        });
    }
}

module.exports = {
    getActiveWord,
    changeActiveWord,
    getMoreAccurateWord
}