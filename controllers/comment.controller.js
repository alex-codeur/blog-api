const CommentModel = require('../models/comment.model');

module.exports.createComment = async (req, res) => {
    const newComment = new CommentModel({
        ...req.body,
        createdBy: req.user._id,
    });

    try {
        const savedComment = await newComment.save();

        return res.status(201).json({
            message: "Item successfully created",
            success: true,
            comment: savedComment
        });
    } catch(err) {
        return res.status(500).json({
            message: err.message,
            success: false
        });
    }
};

module.exports.deleteComment = async (req, res) => {
    try {
        await CommentModel.deleteOne();

        // res.status(200).json("Comment has been deleted...");
        return res.status(201).json({
            message: "Comment has been deleted...",
            success: true,
        });
    } catch(err) {
        return res.status(500).json({
            message: err.message,
            success: false
        });
    }
};