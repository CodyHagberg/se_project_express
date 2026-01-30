const { Joi, celebrate } = require('celebrate');
const objectIdRegex = /^[0-9a-fA-F]{24}$/;
const validator = require('validator');


const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.message('Invalid URL format');
};

const validateClothingItem= celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      'string.empty': 'The "name" field must be filled in',
      'string.min': 'The minimum length of the "name" field is 2',
      'string.max': 'The maximum length of the "name" field is 30',
    }),
    weather: Joi.string().required().messages({
      'string.empty': 'The "weather" field must be filled in',
    }),
    imageUrl: Joi.string().custom(validateURL).required().messages({
      'string.empty': 'The "imageUrl" field must be filled in',
      'string.url': 'The "imageUrl" field must be a valid URL',
    }),
  }),
});

const validateUser = celebrate ({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).messages({
      'string.min': 'The minimum length of the "name" field is 2',
      'string.max': 'The maximum length of the "name" field is 30',
    }),
    avatar: Joi.string().custom(validateURL).required().messages({
      'string.empty': 'The "avatar" field must be filled in',
      'string.url': 'The "avatar" field must be a valid URL',
    }),
    email: Joi.string().required().email().messages({
      'string.empty': 'The "email" field must be filled in',
      'string.email': 'The "email" field must be a valid email address',
    }),
    password: Joi.string().required().messages({
      'string.empty': 'The "password" field must be filled in',
    }),
  }),
});

const validateLogin = celebrate ({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      'string.empty': 'The "email" field must be filled in',
      'string.email': 'The "email" field must be a valid email address',
    }),
    password: Joi.string().required().messages({
      'string.empty': 'The "password" field must be filled in',
    }),
  }),
});

const validateProfileUpdate = celebrate ({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      'string.empty': 'The "name" field must be filled in',
      'string.min': 'The minimum length of the "name" field is 2',
      'string.max': 'The maximum length of the "name" field is 30',
    }),
    avatar: Joi.string().custom(validateURL).messages({
      'string.empty': 'The "avatar" field must be filled in',
      'string.url': 'The "avatar" field must be a valid URL',
    }),
  }).min(1),
});

const validateItemId = celebrate ({
  params: Joi.object().keys({
    id: Joi.string().required().pattern(objectIdRegex),
  }),
});

module.exports = {
  validateClothingItem,
  validateUser,
  validateLogin,
  validateItemId,
  validateProfileUpdate,
  validateURL,
};

