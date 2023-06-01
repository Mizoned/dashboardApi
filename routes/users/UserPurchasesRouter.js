const Router = require('express');
const router = new Router();
const purchaseController = require('../../controllers/PurchaseController');
const authMiddleware = require('../../middleware/AuthMiddleware');
const checkUserAccess = require('../../middleware/CheckUserAccess');
const { body } = require('express-validator');

router.get('/:purchaseId',
	authMiddleware,
	checkUserAccess
);

module.exports = router;