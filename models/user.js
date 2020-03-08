const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const userSchema = new mongoose.Schema({
    admin: Boolean,
    displayName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    emailVerified: Boolean,
    photoUrl: String,
    password: String,
    // uid: String
});

const User = mongoose.model('user',userSchema);

function validate(data){
    const schema = Joi.object({
        displayName: Joi.string(),
        email: Joi.string().required().email(),
        password: Joi.string()
    });

    return schema.validate(data);
}

function validateLogin(data){
    const schema = Joi.object({
        email: Joi.string().required().email(),
        password: Joi.string().required()
    });

    return schema.validate(data);
}

module.exports.userSchema = userSchema;
module.exports.User = User;
module.exports.validate = validate;
module.exports.validateLogin = validateLogin;