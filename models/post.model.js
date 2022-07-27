const mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator");
const { Schema } = require('mongoose');

const PostSchema = new mongoose.Schema(
    {
        category: {
            type: Schema.Types.ObjectId,
            ref: "category",
        },
        title: {
            type: String,
            required: true,
            unique: true
        },
        slug: {
            type: String,
            required: true,
            unique: true
        },
        description: {
            type: String,
            required: true
        },
        viewsCount: {
            type: String,
            default: 0,
        },
        photo: {
            type: String,
            required: false,
        },
        username: {
            type: String,
            required: true
        },
        comments: [{
            type: Schema.Types.ObjectId,
            ref: "comment",
        }],
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "user",
        },
    },
    {
        timestamps: true
    }
);

PostSchema.plugin(uniqueValidator);
module.exports = mongoose.model('post', PostSchema);