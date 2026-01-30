const { Joi, celebrate } = require('celebrate');
const objectIdRegex = /^[0-9a-fA-F]{24}$/;
const urlRegex = /^(https?:\/\/)(www\.)?[^\s/$.?#].[^\s]*$/i;
const validator = require('validator');

const validateClothingItem= celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    weather: Joi.string().required(),
    imageUrl: Joi.string().pattern(urlRegex).required(),
  }),
});

const validateUser = celebrate ({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(urlRegex).required(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validateLogin = celebrate ({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validateItemId = celebrate ({
  params: Joi.object().keys({
    itemId: Joi.string().required().pattern(objectIdRegex),
  }),
});

module.exports = {
  validateClothingItem,
  validateUser,
  validateLogin,
  validateItemId,
};

