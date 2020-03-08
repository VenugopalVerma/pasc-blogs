const _ = require('lodash');
const bcrypt = require('bcryptjs');
const express = require('express');
const router = express.Router();
const { User, validateLogin } = require('../models/user');
const jwt = require('jsonwebtoken');

router.post('/', async (req, res) => {
    const result = validateLogin(req.body);
    if (result.error) {
        console.log('Invalid post request', result);
        return res.status(400).send(result.error.details[0].message);
    }
    else {
        try {
            let user = await User.findOne({ email: req.body.email });
            if (!user) return res.status(400).send('Email not registered');
            // console.log(req.body);

            const verified = await bcrypt.compare(req.body.password, user.password);
            // user = new User(_.pick(req.body, ['displayName', 'email', 'password']));
            if(!verified) return res.status(401).send('Venugopal');
            console.log('Login successful', verified);
            console.log('User', user);
            const token = jwt.sign({ id: user._id, isAdmin: user.admin }, process.env.JWT_KEY);
            console.log('token ', token);

            res.send(token);
        } catch (error) {
            console.error(error);
            res.send('Error creating user');
        }
    }
})

module.exports = router;