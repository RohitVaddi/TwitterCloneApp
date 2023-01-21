const responseHandler = (socket, event, data) =>{
    socket.emit('res', ({ event, data}));
}

module.exports = responseHandler;