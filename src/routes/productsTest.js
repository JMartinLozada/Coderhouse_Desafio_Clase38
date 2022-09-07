const express = require('express');
const controller = require('../controller/productosTest.controller.js');

const router = express.Router();

router.get('/', controller.random);

module.exports = router;