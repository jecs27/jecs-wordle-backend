var express = require('express');
var router = express.Router();

const {
    getActiveWord,
    getMoreAccurateWord,
    checkWord
} = require('../controller/wordsController')

const {
    getActiveWordValidator,
} = require('../middleware/validators/wordsValidators');

router.post('/getActiveWord', getActiveWordValidator, getActiveWord);
router.post('/getMoreAccurateWord', getMoreAccurateWord);
router.post('/checkWord', checkWord);

module.exports = router;