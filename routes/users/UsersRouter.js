const Router = require('express');
const router = new Router();
const userProductsRouter = require('./UserProductsRouter');
const userPurchasesRouter = require('./UserPurchasesRouter');
const userController = require('../../controllers/UserController');
const authMiddleware = require('../../middleware/AuthMiddleware');
const checkUserAccess = require('../../middleware/CheckUserAccess');
const imageFile = require('../../middleware/imageFile');
const { body } = require('express-validator');


/**
 * Обновдление данных пользователя
 */
router.put('/:userId',
	authMiddleware,
	checkUserAccess,
	body('email')
		.isEmail().withMessage('Адрес электронной почты введен неверно'),
	body('displayName')
		.notEmpty().withMessage('Поле обязательно для заполнения')
		.isLength({ min: 4, max: 24 }).withMessage('Поле должно быть больше 3 и меньше 24 символов'),
	body('location').isLength({ max: 32 }).optional().withMessage('Поле должно быть больше 3 и меньше 32 символов'),
	body('notifyAboutProductUpdates')
		.isBoolean().withMessage('Значение должно быть логическим'),
	body('notifyAboutMarketNewsletter')
		.isBoolean().withMessage('Значение должно быть логическим'),
	body('notifyAboutComments')
		.isBoolean().withMessage('Значение должно быть логическим'),
	body('notifyAboutPurchases')
		.isBoolean().withMessage('Значение должно быть логическим'),
	userController.updateProfileData //TODO Переименовать метод в updateUser
);

/**
 * Обновление аватарки пользователя
 */
router.put('/:userId/avatar',
	authMiddleware,
	checkUserAccess,
	imageFile.single('picture'),
	userController.updateProfilePicture //TODO Переименовать метод в updateAvatar
);

/**
 * Удаление аватарки пользователя
 */
router.delete('/:userId/avatar',
	authMiddleware,
	checkUserAccess,
	userController.removeProfilePicture //TODO Переименовать метод в deleteAvatar
);

/**
 * Обновление пароля пользователя
 */
router.put('/:userId/password',
	authMiddleware,
	checkUserAccess,
	body('oldPassword').isLength({ min: 9, max: 32 }).withMessage('Поле должно быть больше 8 и меньше 32 символов'),
	body('newPassword').isLength({ min: 9, max: 32 }).withMessage('Поле должно быть больше 8 и меньше 32 символов'),
	body('confirmNewPassword').isLength({ min: 9, max: 32 }).withMessage('Поле должно быть больше 8 и меньше 32 символов'),
	userController.updateProfilePassword //TODO Переименовать метод в updatePassword
);

/**
 * Маршруты связанные с продуктами пользователя
 */
router.use('/:userId/products', userProductsRouter);

/**
 * Маршруты связанные с покупками пользователя
 */
router.use('/:userId/purchases', userPurchasesRouter);

module.exports = router;