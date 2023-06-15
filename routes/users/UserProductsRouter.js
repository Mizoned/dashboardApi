const Router = require('express');
const router = new Router();
const UserProductsController = require('../../controllers/users/UserProductsController');
const authMiddleware = require('../../middleware/AuthMiddleware');
const checkUserAccess = require('../../middleware/CheckUserAccess');
const FileUploadMiddleware = require('../../middleware/FileUploadMiddleware');
const { FILE_UPLOADS } = require('../../config/constants');
const { body } = require('express-validator');


router.get('/:userId/products/released',
	authMiddleware,
	checkUserAccess,
	UserProductsController.getAllReleasedProducts
);

router.get('/:userId/products/drafted',
	authMiddleware,
	checkUserAccess,
	UserProductsController.getAllDraftProducts
);

router.get('/:userId/products/scheduled',
	authMiddleware,
	checkUserAccess,
	UserProductsController.getAllScheduledProducts
);

router.get('/:userId/products/:productId',
	authMiddleware,
	checkUserAccess,
	UserProductsController.getOne
);

router.put('/:productId',
	authMiddleware,
	checkUserAccess
);

router.post('/:productId',
	authMiddleware,
	checkUserAccess
);

router.delete('/:productId',
	authMiddleware,
	checkUserAccess,
	UserProductsController.remove
);

router.post('/:userId/products/drafted',
	authMiddleware,
	checkUserAccess,
	FileUploadMiddleware([FILE_UPLOADS.product.files, FILE_UPLOADS.product.images]).fields([
		{ name: 'pictures', maxCount: 3 },
		{ name: 'content', maxCount: 3 }
	]),
	body('name').notEmpty().withMessage('Поле обязательно для заполнения'),
	body('description').notEmpty().withMessage('Поле обязательно для заполнения'),
	body('price')
		.isNumeric().withMessage('Поле должено быть числовым')
		.notEmpty().withMessage('Поле обязательно для заполнения'),
	UserProductsController.createDraft
);

router.post('/:userId/products/released',
	authMiddleware,
	checkUserAccess,
	FileUploadMiddleware([FILE_UPLOADS.product.files, FILE_UPLOADS.product.images]).fields([
		{ name: 'pictures', maxCount: 3 },
		{ name: 'content', maxCount: 3 }
	]),
	body('name').notEmpty().withMessage('Поле обязательно для заполнения'),
	body('description').notEmpty().withMessage('Поле обязательно для заполнения'),
	body('price')
		.isNumeric().withMessage('Поле должено быть числовым')
		.notEmpty().withMessage('Поле обязательно для заполнения'),
	UserProductsController.createReleased
);

router.post('/:userId/products/scheduled',
	authMiddleware,
	checkUserAccess,
	body('name').notEmpty().withMessage('Поле обязательно для заполнения'),
	body('description').notEmpty().withMessage('Поле обязательно для заполнения'),
	body('price')
		.isNumeric().withMessage('Поле должено быть числовым')
		.notEmpty().withMessage('Поле обязательно для заполнения'),
	body('date').isDate().withMessage('Поле должно быть датой'),
	UserProductsController.createScheduled
);

router.delete('/:userId/products/:productId',
	authMiddleware,
	checkUserAccess,
	UserProductsController.remove
);

module.exports = router;