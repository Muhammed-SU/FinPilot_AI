import api from "./api";

export interface AIInsight {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info' | 'recommendation';
  title: string;
  description: string;
  icon: string;
  priority: 'low' | 'medium' | 'high';
  actionText?: string;
  data?: any;
}

export interface SpendingPattern {
  dailyAverage: number;
  weeklyTrend: any[];
  categoryDistribution: Record<string, {
    total: number;
    count: number;
    average: number;
  }>;
  unusualSpending: Array<{
    transaction: any;
    deviation: string;
  }>;
}

export interface BudgetRecommendation {
  type: 'increase_budget' | 'decrease_budget' | 'create_budget';
  category: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  currentBudget?: number;
  suggestedBudget: number;
}

export interface FinancialHealth {
  score: number;
  savingsRate: string;
  budgetAdherence: string;
  budgetsOverLimit: number;
  recommendation: string;
}

export interface SpendingPredictions {
  nextMonth: number;
  nextQuarter: number;
  nextYear: number;
  categoryPredictions?: Record<string, {
    nextMonth: number;
    trend: string;
  }>;
  confidenceLevel?: string;
}

export interface AIInsightsOverview {
  insights: AIInsight[];
  summary: {
    totalInsights: number;
    highPriority: number;
    financialHealthScore: number;
    monthlySpending: number;
    savingsRate: string;
  };
  spendingPatterns: SpendingPattern;
  budgetRecommendations: BudgetRecommendation[];
  financialHealth: FinancialHealth;
  predictions: SpendingPredictions;
}

// Get AI insights overview
export const getAIInsightsOverview = async (): Promise<AIInsightsOverview> => {
  try {
    const res = await api.get<AIInsightsOverview>("/ai-insights/overview");
    return res.data;
  } catch (error) {
    console.error('Error fetching AI insights overview:', error);
    throw error;
  }
};

// Get spending analysis
export const getSpendingAnalysis = async (period: string = 'month'): Promise<{
  period: string;
  analysis: SpendingPattern;
  totalTransactions: number;
  totalSpent: number;
}> => {
  try {
    const res = await api.get(`/ai-insights/spending-analysis?period=${period}`);
    return res.data;
  } catch (error) {
    console.error('Error fetching spending analysis:', error);
    throw error;
  }
};

// Get budget recommendations
export const getBudgetRecommendations = async (): Promise<{
  recommendations: BudgetRecommendation[];
  totalRecommendations: number;
  highPriority: number;
}> => {
  try {
    const res = await api.get("/ai-insights/budget-recommendations");
    return res.data;
  } catch (error) {
    console.error('Error fetching budget recommendations:', error);
    throw error;
  }
};

// Get financial health score
export const getFinancialHealth = async (): Promise<FinancialHealth> => {
  try {
    const res = await api.get<FinancialHealth>("/ai-insights/financial-health");
    return res.data;
  } catch (error) {
    console.error('Error fetching financial health:', error);
    throw error;
  }
};

// Get spending predictions
export const getSpendingPredictions = async (): Promise<SpendingPredictions> => {
  try {
    const res = await api.get<SpendingPredictions>("/ai-insights/predictions");
    return res.data;
  } catch (error) {
    console.error('Error fetching spending predictions:', error);
    throw error;
  }
};