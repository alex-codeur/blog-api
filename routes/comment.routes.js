const router = require('express').Router();
const commentController = require('../controllers/comment.controller');

router.post('/comments', commentController.createComment);
router.delete('/comment/:id', commentController.deleteComment);

module.exports = router;