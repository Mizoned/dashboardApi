const Router = require('express');
const router = new Router();
const authController = require('../controllers/AuthController');
const { body } = require('express-validator');

router.post('/sign-in',
    body('email').isEmail().withMessage('Email address entered incorrectly'),
    body('password').isLength({ min:8, max: 32 }).withMessage('Password must be greater than 8 and less than 32 characters'),
	authController.signIn
);

router.post('/sign-up',
    body('email').isEmail().withMessage('Email address entered incorrectly'),
    body('password').isLength({ min:8, max: 32 }).withMessage('Password must be greater than 8 and less than 32 characters'),
	authController.signUp
);

router.post('/logout', authController.logout);
router.get('/refresh', authController.refresh);
router.get('/activate/:link', authController.activate);

router.post('/send-registration-code',
    body('email').isEmail().withMessage('Email address entered incorrectly'),
	authController.sendRegistrationCode
);

router.post('/verify-registration-code',
    body('email')
        .isEmail().withMessage('Email address entered incorrectly'),
    body('code')
        .isLength({ min:4, max: 4 }).withMessage('Code must be 4 digits')
        .isNumeric().withMessage('The code must contain only numbers')
        .notEmpty().withMessage('Required field'),
	authController.verifyRegistrationCode
);

module.exports = router;