const router = require('express').Router();

const userRouter = require('./users');
const clothingItem = require('./clothingItems');

router.use('/items', clothingItem);

router.use('/users', userRouter);

module.exports = router;