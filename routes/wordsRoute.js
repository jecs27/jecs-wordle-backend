var express = require('express');
var router = express.Router();

const {
    getActiveWord,
    getMoreAccurateWord,
    checkWord,
} = require('../controller/wordsController')

const {
    getActiveWordValidator,
} = require('../middleware/validators/wordsValidators');

const {
    verifyTokenLogin
} = require('../middleware/auth/auth')

router.post('/getActiveWord', getActiveWordValidator, verifyTokenLogin, getActiveWord);
router.get('/getMoreAccurateWord', verifyTokenLogin, getMoreAccurateWord);
router.post('/checkWord', verifyTokenLogin, checkWord);

module.exports = router;