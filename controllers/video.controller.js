const VideoModel = require('../models/video.model');
const paginate = require("express-paginate");
const fs = require('fs');

module.exports.getAllVideos = async (req, res) => {
    try {
        // const posts = await PostModel.find({}).sort({createdAt: -1});
        const [results, itemCount] = await Promise.all([
            VideoModel.find({})
                .sort({ createdAt: -1 })
                .limit(req.query.limit)
                .skip(req.skip)
                .lean()
                .exec(),
            VideoModel.count({})
        ]);

        const pageCount = Math.ceil(itemCount / req.query.limit);

        // res.status(200).json(categories);
        return res.status(201).json({
            object: "list",
            has_more: paginate.hasNextPages(req)(pageCount),
            data: results,
            pageCount,
            itemCount,
            currentPage: req.query.page,
            pages: paginate.getArrayPages(req)(3, pageCount, req.query.page),
        });
    } catch(err) {
        return res.status(500).json({
            message: err.message,
            success: false
        });
    }
};

module.exports.getSingleVideo = async (req, res) => {
    try {
        // const post = await PostModel.findById(req.params.id);
        let video = await VideoModel.findByIdAndUpdate(req.params.id, {
            $inc: { viewsCount: 1 },
        });

        if (video) {
            return res.status(200).json(video);
        }

        return res.status(404).json({
            message: "Video not found",
            success: false,
        });
    } catch(err) {
        return res.status(500).json({
            message: err.message,
            success: false
        });
    }
};

module.exports.createVideo = async (req, res) => {
    const newVideo = req.body;
    const imageName = req.file.filename;
    newVideo.photo = imageName;

    try {
        const savedVideo = await VideoModel.create(newVideo);

        res.status(200).json(savedVideo);
    } catch(err) {
        res.status(500).json(err);
    }
};

module.exports.updateVideo = async (req, res) => {
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

    const updatedVideo = req.body;
    updatedVideo.photo = new_image;

    try {
        await VideoModel.findByIdAndUpdate(id, updatedVideo);

        res.status(200).json(updatedPost);
    } catch (err) {
        res.status(500).json(err);
    }
};

module.exports.deleteVideo = async (req, res) => {
    const id = req.params.id;

    try {
        const result = await VideoModel.findByIdAndDelete(id);
        if (result.photo != '') {
            try {
                fs.unlinkSync('./uploads/' + result.photo);
            } catch(err) {
                console.log(err)
            }
        }

        res.status(200).json("Video has been deleted...");
    } catch(err) {
        res.status(500).json(err);
    }
};

module.exports.getTopVideos = async (req, res) => {
    try {
        // const posts = await PostModel.find({}).sort({createdAt: -1});
        const results = await VideoModel.find({})
        .sort({ createdAt: -1 })
        .limit(4)
        .lean()
        .exec();

        return res.status(201).json({
            data: results,
        });
    } catch(err) {
        return res.status(500).json({
            message: err.message,
            success: false
        });
    }
};