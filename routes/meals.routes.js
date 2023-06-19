import express from 'express';
import { addMeal, getSingleMeal, getMealsOfUser, getNumberOfMealsOfUsers, setImageAsMain, getMeals, updateMeal, deleteMeal } from "../controllers/meals.controllers.js";

const router = express.Router();

router.get('/', getMeals);
router.get('/ofUser/:userId', getMealsOfUser);
router.get('/numberOfMeals', getNumberOfMealsOfUsers);
router.get('/:id', getSingleMeal);
router.post('/add', addMeal);
router.post('/edit/:id', updateMeal);
router.post('/delete/:id', deleteMeal);
router.post('/setAsMain/:mealId/:imageId', setImageAsMain);

export default router;
