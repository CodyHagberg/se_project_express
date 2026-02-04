const router = require('express').Router();
const { login, createUser } = require('../controllers/users');
const userRouter = require('./users');
const clothingItemRouter = require('./clothingItems');
const  NotFoundError = require('../errors/not-found-err');
const { validateLogin, validateUser } = require('../middlewares/validation');


router.post('/signin', validateLogin, login);
router.post('/signup', validateUser, createUser);

router.use('/users', userRouter);
router.use('/items', clothingItemRouter);



router.use((req, res, next) => {
  next(new NotFoundError('Requested resource not found'));
});

module.exports = router;