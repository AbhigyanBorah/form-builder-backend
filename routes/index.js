const router = require('express').Router();
const authRouter = require('./auth-routes');
const userRouter = require('./user-routes');
const formRouter = require('./form-routes');

router.use('/', authRouter);
router.use('/user', userRouter);
router.use('/form', formRouter);

module.exports = router;
