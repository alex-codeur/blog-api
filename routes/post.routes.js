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
router.get('/:id', postController.getSinglePost);
router.post('/', upload, postController.createPost);
router.put('/:id', upload, postController.updatePost);
router.delete('/:id', postController.deletePost);

module.exports = router;