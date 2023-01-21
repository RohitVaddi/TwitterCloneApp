const mongoose = require('mongoose');
const Joi = require('joi');


// user Schema

const userSchema = new mongoose.Schema({
    userName: {
        type: String
    },

    firstName: {
        type: String
    },

    lastName: {
        type: String
    },

    email: {
        type: String,
    },

    phone: {
        type: Number
    },

    password: {
        type: String
    },

});

// user model

const User = mongoose.model('Users', userSchema);

// validation function

function validateUser(user) {
    return Joi.object({
        userName: Joi.string().min(3).max(255).required(),
        firstName: Joi.string().min(3).max(255).required(),
        lastName: Joi.string().min(3).max(255).required(),
        email: Joi.string().min(7).max(255).email().required(),
        phone: Joi.number().min(1000000000).max(9999999999).required().messages({
            'number.empty': `"phone" cannot be an empty field`,
            'number.base': `"phone" should be a type of 'number'`,
            'number.min': `"phone" should have takes length 10 digits`,
            'number.max': `"phone" should have takes length 10 digits`,
        }),
        password: Joi.string().min(8).max(15).required().pattern(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,15}$/).messages({
            'string.empty': `"password" cannot be an empty field`,
            'string.base': `"password" should be a type of 'number'`,
            'string.pattern.base': `password should be one character, number and one special character`
        }),
    }).validate(user);
}

module.exports.User = User;
module.exports.validate = validateUser;