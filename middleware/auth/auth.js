const config = require('../../config/config');
const jwt = require('jsonwebtoken');
const moment = require('moment');

const {
    decryptString,
    crearHashMd5,
} = require('../../utils/CTools');

const generateToken = (data) => {
    try {
        const token = jwt.sign(data, config.token_key, {
            algorithm: 'HS256',
            expiresIn: '8h'
        });
        return token;
    } catch (error) {
        return error;
    }
}

const verifyToken = async(req, res, next) => {
    try {
        //if (req.header('Authorization') ? .split(' ')[0] == 'Bearer') { //descomentar al final, quitando formater
        if (req.header('Authorization').split(' ')[0] == 'Bearer') {
            const decoded = jwt.verify(req.header('Authorization').split(' ')[1], config.token_key);
            if (decoded.exp <= moment().unix()) {
                return res.status(401).send({
                    status: 401,
                    message: 'Token Expirado.'
                });
            } else {
                if (await validateInfo(decoded, req.header('sMW'))) {
                    next();
                } else {
                    return res.status(403).send({
                        status: 403,
                        message: "Token Inválido, no pudo ser autenticado."
                    });
                }
            }
        } else {
            return res.status(403).send({
                status: 403,
                message: 'Token Inválido.'
            });
        }
    } catch (error) {
        console.log(error);
        switch (error.name) {
            case 'JsonWebTokenError':
                return res.status(403).send({
                    status: 403,
                    message: 'Token Inválido.'
                });
            case 'TokenExpiredError':
                return res.status(401).send({
                    status: 401,
                    message: 'Token Expirado.'
                });
            default:
                return res.status(403).send({
                    status: 403,
                    message: "Token Inválido, no pudes ser autenticado."
                });
        }
    }
}

const validateInfo = async(data, sMW) => {
    console.log(data, sMW);
    if (sMW != undefined && sMW != 'undefined' && sMW != '') {
        sMW = await decryptString(sMW);
        let dataTkn = moment().format('DD.MM.YYYY') + await crearHashMd5("-JECS2712");
        if (sMW == 'dd360-2712' && data.sMW == dataTkn) {
            return true
        }
    } else {
        return false;
    }
}


module.exports = {
    generateToken,
    verifyToken,
}