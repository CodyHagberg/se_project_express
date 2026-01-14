const User = require('../models/user');
const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  CREATED,
  OK,
} = require('../utils/errors');

// Get all users
const getUsers = (req, res) => {
  User.find({})
  .then((users) => res.status(OK).send(users))
  .catch((err) => {
    console.error(err);
    return res.status(INTERNAL_SERVER_ERROR).send({ message: "An error has occurred on the server" });
  });
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === 'ValidationError') {
        return res.status(CREATED).send({ message: err.message });
      }
      return res.status(BAD_REQUEST).send({ message: err.message });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).send({ message: 'User not found' });
      }
      return res.status(OK).send(user);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Invalid user id' });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: "An error has occurred on the server" });
    });
};

module.exports = { getUsers, createUser, getUser };
