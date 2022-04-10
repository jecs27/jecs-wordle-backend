var express = require('express');
var router = express.Router();

const {
    getActiveWord,
    getMoreAccurateWord
} = require('../controller/wordsController')

router.get('/getActiveWord', getActiveWord);
router.get('/getMoreAccurateWord', getMoreAccurateWord);

module.exports = router;