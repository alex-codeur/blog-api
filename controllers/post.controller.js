const PostModel = require('../models/post.model');
const UserModel = require('../models/user.model');
const ObjectID = require('mongoose').Types.ObjectId;

module.exports.getAllPosts = async (req, res) => {
    try {
        const posts = await PostModel.find({});

        res.status(200).json(posts);
    } catch(err) {
        res.status(500).json(err);
    }
};

module.exports.getSinglePost = async (req, res) => {
    try {
        const post = await PostModel.findById(req.params.id);

        res.status(200).json(post);
    } catch(err) {
        res.status(500).json(err);
    }
};

module.exports.createPost = async (req, res) => {
    const newPost = new PostModel(req.body);

    try {
        const savedPost = await newPost.save();

        res.status(200).json(savedPost);
    } catch(err) {
        res.status(500).json(err);
    }
};

module.exports.updatePost = async (req, res) => {
    try {
        const updatedPost = await PostModel.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true }
        );

        res.status(200).json(updatedPost);
    } catch(err) {
        res.status(500).json(err);
    }
};

module.exports.deletePost = async (req, res) => {
    try {
        await PostModel.deleteOne();

        res.status(200).json("Post has been deleted...");
    } catch(err) {
        res.status(500).json(err);
    }
};