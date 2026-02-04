const router = require('express').Router();
const auth = require('../middlewares/auth');
const { createItem, getItems, deleteItem, likeItem, unlikeItem} = require('../controllers/clothingItems');
const {validateClothingItem, validateItemId} = require('../middlewares/validation');

router.get("/", auth, getItems);
router.post("/", auth, validateClothingItem, createItem);
router.delete("/:itemId", auth, validateItemId, deleteItem);

router.put('/:itemId/likes', auth, validateItemId, likeItem);
router.delete('/:itemId/likes', auth, validateItemId, unlikeItem);

module.exports = router;