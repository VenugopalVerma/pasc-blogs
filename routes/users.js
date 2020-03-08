const _ = require('lodash');
const bcrypt = require('bcryptjs');
const express= require('express');
const router = express.Router();
const { User, validate } = require('../models/user');
const jwt = require('jsonwebtoken');

router.post('/',async (req,res) => {
    const result = validate(req.body);
    if(result.error){
        console.log('Invalid post request',result);
        return res.status(400).send(result.error.details[0].message);
    }
    else{
        try {
            let user = await User.findOne({email: req.body.email});
            if(user) return res.status(400).send('User already registered');
            // console.log(req.body);
            
            user = new User(req.body);
            // user = new User(_.pick(req.body, ['displayName', 'email', 'password']));
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password,salt);
            user = await user.save();

            console.log('User Added successfully',user);
            
            const token = jwt.sign({ id: user._id, isAdmin: user.admin }, process.env.JWT_KEY);
            console.log('token ', token);
            // const temp = _.pick(user, ['displayName', 'email']);
            res.send(token);
        } catch (error) {
            console.error(error);
            res.send('Error creating user');
        }
    }
})

module.exports = router;