var express = require('express');
var router = express.Router();

const {
    createUser,
    getTopRanking,
    getGamesPlayed,
    loginUser,
} = require('../controller/usersController')

const {
    createUserValidator
} = require('../middleware/validators/userValidators')

const {
    verifyToken,
    verifyTokenLogin
} = require('../middleware/auth/auth')

router.post('/createUser', createUserValidator, verifyToken, createUser);
router.get('/getTopRanking', verifyTokenLogin, getTopRanking);
router.post('/getGamesPlayed', verifyTokenLogin, getGamesPlayed);
router.post('/loginUser', verifyToken, loginUser);

module.exports = router;