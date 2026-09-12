const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');

// Helper function to calculate date ranges
const getDateRange = (period) => {
  const now = new Date();
  const ranges = {
    week: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
    month: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
    quarter: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000),
    year: new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
  };
  return ranges[period] || ranges.month;
};

// Helper function to calculate spending patterns
const analyzeSpendingPatterns = (transactions) => {
  const patterns = {
    dailyAverage: 0,
    weeklyTrend: [],
    categoryDistribution: {},
    unusualSpending: []
  };

  const expenses = transactions.filter(t => t.type === 'expense');
  const totalSpent = expenses.reduce((sum, t) => sum + Math.abs(t.amount), 0);
  
  // Daily average
  patterns.dailyAverage = totalSpent / 30;

  // Category distribution
  expenses.forEach(transaction => {
    const category = transaction.category;
    const amount = Math.abs(transaction.amount);
    
    if (!patterns.categoryDistribution[category]) {
      patterns.categoryDistribution[category] = { total: 0, count: 0, average: 0 };
    }
    
    patterns.categoryDistribution[category].total += amount;
    patterns.categoryDistribution[category].count += 1;
    patterns.categoryDistribution[category].average = 
      patterns.categoryDistribution[category].total / patterns.categoryDistribution[category].count;
  });

  // Unusual spending detection (transactions > 2x category average)
  expenses.forEach(transaction => {
    const category = transaction.category;
    const amount = Math.abs(transaction.amount);
    const categoryAvg = patterns.categoryDistribution[category]?.average || 0;
    
    if (amount > categoryAvg * 2 && categoryAvg > 0) {
      patterns.unusualSpending.push({
        transaction,
        deviation: ((amount - categoryAvg) / categoryAvg * 100).toFixed(1)
      });
    }
  });

  return patterns;
};

// Helper function to generate budget recommendations
const generateBudgetRecommendations = (transactions, budgets) => {
  const recommendations = [];
  const expenses = transactions.filter(t => t.type === 'expense');
  
  // Category spending analysis
  const categorySpending = {};
  expenses.forEach(transaction => {
    const category = transaction.category;
    const amount = Math.abs(transaction.amount);
    
    if (!categorySpending[category]) {
      categorySpending[category] = 0;
    }
    categorySpending[category] += amount;
  });

  // Compare with budgets and generate recommendations
  Object.entries(categorySpending).forEach(([category, spent]) => {
    const budget = budgets.find(b => b.category === category);
    
    if (budget) {
      const percentage = (spent / budget.budgetedAmount) * 100;
      
      if (percentage > 120) {
        recommendations.push({
          type: 'increase_budget',
          category,
          message: `Consider increasing your ${category} budget by ${((spent - budget.budgetedAmount) * 1.1).toFixed(0)}`,
          priority: 'high',
          currentBudget: budget.budgetedAmount,
          suggestedBudget: spent * 1.1
        });
      } else if (percentage < 60) {
        recommendations.push({
          type: 'decrease_budget',
          category,
          message: `You could reduce your ${category} budget by ${(budget.budgetedAmount - spent * 1.2).toFixed(0)}`,
          priority: 'low',
          currentBudget: budget.budgetedAmount,
          suggestedBudget: spent * 1.2
        });
      }
    } else if (spent > 100) {
      // Suggest creating a budget for categories without one
      recommendations.push({
        type: 'create_budget',
        category,
        message: `Create a budget for ${category} - you've spent ${spent.toFixed(0)} this month`,
        priority: 'medium',
        suggestedBudget: spent * 1.2
      });
    }
  });

  return recommendations;
};

// Helper function to calculate financial health score
const calculateFinancialHealth = (transactions, budgets) => {
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  
  const expenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;
  
  // Budget adherence score
  let budgetScore = 100;
  let budgetsOverLimit = 0;
  
  budgets.forEach(budget => {
    const percentage = (budget.spentAmount / budget.budgetedAmount) * 100;
    if (percentage > 100) {
      budgetsOverLimit++;
      budgetScore -= (percentage - 100) / 2;
    }
  });

  budgetScore = Math.max(0, budgetScore);

  // Overall financial health score (0-100)
  let healthScore = 0;
  
  // Savings rate component (40% weight)
  if (savingsRate >= 20) healthScore += 40;
  else if (savingsRate >= 10) healthScore += 30;
  else if (savingsRate >= 0) healthScore += 20;
  else healthScore += 0;

  // Budget adherence component (35% weight)
  healthScore += (budgetScore / 100) * 35;

  // Income stability component (25% weight)
  const incomeTransactions = transactions.filter(t => t.type === 'income');
  if (incomeTransactions.length >= 1) healthScore += 25;

  return {
    score: Math.round(healthScore),
    savingsRate: savingsRate.toFixed(1),
    budgetAdherence: budgetScore.toFixed(1),
    budgetsOverLimit,
    recommendation: healthScore >= 80 ? 'Excellent' : 
                   healthScore >= 60 ? 'Good' : 
                   healthScore >= 40 ? 'Fair' : 'Needs Improvement'
  };
};

// Helper function to predict future spending
const predictFutureSpending = (transactions) => {
  const expenses = transactions.filter(t => t.type === 'expense');
  const monthlySpending = expenses.reduce((sum, t) => sum + Math.abs(t.amount), 0);
  
  // Simple prediction based on current month's spending
  const predictions = {
    nextMonth: monthlySpending * 1.05, // 5% increase assumption
    nextQuarter: monthlySpending * 3 * 1.03, // 3% quarterly increase
    nextYear: monthlySpending * 12 * 1.02 // 2% annual increase
  };

  return predictions;
};

// GET /api/ai-insights/overview
exports.getInsightsOverview = async (req, res) => {
  try {
    const userId = req.userId;
    const monthStart = getDateRange('month');
    
    // Get recent transactions and budgets
    const [transactions, budgets] = await Promise.all([
      Transaction.find({ 
        userId, 
        date: { $gte: monthStart } 
      }).sort({ date: -1 }),
      Budget.find({ userId, isActive: true })
    ]);

    // Analyze spending patterns
    const spendingPatterns = analyzeSpendingPatterns(transactions);
    
    // Generate budget recommendations
    const budgetRecommendations = generateBudgetRecommendations(transactions, budgets);
    
    // Calculate financial health
    const financialHealth = calculateFinancialHealth(transactions, budgets);
    
    // Predict future spending
    const predictions = predictFutureSpending(transactions);

    // Generate insights array
    const insights = [];

    // Spending pattern insights
    if (spendingPatterns.unusualSpending.length > 0) {
      insights.push({
        id: 'unusual-spending',
        type: 'warning',
        title: 'Unusual Spending Detected',
        description: `You have ${spendingPatterns.unusualSpending.length} transactions that are significantly higher than your usual spending in those categories.`,
        icon: 'AlertTriangle',
        priority: 'high',
        actionText: 'Review Transactions',
        data: spendingPatterns.unusualSpending
      });
    }

    // Budget recommendations
    if (budgetRecommendations.length > 0) {
      const highPriorityRecs = budgetRecommendations.filter(r => r.priority === 'high');
      if (highPriorityRecs.length > 0) {
        insights.push({
          id: 'budget-recommendations',
          type: 'recommendation',
          title: 'Budget Adjustments Needed',
          description: `${highPriorityRecs.length} of your budgets need adjustment based on your spending patterns.`,
          icon: 'Target',
          priority: 'high',
          actionText: 'Adjust Budgets',
          data: budgetRecommendations
        });
      }
    }

    // Financial health insight
    insights.push({
      id: 'financial-health',
      type: financialHealth.score >= 70 ? 'success' : financialHealth.score >= 40 ? 'warning' : 'error',
      title: `Financial Health: ${financialHealth.recommendation}`,
      description: `Your financial health score is ${financialHealth.score}/100. Savings rate: ${financialHealth.savingsRate}%`,
      icon: 'TrendingUp',
      priority: 'medium',
      actionText: 'View Details',
      data: financialHealth
    });

    // Savings opportunity
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
    if (totalExpenses > 0) {
      const topCategory = Object.entries(spendingPatterns.categoryDistribution)
        .sort(([,a], [,b]) => b.total - a.total)[0];
      
      if (topCategory) {
        const [categoryName, categoryData] = topCategory;
        const potentialSavings = categoryData.total * 0.1; // 10% reduction
        
        insights.push({
          id: 'savings-opportunity',
          type: 'recommendation',
          title: 'Savings Opportunity',
          description: `You could save $${potentialSavings.toFixed(0)} by reducing ${categoryName} spending by 10%.`,
          icon: 'PiggyBank',
          priority: 'medium',
          actionText: 'Learn More',
          data: { category: categoryName, currentSpending: categoryData.total, potentialSavings }
        });
      }
    }

    // Future spending prediction
    insights.push({
      id: 'spending-prediction',
      type: 'info',
      title: 'Spending Forecast',
      description: `Based on current trends, you're projected to spend $${predictions.nextMonth.toFixed(0)} next month.`,
      icon: 'TrendingUp',
      priority: 'low',
      actionText: 'View Forecast',
      data: predictions
    });

    res.json({
      insights,
      summary: {
        totalInsights: insights.length,
        highPriority: insights.filter(i => i.priority === 'high').length,
        financialHealthScore: financialHealth.score,
        monthlySpending: totalExpenses,
        savingsRate: financialHealth.savingsRate
      },
      spendingPatterns,
      budgetRecommendations,
      financialHealth,
      predictions
    });

  } catch (error) {
    console.error('Error generating AI insights:', error);
    res.status(500).json({ error: error.message });
  }
};

// GET /api/ai-insights/spending-analysis
exports.getSpendingAnalysis = async (req, res) => {
  try {
    const userId = req.userId;
    const { period = 'month' } = req.query;
    const startDate = getDateRange(period);
    
    const transactions = await Transaction.find({ 
      userId, 
      date: { $gte: startDate },
      type: 'expense'
    }).sort({ date: -1 });

    const analysis = analyzeSpendingPatterns(transactions);
    
    res.json({
      period,
      analysis,
      totalTransactions: transactions.length,
      totalSpent: transactions.reduce((sum, t) => sum + Math.abs(t.amount), 0)
    });

  } catch (error) {
    console.error('Error analyzing spending:', error);
    res.status(500).json({ error: error.message });
  }
};

// GET /api/ai-insights/budget-recommendations
exports.getBudgetRecommendations = async (req, res) => {
  try {
    const userId = req.userId;
    const monthStart = getDateRange('month');
    
    const [transactions, budgets] = await Promise.all([
      Transaction.find({ 
        userId, 
        date: { $gte: monthStart } 
      }),
      Budget.find({ userId, isActive: true })
    ]);

    const recommendations = generateBudgetRecommendations(transactions, budgets);
    
    res.json({
      recommendations,
      totalRecommendations: recommendations.length,
      highPriority: recommendations.filter(r => r.priority === 'high').length
    });

  } catch (error) {
    console.error('Error generating budget recommendations:', error);
    res.status(500).json({ error: error.message });
  }
};

// GET /api/ai-insights/financial-health
exports.getFinancialHealth = async (req, res) => {
  try {
    const userId = req.userId;
    const monthStart = getDateRange('month');
    
    const [transactions, budgets] = await Promise.all([
      Transaction.find({ 
        userId, 
        date: { $gte: monthStart } 
      }),
      Budget.find({ userId, isActive: true })
    ]);

    const healthData = calculateFinancialHealth(transactions, budgets);
    
    res.json(healthData);

  } catch (error) {
    console.error('Error calculating financial health:', error);
    res.status(500).json({ error: error.message });
  }
};

// GET /api/ai-insights/predictions
exports.getPredictions = async (req, res) => {
  try {
    const userId = req.userId;
    const monthStart = getDateRange('month');
    
    const transactions = await Transaction.find({ 
      userId, 
      date: { $gte: monthStart } 
    });

    const predictions = predictFutureSpending(transactions);
    
    // Add more detailed predictions
    const detailedPredictions = {
      ...predictions,
      categoryPredictions: {},
      confidenceLevel: 'medium' // Could be calculated based on data consistency
    };

    // Category-wise predictions
    const expenses = transactions.filter(t => t.type === 'expense');
    const categorySpending = {};
    
    expenses.forEach(transaction => {
      const category = transaction.category;
      const amount = Math.abs(transaction.amount);
      
      if (!categorySpending[category]) {
        categorySpending[category] = 0;
      }
      categorySpending[category] += amount;
    });

    Object.entries(categorySpending).forEach(([category, amount]) => {
      detailedPredictions.categoryPredictions[category] = {
        nextMonth: amount * 1.05,
        trend: 'stable' // Could be calculated based on historical data
      };
    });
    
    res.json(detailedPredictions);

  } catch (error) {
    console.error('Error generating predictions:', error);
    res.status(500).json({ error: error.message });
  }
};