const router = require('express').Router();

const userRouter = require('../routes/users');
const clothingItem = require('../routes/clothingItems');

router.use('/items', clothingItem);

router.use('/users', userRouter);

module.exports = router;