const jwt = require('jsonwebtoken');
const jwtPrivateKey = process.env.JWTPRIVATEKEY
const responseHandler = require('../middleware/responseHandler');
const { User } = require('../models/user');

module.exports = async function (socket, token) {
    let authToken = socket.handshake.headers.token
    if (!authToken) {
        socket.handshake.auth.user = {}
        return responseHandler(socket, '', { success: false, message: 'Token is required for authentication', data: {} })
    };

    try {
        const decoded = jwt.verify(authToken, jwtPrivateKey);
        const userData = await User.findOne({ _id: decoded._id })
        if (!userData) {
            socket.handshake.auth.user = {}
            return responseHandler(socket, '', { success: false, message: 'Invalid user', data: {} })
        };

        if (!decoded) {
            socket.handshake.auth.user = {}
            return responseHandler(socket, '', { success: false, message: 'Invalid token', data: {} })
        };
        return socket.handshake.auth.user = decoded
    }
    catch (ex) {
        socket.handshake.auth.user = {}
        return responseHandler(socket, '', { success: false, message: 'Invalid token', data: {} });
    }
}