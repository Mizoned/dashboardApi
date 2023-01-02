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

module.exports = router;