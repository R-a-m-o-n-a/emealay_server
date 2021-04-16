import mongoose from 'mongoose';
import Meal from "./meal.model.js";
import autopopulate from 'mongoose-autopopulate';

const planSchema = new mongoose.Schema({
  userId: String,
  title: String,
  hasDate: Boolean,
  date: {
    type: Date,
    default: null
  },
  gotEverything: Boolean,
  missingIngredients: [{
    name: String,
    checked: Boolean,
  }],
  connectedMealId: String,
  createdAt: {
    type: Date,
    default: new Date()
  }
}, {
  toJSON: { virtuals: true }, // So `res.json()` and other `JSON.stringify()` functions include virtuals
  toObject: { virtuals: true } // So `toObject()` output includes virtuals
});

/** This virtual populates the entire Meal from its ID and adds it to the plan */
planSchema.virtual('connectedMeal', {
  ref: 'Meal',
  localField: 'connectedMealId',
  foreignField: '_id',
  justOne: true,
  autopopulate: true,
});

planSchema.plugin(autopopulate);
const Plan = mongoose.model('Plan', planSchema);

export default Plan;
