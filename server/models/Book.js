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
  }
},
{
  virtuals: {
    averageRating: {
      type: Number,
      get() {
        let l = this.ratings.length
        return l > 0 ? Math.round(this.ratings.reduce( (a, b) => a + b.grade, 0) / l*100)/100 : 0;
      }
    }
  },
  toJSON: { virtuals: true }
});

module.exports = mongoose.model('Book', BookSchema);