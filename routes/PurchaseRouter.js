const Router = require('express');
const router = new Router();
const authMiddleware = require('../middleware/AuthMiddleware');
const purchaseController = require('../controllers/PurchaseController');
const { body } = require('express-validator');

router.get('/',
	authMiddleware,
	purchaseController.get
);

router.post('/',
	authMiddleware,
	purchaseController.add
);

module.exports = router;