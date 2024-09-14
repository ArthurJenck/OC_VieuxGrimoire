const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const BookSchema = mongoose.Schema({
  title: { type: String, required: true, unique: true },
  author: { type: String, required: true },
  year: { type: Number, required: true },
  genre: { type: String, required: true },
  ratings: [
    {
      userId: { type: String, required: true },
      grade: { type: Number, required: true },
    },
  ],
  averageRating: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  userId: { type: String, required: true },
});

// Vérification que les champs uniques à l'aide du plugin mongoose-unique-validator
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Book', BookSchema);
