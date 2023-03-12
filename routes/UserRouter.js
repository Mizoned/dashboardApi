const Router = require('express');
const router = new Router();
const userController = require('../controllers/UserController');
const authMiddleware = require('../middleware/AuthMiddleware');
const { body } = require('express-validator');

router.post('/sign-in',
    body('email').isEmail().withMessage('Адрес электронной почты введен неверно'),
    body('password').isLength({ min:6, max: 32 }).withMessage('Пароль должен быть больше 6 и меньше 32 символов'),
    userController.signIn
);

router.post('/sign-up',
    body('email').isEmail().withMessage('Адрес электронной почты введен неверно'),
    body('password').isLength({ min:6, max: 32 }).withMessage('Пароль должен быть больше 6 и меньше 32 символов'),
    userController.signUp
);

router.post('/logout', userController.logout);
router.get('/refresh', userController.refresh);
router.get('/activate/:link', userController.activate);

router.post('/send-registration-code',
    body('email').isEmail().withMessage('Адрес электронной почты введен неверно 1'),
    userController.sendRegistrationCode
);
router.post('/verify-registration-code',
    body('email')
        .isEmail().withMessage('Адрес электронной почты введен неверно'),
    body('code')
        .isLength({ min:4, max: 4 }).withMessage('Код должен состоять из 4 цифр')
        .isNumeric().withMessage('Код должен состоять только из цифр')
        .notEmpty().withMessage('Код не может быть пустым'),
    userController.verifyRegistrationCode
);
router.put('/update-profile-data',
    body('email')
        .isEmail().withMessage('Адрес электронной почты введен неверно'),
    body('displayName')
        .notEmpty().withMessage('Поле обязательно для заполнения')
        .isLength({ min: 4, max: 24}).withMessage('Поле должно быть больше 3 и меньше 24 символов'),
    body('location').isLength({ min: 4, max: 32}).withMessage('Поле должно быть больше 3 и меньше 32 символов'),
    body('notifyAboutProductUpdates')
        .isBoolean().withMessage('Значение должно быть логическим'),
    body('notifyAboutMarketNewsletter')
        .isBoolean().withMessage('Значение должно быть логическим'),
    body('notifyAboutComments')
        .isBoolean().withMessage('Значение должно быть логическим'),
    body('notifyAboutPurchases')
        .isBoolean().withMessage('Значение должно быть логическим'),
    authMiddleware,
    userController.updateProfileData
);

module.exports = router;