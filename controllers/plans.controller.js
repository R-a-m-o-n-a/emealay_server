// logic for plan routes
import Plan from "../models/plan.model.js";

export const getPlans = async (req, res) => {
   Plan.find().sort({ hasDate: -1, date: 1, gotEverything: -1, title: 1 }).exec((err, plans) => {
    if (err) {
      res.status(404).json({ message: err.message });
    } else {
      res.status(200).json(plans);
    }
  });
}
export const getPlansOfUser = async (req, res) => {
  let userId = req.params.userId;
   Plan.find({userId: userId}).sort({ hasDate: -1, date: 1, gotEverything: -1, title: 1 }).exec((err, plans) => {
    if (err) {
      res.status(404).json({ message: err.message });
    } else {
      res.status(200).json(plans);
    }
  });
}

export const getSinglePlan = async (req, res) => {
  let id = req.params.id;
  try {
    const singlePlan = await Plan.findById(id);
    res.status(200).json(singlePlan);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

export const addSinglePlan = async (req, res) => {
  const plan = req.body;
  const newPlan = new Plan(plan);
  try {
    await newPlan.save();
    res.status(201).json({ 'message': 'successfully added new Plan', 'plan': newPlan });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
}

export const updatePlan = async (req, res) => {
  let newPlan = req.body;
  let id = req.params.id;
  try {
    Plan.findById(id, function (err, plan) {
      plan.set('userId', newPlan.userId);
      plan.set('title', newPlan.title);
      plan.set('date', newPlan.date);
      plan.set('hasDate', !!newPlan.date);
      plan.set('gotEverything', newPlan.gotEverything);
      plan.set('missingIngredients', newPlan.missingIngredients);
      plan.set('connectedMealId', newPlan.connectedMealId);
      plan.set('tags', newPlan.tags);
      plan.save().then(plan => {
        res.status(201).json({ 'info': 'plan updated', plan })
      });
    });
  } catch (error) {
    res.status(400).json({ 'info': `Update of plan ${id} failed`, 'message': error.message });
  }
}

export const checkOrUncheckIngredient = async (req, res) => {
  const {planId} = req.params;
  let ingredient = req.body;
  console.log('checking ', ingredient);
  try {
    Plan.findById(planId, function (err, plan) {
      let gotEverything = true;
      const revisedIngredients = plan.missingIngredients;
      revisedIngredients.forEach(i => {
        if (i.name === ingredient.name) {
          console.log('yes, same!');
          i.checked = !i.checked;
        } else {
          console.log('nope');
        }
        if(!i.checked) gotEverything = false;
      });
      console.log(revisedIngredients);
      plan.set('missingIngredients', revisedIngredients);
      plan.set('gotEverything', gotEverything);
      plan.save().then(plan => {
        res.status(201).json({ 'info': 'updated planItem ingredient', plan })
      });
    });
  } catch (error) {
    res.status(400).json({ 'info': `Checking ingredient ${ingredientName} of plan ${planId} failed`, 'message': error.message });
  }
}

export const deletePlan = async (req, res) => {
  let id = req.params.id;
  Plan.findByIdAndDelete(id, {}, function (err, plan) {
    if (err) {
      res.status(400).json({ 'info': `Deletion of plan ${id} failed`, 'message': err.message });
    } else {
      res.status(201).json({ 'info': 'plan deleted, id: ', id, plan })
    }
  });
}

export const deleteAllPlansOfUser = async (userId) => {
  Plan.deleteMany({ userId: userId }, {}, function (err) {
    if (err) {
      console.log('error on delete plans for user ' + userId, err);
    } else {
      console.log('plans for user ' + userId + ' deleted');
    }
  });
}
