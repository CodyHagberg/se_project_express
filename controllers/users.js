const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { JWT_SECRET } = require('../utils/config');
const {
  BAD_REQUEST,
  NOT_FOUND,
  CONFLICT,
  INTERNAL_SERVER_ERROR,
  CREATED,
  OK,
  UNATHORIZED,
} = require('../utils/errors');

// SIGN UP
const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) =>
      User.create({
        name,
        avatar,
        email,
        password: hash,
      })
    )
    .then((user) => {
      const userObj = user.toObject();
      delete userObj.password;

      res.status(CREATED).send(userObj);
    })
    .catch((err) => {
      if (err.code === 11000) {
        return res.status(CONFLICT).send({ message: 'Email already exists' });
      }
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Invalid data' });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: 'Server error' });
    });
};

// SIGN IN
const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(BAD_REQUEST).send({ message: 'Email and password are required' });
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

     return res.send({ token });
    })
    .catch(() =>
      res.status(UNATHORIZED).send({ message: 'Invalid email or password' })
    );
};

// GET CURRENT USER
const getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).send({ message: 'User not found' });
      }
      return res.status(OK).send(user);
    })
    .catch(() =>
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: 'Server error' })
    );
};

// UPDATE PROFILE
const updateProfile = (req, res) => {
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).send({ message: 'User not found' });
      }
      return res.status(OK).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Invalid data' });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: 'Server error' });
    });
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateProfile,
};

