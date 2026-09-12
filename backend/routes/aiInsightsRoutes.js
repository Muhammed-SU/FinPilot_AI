const express = require("express");
const auth = require("../middlewares/authMiddleware");
const {
  getInsightsOverview,
  getSpendingAnalysis,
  getBudgetRecommendations,
  getFinancialHealth,
  getPredictions
} = require("../controllers/aiInsightsController");

const router = express.Router();

// Apply authentication middleware to all routes
router.use(auth);

// AI Insights routes
router.get("/overview", getInsightsOverview);
router.get("/spending-analysis", getSpendingAnalysis);
router.get("/budget-recommendations", getBudgetRecommendations);
router.get("/financial-health", getFinancialHealth);
router.get("/predictions", getPredictions);

module.exports = router;