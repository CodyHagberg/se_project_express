const ClothingItem = require('../models/clothingItem');
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');
const {
  CREATED,
  OK,
} = require('../utils/errors');

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;

  return ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => res.status(CREATED).send(item))
    .catch((err) =>
      err.name === 'ValidationError'
        ? next(new BadRequestError('Invalid data for creating clothing item'))
        : next(err)
    );
};

const getItems = (req, res, next) =>
  ClothingItem.find({ owner: req.user._id })
    .then((items) => res.status(OK).send(items))
    .catch(next);


const deleteItem = (req, res, next) => {
  const { itemId } = req.params;

  // Find the item first
  return ClothingItem.findById(itemId)
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
    .catch((err) =>
      err.name === 'CastError' ? next(new BadRequestError('Invalid item id')) : next(err)
    );
};

const likeItem = (req, res, next) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  return ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: userId } },
    { new: true }
  )
    .then(item =>
      item
        ? res.status(OK).send(item)
        : next(new NotFoundError('Item not found'))
    )
    .catch(err =>
      err.name === 'CastError'
        ? next(new BadRequestError('Invalid item id'))
        : next(err)
    );
};

const unlikeItem = (req, res, next) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  return ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: userId } },
    { new: true }
  )
    .then(item =>
      item
        ? res.status(OK).send(item)
        : next(new NotFoundError('Item not found'))
    )
    .catch(err =>
      err.name === 'CastError'
        ? next(new BadRequestError('Invalid item id'))
        : next(err)
    );
};

module.exports = { createItem, getItems, deleteItem, likeItem, unlikeItem };