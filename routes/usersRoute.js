var express = require('express');
var router = express.Router();

const {
    createUser,
    getTopRanking,
    getGamesPlayed,
} = require('../controller/usersController')

const {
    createUserValidator
} = require('../middleware/validators/userValidators')

const {
    verifyToken
} = require('../middleware/auth/auth')

router.post('/createUser', createUserValidator, verifyToken, createUser);
router.get('/getTopRanking', getTopRanking);
router.post('/getGamesPlayed', getGamesPlayed);

module.exports = router;