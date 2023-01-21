const express = require('express');
const { User, validate } = require('../models/user');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth');
const responseHandler = require('../middleware/responseHandler');
const secretKey = process.env.JWTPRIVATEKEY


// user registration

const register = async (data, socket) => {
    const { userName, firstName, lastName, email, phone, password } = data;

    const { error } = validate(data);
    if (error) return responseHandler(socket, 'signup', { success: false, message: error.details[0].message, data: {} });

    const oldUser = await User.findOne({
        $or: [
            {
                email: email
            }, {
                userName: userName
            }, {
                phone: phone
            }
        ]
    });
    if (oldUser && (oldUser.email === email || oldUser.userName === userName || oldUser.phone === phone)) {
        return responseHandler(socket, 'signup', { success: false, message: 'user already exists...', data: {} });
    }

    const salt = await bcrypt.genSalt(10);
    const newUser = await bcrypt.hash(password, salt);
    const userData = await User.create({
        userName: userName,
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone: phone,
        password: newUser
    });
    let dataPayload = {
        userName, firstName, lastName, email, phone
    }

    return responseHandler(socket, 'signup', { success: true, message: 'User register successfully...', data: dataPayload });
}

// user login

const login = async (data, socket) => {

    try {
        const { email, userName, phone, password } = data;

        let findUser = await User.findOne({ $or: [{ email: email }, { userName: userName }, { phone: phone }] });
        if (!findUser) return responseHandler(socket, 'login', { success: false, message: 'Incorrect username or password', data: {} });

        if (await bcrypt.compare(password, findUser.password)) {
            let token = jwt.sign({ _id: findUser._id, userName: findUser.userName, email: findUser.email, phone: findUser.phone }, secretKey)
            let dataPayload = {
                userName: findUser.userName, email: findUser.email, phone: findUser.phone, token
            }
            return responseHandler(socket, 'login', { success: true, message: 'Login successful...', data: dataPayload });
        }
        else {
            return responseHandler(socket, 'login', { success: false, message: 'Incorrect username or password', data: {} });
        }
    } catch (error) {
        if (error.valueType === 'string') {
            return responseHandler(socket, 'login', { success: true, message: 'phone must be number', data: {} });
        }
        return responseHandler(socket, 'login', { success: true, message: error, data: {} });

    }
}


module.exports = { register, login };

