import express from 'express';
import { getPlans, getPlansOfUser, getSinglePlan, addSinglePlan, updatePlan, deletePlan, checkOrUncheckIngredient } from "../controllers/plans.controller.js";

const router = express.Router();

router.get('/', getPlans);
router.get('/ofUser/:userId', getPlansOfUser);
router.get('/:id', getSinglePlan);
router.post('/add', addSinglePlan);
router.post('/edit/:id', updatePlan);
router.post('/delete/:id', deletePlan);
router.put('/checkOrUncheckIngredient/:planId', checkOrUncheckIngredient);

export default router;
