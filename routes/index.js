const Router = require('express');
const router = new Router();
const usersRouter = require('./users/UsersRouter');
const authRouter = require('./AuthRouter');
const productsRouter = require('./ProductsRouter');

router.use('/auth', authRouter);
router.use('/users', usersRouter);
router.use('/products', productsRouter);

module.exports = router;