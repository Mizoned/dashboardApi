const Router = require('express');
const router = new Router();
const authMiddleware = require('../middleware/AuthMiddleware');
const productController = require('../controllers/ProductController');
const { body } = require('express-validator');

router.get('/:id',
	authMiddleware,
	productController.getOne
);

router.get('/',
	authMiddleware,
	productController.getAll
);

module.exports = router;