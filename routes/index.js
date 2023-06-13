const Router = require('express');
const router = new Router();
const usersRouter = require('./users/UsersRouter');
const authRouter = require('./AuthRouter');
const productsRouter = require('./ProductsRouter');
const purchaseRouter = require('./PurchaseRouter');

router.use('/auth', authRouter);
router.use('/users', usersRouter);
router.use('/products', productsRouter);
router.use('/purchase', purchaseRouter);

module.exports = router;