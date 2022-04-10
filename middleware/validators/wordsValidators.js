const { check } = require('express-validator');

module.exports = {
    getActiveWordValidator: [
        check('sIdUser').isString(),
        check('sIdUser').notEmpty(),
        check('sIdUser').isUUID(),
    ],
};