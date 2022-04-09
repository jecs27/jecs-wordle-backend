const { check } = require('express-validator');

module.exports = {
    createUserValidator: [
        check('sNombre').isString(),
        check('sNombre').notEmpty(),
        check('sApellido_Paterno').isString(),
        check('sApellido_Paterno').notEmpty(),
        check('sApellido_Materno').isString(),
        check('sCorreo').isString(),
        check('sCorreo').notEmpty(),
        check('sCorreo').isEmail(),
        check('sPassword').isString(),
        check('sPassword').notEmpty(),
    ],
};