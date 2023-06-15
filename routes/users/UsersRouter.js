const Router = require('express');
const router = new Router();
const userProductsRouter = require('./UserProductsRouter');
const userPurchasesRouter = require('./UserPurchasesRouter');
const userController = require('../../controllers/UserController');
const authMiddleware = require('../../middleware/AuthMiddleware');
const checkUserAccess = require('../../middleware/CheckUserAccess');
const FileUploadMiddleware = require('../../middleware/FileUploadMiddleware');
const { body } = require('express-validator');
const {FILE_UPLOADS} = require("../../config/constants");
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
	userController.updateUser
);

/**
 * Обновление аватарки пользователя
 */
router.put('/:userId/avatar',
	authMiddleware,
	checkUserAccess,
	FileUploadMiddleware(FILE_UPLOADS.avatar).single('avatar'),
	userController.updateAvatar
);

/**
 * Удаление аватарки пользователя
 */
router.delete('/:userId/avatar',
	authMiddleware,
	checkUserAccess,
	userController.deleteAvatar
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
	userController.updatePassword
);

/**
 * Маршруты связанные с продуктами пользователя
 */
router.use('/', userProductsRouter);

/**
 * Маршруты связанные с покупками пользователя
 */
router.use('/', userPurchasesRouter);

module.exports = router;