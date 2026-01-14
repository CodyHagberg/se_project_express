const User = require('../models/user');

// Get all users
const getUsers = (req, res) => {
  User.find({})
  .then((users) => res.status(200).send(users))
  .catch((err) => {
    console.error(err);
    return res.status(500).send({ message: err.message });
  });
};

const createUser = (req, res) => {
  const { username, avatar } = req.body;

  User.create({ username, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: err.message });
      }
      return res.status(500).send({ message: err.message });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: err.message });
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === 'CastError') {
        return res.status(400).send({ message: err.message });
      }
      return res.status(500).send({ message: err.message });
    });
};

module.exports = { getUsers, createUser, getUser };
