const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { JWT_SECRET } = require('../utils/config');
const {
  CREATED,
  OK,
} = require('../utils/errors');
const BadRequestError = require('../errors/bad-request-err');
const ConflictError = require('../errors/conflict-err');
const NotFoundError = require('../errors/not-found-err');
const UnauthorizedError = require('../errors/unauthorized-err');

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
      console.error(err);
      if (err.code === 11000) {
       throw new ConflictError('User with this email already exists');
      }
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Invalid user data');
      }
      throw err;
    });
};

// SIGN IN
const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError('Email and password are required');
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
    .catch((err) => {
      console.error(err);
    if (err.message === 'Incorrect email or password') {
      throw new UnauthorizedError('Incorrect email or password');
    }
    throw err;
  });
};

// GET CURRENT USER
const getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('User not found');
      }
      return res.send(user);
    })
    .catch((err) => {
      throw err
  });
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
        throw new NotFoundError('User not found');
      }
      return res.status(OK).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Invalid data for profile update');
      }
      throw err;
    });
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateProfile,
};

