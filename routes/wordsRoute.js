var express = require('express');
var router = express.Router();

const {
    getActiveWord,
} = require('../controller/wordsController')

router.get('/getActiveWord', getActiveWord);

module.exports = router;