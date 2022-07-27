const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema(
    {
        body: {
            type: String,
            required: true
        },
        post: {
            type: Schema.Types.ObjectId,
            ref: "post",
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "user",
        },
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('comment', CommentSchema);