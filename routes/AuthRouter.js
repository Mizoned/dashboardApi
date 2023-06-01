const Router = require('express');
const router = new Router();
const userController = require('../controllers/UserController');
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
        .notEmpty().withMessage('Поле обязательно для заполнения'),
    userController.verifyRegistrationCode
);

module.exports = router;