const PostModel = require('../models/post.model');
const UserModel = require('../models/user.model');
const ObjectID = require('mongoose').Types.ObjectId;

const fs = require('fs');

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
    const newPost = req.body;
    const imageName = req.file.filename;
    newPost.photo = imageName;

    try {
        const savedPost = await PostModel.create(newPost);

        res.status(200).json(savedPost);
    } catch(err) {
        res.status(500).json(err);
    }
};

module.exports.updatePost = async (req, res) => {
    const id = req.params.id;
    let new_image = "";

    if (req.file) {
        new_image = req.file.filename;

        try {
            fs.unlinkSync("./uploads/" + req.body.old_image);
        } catch(err) {
            res.status(500).json(err);
        }
    } else {
        new_image = req.body.old_image;
    }

    const updatedPost = req.body;
    updatedPost.photo = new_image;

    try {
        await PostModel.findByIdAndUpdate(id, updatedPost);

        res.status(200).json(updatedPost);
    } catch (err) {
        res.status(500).json(err);
    }
};

module.exports.deletePost = async (req, res) => {
    const id = req.params.id;

    try {
        const result = await PostModel.findByIdAndDelete(id);
        if (result.photo != '') {
            try {
                fs.unlinkSync('./uploads/' + result.photo);
            } catch(err) {
                console.log(err)
            }
        }

        res.status(200).json("Post has been deleted...");
    } catch(err) {
        res.status(500).json(err);
    }
};