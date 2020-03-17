
const express = require('express');
const {check} = require('express-validator');

const Password = require('../controllers/password');


const router = express.Router();


// route for forget password
router.post('/recover', [
    check('email').isEmail().withMessage('Enter a valid email address'),
],  Password.recover);


// route when link in email is opened
router.get('/reset/:token', Password.reset);


// route to set password
router.post('/reset/:token', [
    check('password').not().isEmpty().isLength({min: 6}).withMessage('Must be at least 6 chars long')
],  Password.resetPassword);


module.exports = router;