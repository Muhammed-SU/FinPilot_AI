const express = require("express");
const auth = require("../middlewares/authMiddleware");

const {
  getAllBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
  getAnalytics,
  refreshBudgets,
} = require("../controllers/budgetController");

const {
  getAllGoals,
  createGoal,
  updateGoal,
  deleteGoal,
  updateProgress
} = require('../controllers/budgetGoalController');

const router = express.Router();

router.use(auth);

// Budget routes
router.get("/", getAllBudgets);
router.post("/", createBudget);
router.put("/:id", updateBudget);
router.delete("/:id", deleteBudget);
router.get("/analytics", getAnalytics);
router.post("/refresh", refreshBudgets); // Add refresh endpoint

// Goal routes
router.get('/goals', getAllGoals);
router.post('/goals', createGoal);
router.put('/goals/:id', updateGoal);
router.delete('/goals/:id', deleteGoal);
router.put('/goals/:id/progress', updateProgress);

module.exports = router;