const Router = require('express');
const router = new Router();
const usersRouter = require('./users/UsersRouter');
const authRouter = require('./AuthRouter');

router.use('/auth', authRouter);
router.use('/users', usersRouter);

module.exports = router;