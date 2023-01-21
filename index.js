const app = require('./app');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
require('dotenv').config();
const requestHandler = require('./middleware/requestHandler');

require('./startup/db')();

// socket connection

io.on('connection', async (socket) => {

    socket.onAny((eventName, ...args) =>{
        requestHandler(eventName, args[0], socket);
    })
    socket.on('disconnect', () => {
        console.log(`socket disconnected`);
    })

});


const port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});