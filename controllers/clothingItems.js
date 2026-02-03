const ClothingItem = require('../models/clothingItem');
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');
const UnauthorizedError = require('../errors/unauthorized-err');
const {
  CREATED,
  OK,
} = require('../utils/errors');

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => res.status(CREATED).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Invalid data for creating clothing item');
      }
      throw err;
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(OK).send(items))
    .catch((err) => {
      throw err;
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  // Find the item first
  ClothingItem.findById(itemId)
    .then((item) => {
      if (!item) {
        throw new NotFoundError('Clothing item not found');
      }

      if (!item.owner.equals(req.user._id)) {
        throw new UnauthorizedError('You are not authorized to delete this item');
      }

      return ClothingItem.findByIdAndDelete(itemId)
        .then(() =>
          res.status(OK).send({ message: 'Clothing item deleted successfully' })
        );
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Invalid item id');
      }
      throw err;
    });
};

const likeItem = (req, res) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: userId } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        throw new NotFoundError('Item not found');
      }
      return res.status(OK).send(item);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === 'CastError') {
        throw new BadRequestError('Invalid item id');
      }
      throw err;
    });
};

const unlikeItem = (req, res) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: userId } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        throw new NotFoundError('Item not found');
      }
      return res.status(OK).send(item);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === 'CastError') {
        throw new BadRequestError('Invalid item id');
      }
      throw err;
    });
};

module.exports = { createItem, getItems, deleteItem, likeItem, unlikeItem };