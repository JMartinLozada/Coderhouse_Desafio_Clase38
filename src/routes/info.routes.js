const express = require('express');
const controller = require('../controller/info.controller.js');

const router = express.Router();

router.get('/', controller.info);

module.exports = router;