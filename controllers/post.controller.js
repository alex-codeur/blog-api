const PostModel = require('../models/post.model');
const paginate = require("express-paginate");
const fs = require('fs');

module.exports.getAllPosts = async (req, res) => {
    try {
        // const posts = await PostModel.find({}).sort({createdAt: -1});
        const [results, itemCount] = await Promise.all([
            PostModel.find({})
                .populate("category", "title")
                .sort({ createdAt: -1 })
                .limit(req.query.limit)
                .skip(req.skip)
                .lean()
                .exec(),
            PostModel.count({})
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

module.exports.getSinglePost = async (req, res) => {
    try {
        const post = await PostModel.findById(req.params.id);
        // let post = await PostModel.findByIdAndUpdate(req.params.id, {
        //     $inc: { viewsCount: 1 },
        // }).populate("category", "title");

        if (post) {
            return res.status(200).json(post);
        }

        return res.status(404).json({
            message: "Post not found",
            success: false,
        });
    } catch(err) {
        return res.status(500).json({
            message: err.message,
            success: false
        });
    }
};

module.exports.getSinglePostBySlug = async (req, res) => {
    try {
        // const post = await PostModel.findById(req.params.id);
        let post = await PostModel.findByIdAndUpdate(req.params.slug, {
            $inc: { viewsCount: 1 },
        }).populate("category", "title");

        if (post) {
            post.comments = await CommentModel.find({ post: post._id });
            
            return res.status(200).json(post);
        }

        return res.status(404).json({
            message: "Post not found",
            success: false,
        });
    } catch(err) {
        return res.status(500).json({
            message: err.message,
            success: false
        });
    }
};

module.exports.createPost = async (req, res) => {
    const newPost = req.body;
    newPost.slug = this.generateSlug(newPost.title);
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

module.exports.getTopPosts = async (req, res) => {
    try {
        // const posts = await PostModel.find({}).sort({createdAt: -1});
        const results = await PostModel.find({})
        .populate("category", "title")
        .sort({ createdAt: -1 })
        .limit(6)
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

module.exports.generateSlug = (title) => {
    const slugText = title.toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");

    return slugText;
}

module.exports.commentPost = (req, res) => {
    try {
        return PostModel.findByIdAndUpdate(
            req.params.id,
            {
                $push: {
                    comments: {
                        commenterId: req.body.commenterId,
                        commenterPseudo: req.body.commenterPseudo,
                        text: req.body.text,
                        timestamp: new Date().getTime()
                    }
                }
            },
            { new: true },
            (err, docs) => {
                if (!err) return res.send(docs);
                else return res.status(400).send(err);
            }
        );
    } catch (err) {
        return res.status(400).send(err);
    }
};

module.exports.editCommentPost = (req, res) => {
    try {
        return PostModel.findById(
            req.params.id,
            (err, docs) => {
                const theComment = docs.comments.find((comment) => comment._id.equals(req.body.commentId));

                if (!theComment) return res.status(404).send('Comment not found')
                theComment.text = req.body.text;

                return docs.save((err) => {
                    if (!err) return res.status(200).send(docs);
                    return res.status(500).send(err);
                });
            }
        );
    } catch (err) {
        return res.status(400).send(err);
    }
};

module.exports.deleteCommentPost = (req, res) => {
    try {
        return PostModel.findByIdAndUpdate(
            req.params.id,
            {
                $pull: {
                    comments: {
                        _id: req.body.commentId,
                    }
                }
            },
            { new: true },
            (err, docs) => {
                if (!err) return res.send(docs);
                else return res.status(400).send(err);
            }
        );
    } catch (err) {
        return res.status(400).send(err);
    }
};