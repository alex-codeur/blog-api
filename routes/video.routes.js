const router = require('express').Router();
const videoController = require('../controllers/video.controller');

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

router.get('/', videoController.getAllVideos);
router.get('/top', videoController.getTopVideos);
router.get('/:id', videoController.getSingleVideo);
router.post('/', upload, videoController.createVideo);
router.put('/:id', upload, videoController.updateVideo);
router.delete('/:id', videoController.deleteVideo);

module.exports = router;