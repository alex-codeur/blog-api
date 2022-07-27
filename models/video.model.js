const mongoose = require('mongoose');

const VideoSchema = new mongoose.Schema(
    {
        videoId: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "user",
        },
        viewsCount: {
            type: String,
            default: 0,
        },
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('video', VideoSchema);