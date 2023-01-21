const mongoose = require('mongoose');
const Joi = require('joi');

// post Schema

const postSchema = new mongoose.Schema({

    postTitle: {
        type: String
    },

    postDescription: {
        type: String
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Users'
    },

    likes: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Users'
    }],
    
    comments: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
            comment: {
                type: String
            }
        }
    ]

});

// post model

const Post = mongoose.model('Post', postSchema);

// validation function

function validatePost(post) {
    return Joi.object({
        postTitle: Joi.string().min(3).max(255).required(),
        postDescription: Joi.string().min(3).max(255).required(),
        likes: Joi.array().allow(),
        comments: Joi.array().allow()
    }).validate(post);
}


module.exports.Post = Post;
module.exports.validate = validatePost;