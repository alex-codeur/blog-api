const router = require('express').Router();
const categoryController = require('../controllers/category.controller');

router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getSingleCategory);
router.post('/', categoryController.createCategory);
router.put('/:id', categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;