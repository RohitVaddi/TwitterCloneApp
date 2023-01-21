const users = require('../routes/users');
const posts = require('../routes/posts');
const auth = require('../middleware/auth')
const requestHandler = async (eventName, payload, socket) => {

    const { token, data } = payload;

    switch (eventName) {
        case 'signup':
            await users.register(data, socket);
            break;

        case 'login':
            await users.login(data, socket);
            break;

        case 'createPost':
            await auth(socket, token)?
            await posts.createPost(data, socket):'';
            break;

        case 'getUserPost':
            await posts.getUserPost(data, socket);
            break;

        case 'like':
            await auth(socket, token)
            await posts.like(data, socket);
            break;

        case 'comment':
            await auth(socket, token)
            await posts.comment(data, socket);
            break;

        case 'deletePost':
            await auth(socket, token)
            await posts.deletePost(data, socket);
            break;

        default:
            break;
    }

}

module.exports = requestHandler;