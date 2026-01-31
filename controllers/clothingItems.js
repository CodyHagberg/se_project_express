const ClothingItem = require('../models/clothingItem');
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');
const {
  CREATED,
  OK,
  INTERNAL_SERVER_ERROR,
} = require('../utils/errors');

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => res.status(CREATED).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === 'ValidationError') {
        return res.status(BadRequestError).send({ message: "Invalid data" });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: "An error has occurred on the server" });
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(OK).send(items))
    .catch((err) => {
      console.error(err);
      return res.status(INTERNAL_SERVER_ERROR).send({ message: "An error has occurred on the server" });
    });
};

const deleteItem = (req, res) => {
  const { id } = req.params;

  // Find the item first
  ClothingItem.findById(id)
    .then((item) => {
      if (!item) {
        return res.status(NotFoundError).send({ message: 'Item not found' });
      }

      if (!item.owner.equals(req.user._id)) {
        return res.status(ForbiddenError).send({ message: 'Forbidden: not the owner' });
      }

      return ClothingItem.findByIdAndDelete(id)
        .then(() =>
          res.status(OK).send({ message: 'Clothing item deleted successfully' })
        );
    })
    .catch((err) => {
      console.error(err);
      if (err.name === 'CastError') {
        return res.status(BadRequestError).send({ message: 'Invalid item id' });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: 'Server error' });
    });
};

const likeItem = (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  ClothingItem.findByIdAndUpdate(
    id,
    { $addToSet: { likes: userId } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        return res.status(NotFoundError).send({ message: 'Item not found' });
      }
      return res.status(OK).send(item);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === 'CastError') {
        return res.status(BadRequestError).send({ message: 'Invalid item id' });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: "An error has occurred on the server" });
    });
};

const unlikeItem = (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  ClothingItem.findByIdAndUpdate(
    id,
    { $pull: { likes: userId } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        return res.status(NotFoundError).send({ message: 'Item not found' });
      }
      return res.status(OK).send(item);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === 'CastError') {
        return res.status(BadRequestError).send({ message: 'Invalid item id' });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: "An error has occurred on the server" });
    });
};

module.exports = { createItem, getItems, deleteItem, likeItem, unlikeItem };