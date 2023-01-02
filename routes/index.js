const Router = require('express');
const router = new Router();
const userRouter = require('./UserRouter');

router.use('/user', userRouter);

module.exports = router;