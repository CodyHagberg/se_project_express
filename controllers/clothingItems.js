const ClothingItem = require('../models/clothingItem');
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');
const UnauthorizedError = require('../errors/unauthorized-err');
const ForbiddenError = require('../errors/forbidden-err');
const {
  CREATED,
  OK,
} = require('../utils/errors');

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => res.status(CREATED).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Invalid data for clothing item creation'));
      }
      return next(err);
    });
};

const getItems = (req, res, next) => {
  ClothingItem.find({ owner: req.user._id })
    .then((items) => res.status(OK).send(items))
    .catch((err) => next(err));
};


const deleteItem = (req, res, next) => {
  const { itemId } = req.params;

  // Find the item first
  ClothingItem.findById(itemId)
    .then((item) => {
      if (!item) {
        return next(new NotFoundError('Item not found'));
      }

      if (!item.owner.equals(req.user._id)) {
        return next(new ForbiddenError('You do not have permission to delete this item'));
      }

      return ClothingItem.findByIdAndDelete(itemId)
        .then(() =>
          res.status(OK).send({ message: 'Clothing item deleted successfully' })
        );
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Invalid item id'));
      }
      return next(err);
    });
};

const likeItem = (req, res, next) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: userId } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        return next(new NotFoundError('Item not found'));
      }
      res.status(OK).send(item);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === 'CastError') {
        return next(new BadRequestError('Invalid item id'));
      }
      return next(err);
    });
};

const unlikeItem = (req, res, next) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: userId } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        return next(new NotFoundError('Item not found'));
      }
      res.status(OK).send(item);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === 'CastError') {
        return next(new BadRequestError('Invalid item id'));
      }
      return next(err);
    });
};

module.exports = { createItem, getItems, deleteItem, likeItem, unlikeItem };