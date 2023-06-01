const Router = require('express');
const router = new Router();
const authMiddleware = require('../middleware/AuthMiddleware');
const productsController = require('../controllers/ProductsController');
const { body } = require('express-validator');

router.get('/:id',
	authMiddleware,
	productsController.getOne
);

router.get('/',
	authMiddleware,
	productsController.getAll
);

router.post('/drafted',
    body('name').notEmpty().withMessage('Поле обязательно для заполнения'),
    body('description').notEmpty().withMessage('Поле обязательно для заполнения'),
    body('price')
		.isNumeric().withMessage('Поле должено быть числовым')
        .notEmpty().withMessage('Поле обязательно для заполнения'),
    authMiddleware,
    productsController.createDraft
);

router.post('/released',
	body('name').notEmpty().withMessage('Поле обязательно для заполнения'),
	body('description').notEmpty().withMessage('Поле обязательно для заполнения'),
	body('price')
		.isNumeric().withMessage('Поле должено быть числовым')
		.notEmpty().withMessage('Поле обязательно для заполнения'),
	authMiddleware,
	productsController.createReleased
);

router.post('/scheduled',
	body('name').notEmpty().withMessage('Поле обязательно для заполнения'),
	body('description').notEmpty().withMessage('Поле обязательно для заполнения'),
	body('price')
		.isNumeric().withMessage('Поле должено быть числовым')
		.notEmpty().withMessage('Поле обязательно для заполнения'),
	body('date').isDate().withMessage('Поле должно быть датой'),
	authMiddleware,
	productsController.createScheduled
);

router.delete('/:id',
	authMiddleware,
	productsController.remove
);

module.exports = router;