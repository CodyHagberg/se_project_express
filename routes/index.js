const router = require('express').Router();

const userRouter = require('../routes/users');
const clothingItemsRouter = require('../routes/clothingItems');

router.use('/clothing-items', clothingItemsRouter);

router.use('/users', userRouter);

module.exports = router;