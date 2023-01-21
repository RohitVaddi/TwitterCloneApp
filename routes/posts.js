const express = require('express');
const { Post, validate } = require('../models/post');
const responseHandler = require('../middleware/responseHandler');
const { User } = require('../models/user');


// create posts

const createPost = async (data, socket) => {

    try {
        const { postTitle, postDescription } = data;

        const user = socket.handshake.auth.user

        // if (user && user._id) {
            const { error } = validate(data);
            if (error) return responseHandler(socket, 'createPost', { success: false, message: error.details[0].message });
            let postData = await Post.create({
                postTitle: postTitle,
                postDescription: postDescription,
                userId: user._id
            });

            return responseHandler(socket, 'createPost', { success: true, message: 'Post created', data: postData });
        // }
    } catch (error) {
        return responseHandler(socket, 'createPost', { success: false, message: error.message, data: {} });
    }

}


// get the user posts lists

const getUserPost = async (data, socket) => {

    try {

        const { userId } = data

        const user = await User.findById(userId);
        if (!user) return responseHandler(socket, 'getUserPost', { success: false, message: 'user not found', data: {} });

        const post = await Post.find({ userId: userId }).populate('likes', '_id userName').populate('comments.userId', '_id userName');
        if (!post.length) return responseHandler(socket, 'getUserPost', { success: false, message: 'This user post not found', data: {} });
        return responseHandler(socket, 'getUserPost', { success: true, message: 'success', data: post })


    } catch (error) {
        return responseHandler(socket, 'getUserPost', { success: false, message: error.message, data: {} })
    }

}

// likes on the post 

const like = async (data, socket) => {

    try {
        const { postId } = data;

        const user = socket.handshake.auth.user

        if (user && user._id) {
            var postData = await Post.findOne({ _id: postId });
            if (!postData) return responseHandler(socket, 'like', { success: false, message: 'Post not found', data: {} });

            const likeData = postData.likes

            if (likeData.includes(user._id)) {
                postData = await Post.findOneAndUpdate({ _id: postId }, { $pull: { likes: user._id } }, { new: true })
            }
            else {
                postData = await Post.findOneAndUpdate({ _id: postId }, { $push: { likes: user._id } }, { new: true })
            }

            return responseHandler(socket, 'like', { success: true, message: 'post like', data: postData });
        }
    } catch (error) {
        return responseHandler(socket, 'like', { success: false, message: error.message, data: {} });
    }

}


// comments on the post 

const comment = async (data, socket) => {

    try {
        const { postId, comment } = data

        const user = socket.handshake.auth.user
        if (user && user._id) {
            var postData = await Post.findOne({ _id: postId });
            if (!postData) return responseHandler(socket, 'comment', { success: false, message: 'Post not found', data: {} });

            const commentData = await Post.findOneAndUpdate({ _id: postId }, { $push: { comments: { userId: user._id, comment: comment } } }, { new: true });

            return responseHandler(socket, 'comment', { success: true, message: 'post comment', data: commentData });

        }
    } catch (error) {
        return responseHandler(socket, 'comment', { success: false, message: error.message, data: {} });
    }

}

const deletePost = async (data, socket) => {

    try {

        const { postId } = data

        const user = socket.handshake.auth.user;
        if (user && user._id) {
            var postData = await Post.findOne({ _id: postId, userId: user._id });
            if (!postData) return responseHandler(socket, 'deletePost', { success: false, message: 'Post not found', data: {} });

            const postDeleteData = await Post.findOneAndDelete({ _id: postId });

            return responseHandler(socket, 'deletePost', { success: true, message: 'post deleted', data: postDeleteData });

        }

    } catch (error) {
        return responseHandler(socket, 'deletePost', { success: false, message: error.message, data: {} })
    }

}

module.exports = { createPost, getUserPost, like, comment, deletePost };