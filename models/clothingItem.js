const mongoose = require('mongoose');
const validator = require('validator');

const clothingItem = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  weather: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: [true, "Image URL is required"],
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: 'Invalid URL format for imageUrl',
    },
  },
     likes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
    default: [],
  },
});


module.exports = mongoose.model('ClothingItem', clothingItem);