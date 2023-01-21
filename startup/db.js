const mongoose = require('mongoose');

// database connection

module.exports = function () {

    mongoose.connect('mongodb://localhost/twitterClone')
        .then(() => console.log('Connected to database successfully...'))
        .catch((err) => console.log('Could not connect...', err.message));
}