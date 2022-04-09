var express = require('express');
var router = express.Router();

const {
    getTokenApplication,
} = require('../controller/utilsController')

router.post('/getAppToken', getTokenApplication);

module.exports = router;