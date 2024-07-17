const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const BookSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
  },
  year: {
    type: Number
  },
  ratings: {
    type: [{
      userId: {
        type: String
      },
      grade: {
        type: Number
      }
    }]
  },
  genre: {
    type: String
  },
  averageRating: {
    type: Number
  }
});

module.exports = mongoose.model('Book', BookSchema);