const router = require('express').Router();
const postController = require('../controllers/post.controller');

// upload
const multer = require('multer');

// upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads")
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    }
})

const upload = multer({
    storage: storage
}).single("photo");

router.get('/', postController.getAllPosts);
router.get('/top', postController.getTopPosts);
router.get('/:id', postController.getSinglePost);
router.get('/slug/:slug', postController.getSinglePostBySlug);
router.post('/', upload, postController.createPost);
router.put('/:id', upload, postController.updatePost);
router.delete('/:id', postController.deletePost);

// comments
router.patch('/comment-post/:id', postController.commentPost);
router.patch('/edit-comment-post/:id', postController.editCommentPost);
router.patch('/delete-comment-post/:id', postController.deleteCommentPost);

module.exports = router;