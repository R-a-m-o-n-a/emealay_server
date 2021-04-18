import mongoose from 'mongoose';

const mealSchema = new mongoose.Schema({
  userId: String,
  _id: String,
  title: String,
  images: [{
    _id: String,
    name: String,
    path: String,
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
});

const Meal = mongoose.model('Meal', mealSchema);

export default Meal;
