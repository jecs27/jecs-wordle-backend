const { validationResult } = require('express-validator');
const { errResponse } = require('../middleware/HandleError/HandleError');

const { sequelize, tab_words, tab_users, tab_board } = require('../models/database');
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
        let {
            sIdUser
        } = req.body;

        const dataUser = await tab_users.findOne({
            where: {
                sUuid: sIdUser
            },
            raw: true,
            transaction: tran
        });

        if (dataUser.nIntentos < 5) {
            const dataWord = await tab_words.findOne({
                where: {
                    nEstatus: 1,
                    nLongitud: req.query.longitud || 5,
                },
                attributes: { exclude: ['dFechaRegistro', 'nEstatus', 'nIdPalabra', 'nVecesAcertada'] },
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
        } else {
            await tran.rollback();
            return res.status(400).send({
                status: 400,
                message: 'Ha superado el número de intentos, espere al cambio de palabra.',
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

            await tab_users.update({ nIntentos: 0 }, {
                where: {
                    nIdUsuario: {
                        [Op.ne]: 0
                    }
                },
                returning: true,
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

const checkWord = async(req, res) => {
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
            sIdUser,
            user_word
        } = req.body;

        const dataUser = await tab_users.findOne({
            where: {
                sUuid: sIdUser
            },
            raw: true,
            transaction: tran
        });

        if (dataUser.nIntentos < 5) {
            const dataWord = await tab_words.findOne({
                where: {
                    nEstatus: 1,
                },
                attributes: { exclude: ['dFechaRegistro', 'nEstatus', 'nIdPalabra', 'nVecesAcertada'] },
                raw: true,
                transaction: tran
            });

            if (dataWord) {
                let nCorrect = 0;
                let arrWord = dataWord.sPalabra.split('');
                let arrUserWord = user_word.split('');
                let objResponse = [];
                for (let index in arrUserWord) {
                    if (arrUserWord[index] == arrWord[index]) {
                        objResponse.push({
                            "letter": arrUserWord[index],
                            "value": 1
                        });
                        nCorrect++;
                    } else if (arrWord.includes(arrUserWord[index])) {
                        objResponse.push({
                            "letter": arrUserWord[index],
                            "value": 2
                        });
                    } else {
                        objResponse.push({
                            "letter": arrUserWord[index],
                            "value": 3
                        });
                    }
                }

                await tab_users.update({ nIntentos: parseInt(dataUser.nIntentos) + 1 }, {
                    returning: true,
                    where: {
                        sUuid: sIdUser
                    },
                    transaction: tran
                });

                if (nCorrect === 5) {
                    const dataBoard = await tab_board.findOne({
                        where: {
                            nIdUsuario: dataUser.nIdUsuario
                        },
                        returning: true,
                        transaction: tran
                    });
                    let objChange = {
                        nPalabrasJugadas: parseInt(dataBoard.nPalabrasJugadas) + 1,
                        nPalabrasAcertadas: parseInt(dataBoard.nPalabrasAcertadas) + 1
                    }
                    await tab_board.update(objChange, {
                        where: {
                            nIdUsuario: dataUser.nIdUsuario
                        },
                        returning: true,
                        transaction: tran
                    });
                } else {
                    const nIntentos = parseInt(dataUser.nIntentos) + 1;
                    if (nIntentos === 5) {
                        let dataBoard = await tab_board.findOne({
                            where: {
                                nIdUsuario: dataUser.nIdUsuario
                            },
                            returning: true,
                            transaction: tran
                        });
                        let objChange = {
                            nPalabrasJugadas: parseInt(dataBoard.nPalabrasJugadas) + 1,
                        }
                        await tab_board.update(objChange, {
                            where: {
                                nIdUsuario: dataUser.nIdUsuario
                            },
                            returning: true,
                            transaction: tran
                        });
                    }
                }

                await tran.commit();
                return res.status(200).send({
                    status: 200,
                    message: '_OK_',
                    data: objResponse
                });
            } else {
                await tran.commit();
                return res.status(404).send({
                    status: 404,
                    message: 'No se encontraron datos de palabras.',
                    data: {}
                });
            }
        } else {
            await tran.rollback();
            return res.status(400).send({
                status: 400,
                message: 'Ha superado el número de intentos, espere al cambio de palabra.',
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
    getMoreAccurateWord,
    checkWord
}