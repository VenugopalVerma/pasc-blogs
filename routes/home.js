const express = require('express');
const Joi = require('@hapi/joi');
const router = express.Router();

router.get('/',(req,res) => {
    res.send('PASC API');
})

module.exports = router