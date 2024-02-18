import mongoose from 'mongoose';

const mealSchema = new mongoose.Schema({
  userId: String,
  _id: String,
  title: String,
  images: [{
    _id: String,
    name: String,
    url: String,
    cloudinaryPublicId: String,
    isMain: Boolean,
    }],
  recipeLink: String,
  comment: String,
  createdAt: {
    type: Date,
    default: new Date()
  },
  category: String,
  tags: [],
  isPrivate: Boolean,
  isToTry: Boolean,
});

const Meal = mongoose.model('Meal', mealSchema);

export default Meal;
