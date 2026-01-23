const router = require('express').Router();
const { login, createUser } = require('../controllers/users');
const userRouter = require('./users');
const clothingItemRouter = require('./clothingItems');
const auth = require('../middlewares/auth');
const { NOT_FOUND } = require('../utils/errors');

// public routes
router.post('/signin', login);
router.post('/signup', createUser);
router.use('/items', clothingItemRouter);

// protect everything below
router.use(auth);

router.use('/users', userRouter);
router.use('/items', clothingItemRouter);

router.use((req, res) => {
  res.status(NOT_FOUND).send({ message: 'Requested resource not found' });
});

module.exports = router;