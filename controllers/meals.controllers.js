/** logic for meal routes */
import Meal from "../models/meal.model.js";
import { deleteAllImagesFromCategoryInternally } from "./images.controllers.js";

export const getMeals = async (req, res) => {
  Meal.find().sort({ title: 1 }).exec((err, meals) => {
    if (err) {
      res.status(404).json({ message: err.message });
    } else {
      res.status(200).json(meals);
    }
  });
}

export const getMealsOfUser = async (req, res) => {
  let userId = req.params.userId;
  Meal.find({ userId: userId }).sort({ title: 1 }).exec((err, meals) => {
    if (err) {
      res.status(404).json({ message: err.message });
    } else {
      res.status(200).json(meals);
    }
  });
}

export const addMeal = async (req, res) => {
  const meal = req.body;
  const newMeal = new Meal(meal);
  try {
    await newMeal.save();
    res.status(201).json({ 'message': 'successfully added new Meal', 'meal': newMeal });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
}

export const getSingleMeal = async (req, res) => {
  let id = req.params.id;
  try {
    const singleMeal = await Meal.findById(id);
    res.status(200).json(singleMeal);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

export const updateMeal = async (req, res) => {
  let newMeal = req.body;
  let id = req.params.id;
  try {
    Meal.findById(id, function (err, meal) {
      meal.set('userId', newMeal.userId);
      meal.set('title', newMeal.title);
      meal.set('recipeLink', newMeal.recipeLink);
      meal.set('images', newMeal.images);
      meal.set('comment', newMeal.comment);
      meal.set('category', newMeal.category);
      meal.set('tags', newMeal.tags);
      meal.set('isPrivate', newMeal.isPrivate);
      meal.set('isToTry', newMeal.isToTry);
      meal.save().then(meal => {
        res.status(201).json({ 'info': 'meal updated', meal })
      });
    });
  } catch (error) {
    res.status(400).json({ 'info': `Update of meal ${id} failed`, 'message': error.message });
  }
}

export const setImageAsMain = async (req, res) => {
  const { mealId, imageId } = req.params;
  try {
    Meal.findById(mealId, function (err, meal) {
      const newOrderImages = [];
      const revisedImages = meal.images.map(i => {
        i.isMain = i._id === imageId;
        if (i._id === imageId) newOrderImages.push(i);
        return i;
      });
      revisedImages.forEach(i => {
        if (i._id !== imageId) newOrderImages.push(i);
      })
      meal.set('images', newOrderImages);
      meal.save().then(meal => {
        res.status(201).json({ 'info': 'updated main image of meal ', meal })
      });
    });
  } catch (error) {
    res.status(400).json({ 'info': `Setting Image ${imageId} as main for meal ${mealId} failed`, 'message': error.message });
  }
}

export const deleteMeal = async (req, res) => {
  let id = req.params.id;
  Meal.findByIdAndDelete(id, {}, function (err, meal) {
    if (err) {
      res.status(400).json({ 'info': `Deletion of meal ${id} failed`, 'message': err.message });
    } else {
      res.status(201).json({ 'info': 'meal deleted, id: ', id, meal })
    }
  });
}

export const deleteAllMealsOfUser = async (userId) => {
  await Meal.find({ userId: userId }).sort({ title: 1 }).exec(async (err, meals) => {
    if (err) {
      console.log('error on finding meals to delete images for user ' + userId);
    } else {
      await Promise.all(meals.map(async (meal) => {
        await deleteAllImagesFromCategoryInternally('mealImages', meal._id);
      }));
    }
  });
  Meal.deleteMany({ userId: userId }, {}, function (err) {
    if (err) {
      console.log('error on delete meals for user ' + userId, err);
    } else {
      console.log('meals for user ' + userId + ' deleted');
    }
  });
}

export const getNumberOfMealsOfUsers = async (req, res) => {
  Meal.aggregate([
    {
      $group: {
        _id: '$userId',
        numberOfMeals: {
          $count: {}
        }
      }
    }]).exec((err, mealCounts) => {
    if (err) {
      res.status(404).json({ message: err });
    } else {
      res.status(200).json(mealCounts);
    }
  });
}
