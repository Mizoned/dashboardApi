const Router = require('express');
const router = new Router();
const authController = require('../controllers/AuthController');
const { body } = require('express-validator');

router.post('/sign-in',
    body('email').isEmail().withMessage('Адрес электронной почты введен неверно'),
    body('password').isLength({ min:6, max: 32 }).withMessage('Пароль должен быть больше 6 и меньше 32 символов'),
	authController.signIn
);

router.post('/sign-up',
    body('email').isEmail().withMessage('Адрес электронной почты введен неверно'),
    body('password').isLength({ min:6, max: 32 }).withMessage('Пароль должен быть больше 6 и меньше 32 символов'),
	authController.signUp
);

router.post('/logout', authController.logout);
router.get('/refresh', authController.refresh);
router.get('/activate/:link', authController.activate);

router.post('/send-registration-code',
    body('email').isEmail().withMessage('Адрес электронной почты введен неверно 1'),
	authController.sendRegistrationCode
);

router.post('/verify-registration-code',
    body('email')
        .isEmail().withMessage('Адрес электронной почты введен неверно'),
    body('code')
        .isLength({ min:4, max: 4 }).withMessage('Код должен состоять из 4 цифр')
        .isNumeric().withMessage('Код должен состоять только из цифр')
        .notEmpty().withMessage('Поле обязательно для заполнения'),
	authController.verifyRegistrationCode
);

module.exports = router;