var express = require('express');
var router = express.Router();

const {
    createUser,
} = require('../controller/usersController')

const {
    createUserValidator
} = require('../middleware/validators/userValidators')

const {
    verifyToken
} = require('../middleware/auth/auth')
router.post('/createUser', createUserValidator, verifyToken, createUser);

module.exports = router;