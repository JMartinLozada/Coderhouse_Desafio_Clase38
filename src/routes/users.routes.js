
const express = require('express');
const passport = require('passport');
const controller = require('../controller/users.controller.js');

const router = express.Router();

 /**** registro */

router.get('/register', controller.renderRegister);

router.post('/register', passport.authenticate('register', {failureRedirect:'/registerFail', failureMessage: true}), controller.registerPost)

router.get('/registerFail', controller.registerFail)

/* iniciar sesion */

router.get('/', controller.renderLogin);

router.post('/', passport.authenticate('auth',{failureRedirect:'/loginFail'}), controller.loginPost);

router.get('/loginFail', controller.loginFail)

/*** cerrar sesion */

router.get('/logout', controller.logout);


module.exports = router;