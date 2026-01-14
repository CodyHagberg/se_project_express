const router = require('express').Router();
const { createItem, getItems, deleteItem, likeItem, unlikeItem} = require('../controllers/clothingItems');

router.get("/", getItems);
router.post("/", createItem);
router.delete("/:id", deleteItem);

router.put('/:itemId/likes', likeItem);
router.delete('/:itemId/likes', unlikeItem);

module.exports = router;