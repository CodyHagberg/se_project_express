const auth = require('../middlewares/auth');
const router = require('express').Router();
const { createItem, getItems, deleteItem, likeItem, unlikeItem} = require('../controllers/clothingItems');

router.get("/", getItems);
router.post("/", auth, createItem);
router.delete("/:id", auth, deleteItem);

router.put('/:itemId/likes', auth, likeItem);
router.delete('/:itemId/likes', auth, unlikeItem);

module.exports = router;