const Router = require('express');
const router = new Router();
const productsController = require('../../controllers/ProductsController');
const authMiddleware = require('../../middleware/AuthMiddleware');
const checkUserAccess = require('../../middleware/CheckUserAccess');
const { body } = require('express-validator');

router.get('/:productId',
	authMiddleware,
	checkUserAccess
);

router.get('/released',
	authMiddleware,
	checkUserAccess
);

router.get('/draft',
	authMiddleware,
	checkUserAccess
);

router.get('/scheduled',
	authMiddleware,
	checkUserAccess
);

router.put('/:productId',
	authMiddleware,
	checkUserAccess
);

router.post('/:productId',
	authMiddleware,
	checkUserAccess
);

router.delete('/:productId',
	authMiddleware,
	checkUserAccess
);

module.exports = router;