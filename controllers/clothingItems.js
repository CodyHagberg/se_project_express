const ClothingItem = require('../models/clothingItem');

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: err.message });
      }
      return res.status(500).send({ message: err.message });
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.error(err);
      return res.status(500).send({ message: err.message });
    });
};

const deleteItem = (req, res) => {
  const { id } = req.params;

  ClothingItem.findByIdAndDelete(id)
    .then((item) => {
      if (!item) {
        return res.status(404).send({ message: 'Item not found' });
      }
      return res.status(200).send({ message: 'Clothing item deleted successfully' });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Invalid item id' });
      }
      return res.status(500).send({ message: err.message });
    });
};

const likeItem = (req, res) => {
  const { itemId } = req.params;
  const userId = '6966ffe96711ba4eb3974b16';

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: userId } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        return res.status(404).send({ message: 'Item not found' });
      }
      return res.status(200).send(item);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Invalid item id' });
      }
      return res.status(500).send({ message: err.message });
    });
};

const unlikeItem = (req, res) => {
  const { itemId } = req.params;
  const userId = '6966ffe96711ba4eb3974b16';

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: userId } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        return res.status(404).send({ message: 'Item not found' });
      }
      return res.status(200).send(item);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Invalid item id' });
      }
      return res.status(500).send({ message: err.message });
    });
};

module.exports = { createItem, getItems, deleteItem, likeItem, unlikeItem };