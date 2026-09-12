const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');

// GET /api/budgets
exports.getAllBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ userId: req.userId });

    const enrichedBudgets = await Promise.all(budgets.map(async budget => {
      // Calculate spent amount from transactions within budget period and category
      const transactions = await Transaction.find({ userId: req.userId, category: budget.category, type: 'expense'});
      const spents = Math.abs(transactions.reduce((total, tx) => total + tx.amount, 0));

      // Update the budget document with the calculated spent amount
      const spentAmount = spents || 0;
      
      // Force update the budget document
      await Budget.findByIdAndUpdate(budget._id, { 
        spentAmount: spentAmount 
      }, { new: true });

      // Return the budget with updated spent amount
      return {
        ...budget.toObject(),
        spentAmount
      };
    }));

    res.json(enrichedBudgets);
  } catch (error) {
    console.error('Error fetching budgets:', error);
    res.status(500).json({ error: error.message });
  }
};

// POST /api/budgets
exports.createBudget = async (req, res) => {
  try {
    const budget = await Budget.create({ ...req.body, userId: req.userId });
    res.status(201).json(budget);
  } catch (error) {
    console.error('Error creating budget:', error);
    res.status(500).json({ error: error.message });
  }
};

// PUT /api/budgets/:id
exports.updateBudget = async (req, res) => {
  try {
    const budget = await Budget.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );
    
    if (!budget) {
      return res.status(404).json({ error: 'Budget not found' });
    }
    
    res.json(budget);
  } catch (error) {
    console.error('Error updating budget:', error);
    res.status(500).json({ error: error.message });
  }
};

// DELETE /api/budgets/:id
exports.deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    
    if (!budget) {
      return res.status(404).json({ error: 'Budget not found' });
    }
    
    res.json({ message: 'Budget deleted successfully' });
  } catch (error) {
    console.error('Error deleting budget:', error);
    res.status(500).json({ error: error.message });
  }
};

// GET /api/budgets/analytics
exports.getAnalytics = async (req, res) => {
  try {
    const budgets = await Budget.find({ userId: req.userId });
    const transactions = await Transaction.find({ userId: req.userId });

    let totalBudgeted = 0;
    let totalSpent = 0;
    let budgetsOverLimit = 0;
    let budgetsNearLimit = 0;
    let categoryBreakdown = {};

    // Calculate spent amounts for each budget
    const enrichedBudgets = await Promise.all(budgets.map(async budget => {
      const spent = await Transaction.aggregate([
        {
          $match: {
            userId: req.userId,
            category: budget.category,
            type: 'expense',
            date: { 
              $gte: new Date(budget.startDate), 
              $lte: new Date(budget.endDate) 
            }
          }
        },
        { 
          $group: { 
            _id: null, 
            total: { $sum: { $abs: "$amount" } }
          } 
        }
      ]);

      const spentAmount = spent[0]?.total || 0;
      
      // Update budget with calculated spent amount
      await Budget.findByIdAndUpdate(budget._id, { spentAmount });
      
      return {
        ...budget.toObject(),
        spentAmount
      };
    }));

    enrichedBudgets.forEach(budget => {
      totalBudgeted += budget.budgetedAmount;
      totalSpent += budget.spentAmount;

      const percentage = budget.budgetedAmount > 0 ? (budget.spentAmount / budget.budgetedAmount) * 100 : 0;

      if (percentage >= 100) budgetsOverLimit++;
      else if (percentage >= budget.alertThreshold) budgetsNearLimit++;

      if (!categoryBreakdown[budget.category]) {
        categoryBreakdown[budget.category] = { budgeted: 0, spent: 0, percentage: 0 };
      }

      categoryBreakdown[budget.category].budgeted += budget.budgetedAmount;
      categoryBreakdown[budget.category].spent += budget.spentAmount;
      
      if (categoryBreakdown[budget.category].budgeted > 0) {
        categoryBreakdown[budget.category].percentage = Math.round(
          (categoryBreakdown[budget.category].spent / categoryBreakdown[budget.category].budgeted) * 100
        );
      }
    });

    // Generate monthly trend data
    const monthlyTrend = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now);
      date.setMonth(date.getMonth() - i);
      
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      
      // Get budgets for this month
      const monthBudgets = await Budget.find({
        userId: req.userId,
        startDate: { $lte: monthEnd },
        endDate: { $gte: monthStart }
      });
      
      const monthBudgeted = monthBudgets.reduce((sum, b) => sum + b.budgetedAmount, 0);
      
      // Get actual spending for this month
      const monthSpending = await Transaction.aggregate([
        {
          $match: {
            userId: req.userId,
            type: 'expense',
            date: { $gte: monthStart, $lte: monthEnd }
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: { $abs: "$amount" } }
          }
        }
      ]);
      
      const monthSpent = monthSpending[0]?.total || 0;
      
      monthlyTrend.push({
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        budgeted: monthBudgeted,
        spent: monthSpent
      });
    }

    res.json({
      totalBudgeted,
      totalSpent,
      budgetsOverLimit,
      budgetsNearLimit,
      categoryBreakdown,
      monthlyTrend
    });
  } catch (error) {
    console.error('Error getting budget analytics:', error);
    res.status(500).json({ error: error.message });
  }
};

// Helper function to recalculate budget spent amounts (can be called after transaction changes)
exports.recalculateBudgetSpending = async (userId) => {
  try {
    const budgets = await Budget.find({ userId });
    
    await Promise.all(budgets.map(async budget => {
      const spent = await Transaction.aggregate([
        {
          $match: {
            userId,
            category: budget.category,
            type: 'expense',
            date: { 
              $gte: new Date(budget.startDate), 
              $lte: new Date(budget.endDate) 
            }
          }
        },
        { 
          $group: { 
            _id: null, 
            total: { $sum: { $abs: "$amount" } }
          } 
        }
      ]);

      const spentAmount = spent[0]?.total || 0;
      
      await Budget.findByIdAndUpdate(budget._id, { spentAmount });
    }));
  } catch (error) {
    console.error('Error recalculating budget spending:', error);
  }
};

// Add a new endpoint to force refresh budget calculations
exports.refreshBudgets = async (req, res) => {
  try {
    await exports.recalculateBudgetSpending(req.userId);
    
    // Return updated budgets
    const budgets = await Budget.find({ userId: req.userId });
    res.json(budgets);
  } catch (error) {
    console.error('Error refreshing budgets:', error);
    res.status(500).json({ error: error.message });
  }
};