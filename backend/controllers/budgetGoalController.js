const BudgetGoal = require('../models/BudgetGoal');

// GET all goals
exports.getAllGoals = async (req, res) => {
  try {
    const goals = await BudgetGoal.find({ userId: req.userId });
    res.json(goals);
  } catch (error) {
    console.error('Error fetching goals:', error);
    res.status(500).json({ error: error.message });
  }
};

// POST create new goal
exports.createGoal = async (req, res) => {
  try {
    const data = { ...req.body, userId: req.userId };
    const newGoal = await BudgetGoal.create(data);
    res.status(201).json(newGoal);
  } catch (error) {
    console.error('Error creating goal:', error);
    res.status(500).json({ error: error.message });
  }
};

// PUT update goal
exports.updateGoal = async (req, res) => {
  try {
    const updated = await BudgetGoal.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    console.error('Error updating goal:', error);
    res.status(500).json({ error: error.message });
  }
};

// DELETE goal
exports.deleteGoal = async (req, res) => {
  try {
    await BudgetGoal.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    res.json({ message: 'Deleted' });
  } catch (error) {
    console.error('Error deleting goal:', error);
    res.status(500).json({ error: error.message });
  }
};

// PUT update progress
exports.updateProgress = async (req, res) => {
  try {
    const { amount } = req.body;
    const goal = await BudgetGoal.findOne({ _id: req.params.id, userId: req.userId });
    if (!goal) return res.status(404).json({ message: 'Goal not found' });

    goal.currentAmount += amount;
    await goal.save();
    res.json(goal);
  } catch (error) {
    console.error('Error updating progress:', error);
    res.status(500).json({ error: error.message });
  }
};