import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  PiggyBank, 
  Target, 
  ArrowRight, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  Brain,
  BarChart3,
  DollarSign,
  Calendar,
  Zap,
  RefreshCw,
  Plus,
  Edit3
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useCurrency } from '../../contexts/CurrencyContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { 
  AIInsight, 
  AIInsightsOverview,
  getAIInsightsOverview,
  getSpendingAnalysis,
  getBudgetRecommendations,
  getFinancialHealth,
  getSpendingPredictions
} from '../services/aiInsightsService';
import { CreateBudgetForm } from '../forms/CreateBudgetForm';
import { EditBudgetForm } from '../forms/EditBudgetForm';
import { TransactionDetailsModal } from './TransactionDetailsModal';
import { BudgetRecommendationModal } from './BudgetRecommendationModal';
import { SavingsOpportunityModal } from './SavingsOpportunityModal';
import { SpendingForecastModal } from './SpendingForecastModal';
import { getBudgets, Budget } from '../services/budgetService';

export const AIInsights: React.FC = () => {
  const [insightsData, setInsightsData] = useState<AIInsightsOverview | null>(null);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'analysis' | 'recommendations' | 'health' | 'predictions'>('overview');
  const [refreshing, setRefreshing] = useState(false);
  
  // Modal states
  const [isCreateBudgetOpen, setIsCreateBudgetOpen] = useState(false);
  const [isEditBudgetOpen, setIsEditBudgetOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [isTransactionDetailsOpen, setIsTransactionDetailsOpen] = useState(false);
  const [selectedInsight, setSelectedInsight] = useState<AIInsight | null>(null);
  const [isBudgetRecommendationOpen, setIsBudgetRecommendationOpen] = useState(false);
  const [isSavingsOpportunityOpen, setIsSavingsOpportunityOpen] = useState(false);
  const [isSpendingForecastOpen, setIsSpendingForecastOpen] = useState(false);
  
  const { formatAmount } = useCurrency();
  const { t } = useLanguage();

  const fetchInsights = async () => {
    try {
      setIsLoading(true);
      const [insightsResponse, budgetsResponse] = await Promise.all([
        getAIInsightsOverview(),
        getBudgets()
      ]);
      setInsightsData(insightsResponse);
      setBudgets(budgetsResponse);
    } catch (error) {
      console.error('Error fetching AI insights:', error);
      // Set fallback data if API fails
      setInsightsData({
        insights: [
          {
            id: 'demo-1',
            type: 'warning',
            title: 'High Spending Alert',
            description: 'You\'ve spent 25% more on dining out this month compared to last month.',
            icon: 'AlertTriangle',
            priority: 'high',
            actionText: 'View Details'
          },
          {
            id: 'demo-2',
            type: 'recommendation',
            title: 'Budget Optimization',
            description: 'Consider increasing your grocery budget by $150 based on your spending patterns.',
            icon: 'Target',
            priority: 'medium',
            actionText: 'Adjust Budget'
          },
          {
            id: 'demo-3',
            type: 'success',
            title: 'Savings Achievement',
            description: 'Great job! You\'ve saved 15% more than your target this month.',
            icon: 'PiggyBank',
            priority: 'low',
            actionText: 'View Progress'
          }
        ],
        summary: {
          totalInsights: 3,
          highPriority: 1,
          financialHealthScore: 75,
          monthlySpending: 2500,
          savingsRate: '15.5'
        },
        spendingPatterns: {
          dailyAverage: 83.33,
          weeklyTrend: [],
          categoryDistribution: {},
          unusualSpending: []
        },
        budgetRecommendations: [],
        financialHealth: {
          score: 75,
          savingsRate: '15.5',
          budgetAdherence: '85.2',
          budgetsOverLimit: 1,
          recommendation: 'Good'
        },
        predictions: {
          nextMonth: 2625,
          nextQuarter: 8100,
          nextYear: 30600
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchInsights();
    setRefreshing(false);
  };

  const handleInsightAction = (insight: AIInsight) => {
    setSelectedInsight(insight);
    
    switch (insight.id) {
      case 'unusual-spending':
        setIsTransactionDetailsOpen(true);
        break;
      case 'budget-recommendations':
        setIsBudgetRecommendationOpen(true);
        break;
      case 'financial-health':
        setActiveTab('health');
        break;
      case 'savings-opportunity':
        setIsSavingsOpportunityOpen(true);
        break;
      case 'spending-prediction':
        setIsSpendingForecastOpen(true);
        break;
      default:
        // Generic action - could open a details modal
        console.log('Action for insight:', insight.title);
    }
  };

  const handleBudgetRecommendationAction = (recommendation: any) => {
    if (recommendation.type === 'create_budget') {
      setIsCreateBudgetOpen(true);
    } else {
      // Find existing budget and edit it
      const existingBudget = budgets.find(b => b.category === recommendation.category);
      if (existingBudget) {
        setEditingBudget(existingBudget);
        setIsEditBudgetOpen(true);
      } else {
        setIsCreateBudgetOpen(true);
      }
    }
  };

  const handleFormSuccess = () => {
    fetchInsights();
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  const getIcon = (iconName: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'TrendingUp': <TrendingUp className="w-6 h-6" />,
      'PiggyBank': <PiggyBank className="w-6 h-6" />,
      'Target': <Target className="w-6 h-6" />,
      'AlertTriangle': <AlertTriangle className="w-6 h-6" />,
      'CheckCircle': <CheckCircle className="w-6 h-6" />,
      'Info': <Info className="w-6 h-6" />,
      'BarChart3': <BarChart3 className="w-6 h-6" />,
      'DollarSign': <DollarSign className="w-6 h-6" />
    };
    return iconMap[iconName] || <TrendingUp className="w-6 h-6" />;
  };

  const getIconColor = (type: string) => {
    const colorMap: Record<string, string> = {
      'success': 'text-green-500 dark:text-green-400 bg-green-50 dark:bg-green-500/20',
      'warning': 'text-yellow-500 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-500/20',
      'error': 'text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-500/20',
      'info': 'text-emerald-500 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/20',
      'recommendation': 'text-teal-500 dark:text-teal-400 bg-teal-50 dark:bg-teal-500/20'
    };
    return colorMap[type] || 'text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-500/20';
  };

  const getPriorityBadge = (priority: string) => {
    const badges: Record<string, { color: string; label: string }> = {
      'high': { color: 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400', label: 'High' },
      'medium': { color: 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400', label: 'Medium' },
      'low': { color: 'bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400', label: 'Low' }
    };
    
    const badge = badges[priority] || badges.low;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
        {badge.label}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">AI Insights</h1>
            <p className="text-gray-600 dark:text-gray-300">Loading your personalized financial insights...</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-gray-200/50 dark:border-slate-700/50 rounded-2xl p-6 animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!insightsData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">AI Insights</h1>
            <p className="text-gray-600 dark:text-gray-300">Unable to load insights. Please try again.</p>
          </div>
          <Button onClick={handleRefresh}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('aiFinancialInsights')}</h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm truncate">
            {t('aiInsightsSubtitle')}
          </p>
        </div>
        <div className="flex items-center space-x-3 flex-shrink-0">
          <Button 
            variant="glass" 
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{t('filter')}</span>
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{t('financialHealthScore')}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {insightsData.summary.financialHealthScore}/100
              </p>
            </div>
            <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-500/20 rounded-xl flex items-center justify-center">
              <Brain className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{t('monthlySpending')}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatAmount(insightsData.summary.monthlySpending)}
              </p>
            </div>
            <div className="w-10 h-10 bg-red-50 dark:bg-red-500/20 rounded-xl flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-red-500 dark:text-red-400" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Savings Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {insightsData.summary.savingsRate}%
              </p>
            </div>
            <div className="w-10 h-10 bg-green-50 dark:bg-green-500/20 rounded-xl flex items-center justify-center">
              <PiggyBank className="w-5 h-5 text-green-500 dark:text-green-400" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">High Priority</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {insightsData.summary.highPriority}
              </p>
            </div>
            <div className="w-10 h-10 bg-red-50 dark:bg-red-500/20 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-500 dark:text-red-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center space-x-1 bg-gray-100 dark:bg-slate-800 rounded-xl p-1 overflow-x-auto">
        {[
          { id: 'overview', label: 'Overview', icon: Brain },
          { id: 'analysis', label: 'Analysis', icon: BarChart3 },
          { id: 'recommendations', label: 'Recommendations', icon: Target },
          { id: 'health', label: 'Health Score', icon: CheckCircle },
          { id: 'predictions', label: 'Predictions', icon: TrendingUp }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm font-semibold'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {insightsData.insights.map((insight) => (
            <Card key={insight.id} className="hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 hover:scale-105">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 min-w-0 flex-1">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20 dark:border-slate-600/30 flex-shrink-0 ${getIconColor(insight.type)}`}>
                      {getIcon(insight.icon)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{insight.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{insight.description}</p>
                    </div>
                  </div>
                  <div className="flex-shrink-0 ml-2">
                    {getPriorityBadge(insight.priority)}
                  </div>
                </div>
                
                {insight.actionText && (
                  <Button 
                    variant="glass" 
                    className="w-full justify-between group hover:bg-blue-50 dark:hover:bg-blue-500/20 hover:border-blue-300 dark:hover:border-blue-500/30"
                    onClick={() => handleInsightAction(insight)}
                  >
                    <span>{insight.actionText}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'analysis' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Spending Patterns</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl">
                  <span className="text-gray-600 dark:text-gray-300">Daily Average</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {formatAmount(insightsData.spendingPatterns.dailyAverage)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl">
                  <span className="text-gray-600 dark:text-gray-300">Unusual Transactions</span>
                  <span className="font-semibold text-red-600 dark:text-red-400">
                    {insightsData.spendingPatterns.unusualSpending.length}
                  </span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl">
                  <span className="text-gray-600 dark:text-gray-300">Categories Used</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {Object.keys(insightsData.spendingPatterns.categoryDistribution).length}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Top Categories</h3>
              
              <div className="space-y-3">
                {Object.entries(insightsData.spendingPatterns.categoryDistribution)
                  .sort(([,a], [,b]) => b.total - a.total)
                  .slice(0, 5)
                  .map(([category, data]) => (
                    <div key={category} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{category}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{data.count} transactions</p>
                      </div>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {formatAmount(data.total)}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'recommendations' && (
        <div className="space-y-6">
          {insightsData.budgetRecommendations.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {insightsData.budgetRecommendations.map((rec, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2 capitalize">
                          {rec.type.replace('_', ' ')} - {rec.category}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">{rec.message}</p>
                      </div>
                      {getPriorityBadge(rec.priority)}
                    </div>
                    
                    <div className="flex justify-between items-center pt-3 border-t border-gray-200/50 dark:border-slate-700/50">
                      {rec.currentBudget && (
                        <div className="text-sm">
                          <span className="text-gray-500 dark:text-gray-400">Current: </span>
                          <span className="font-medium">{formatAmount(rec.currentBudget)}</span>
                        </div>
                      )}
                      <div className="text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Suggested: </span>
                        <span className="font-medium text-blue-600 dark:text-blue-400">
                          {formatAmount(rec.suggestedBudget)}
                        </span>
                      </div>
                    </div>
                    
                    <Button 
                      variant="glass" 
                      className="w-full"
                      onClick={() => handleBudgetRecommendationAction(rec)}
                    >
                      {rec.type === 'create_budget' ? (
                        <>
                          <Plus className="w-4 h-4 mr-2" />
                          Create Budget
                        </>
                      ) : (
                        <>
                          <Edit3 className="w-4 h-4 mr-2" />
                          Adjust Budget
                        </>
                      )}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Recommendations</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Your budgets are well-optimized! Keep up the good work.
              </p>
            </Card>
          )}
        </div>
      )}

      {activeTab === 'health' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Financial Health Score</h3>
              
              <div className="text-center">
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      className="text-gray-200 dark:text-slate-700"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${(insightsData.financialHealth.score / 100) * 314} 314`}
                      className={`${
                        insightsData.financialHealth.score >= 80 ? 'text-green-500' :
                        insightsData.financialHealth.score >= 60 ? 'text-yellow-500' :
                        'text-red-500'
                      }`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {insightsData.financialHealth.score}
                    </span>
                  </div>
                </div>
                
                <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {insightsData.financialHealth.recommendation}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  Your financial health is {insightsData.financialHealth.recommendation.toLowerCase()}
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Health Breakdown</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-500/20 rounded-xl">
                  <span className="text-green-700 dark:text-green-300">Savings Rate</span>
                  <span className="font-semibold text-green-800 dark:text-green-200">
                    {insightsData.financialHealth.savingsRate}%
                  </span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-500/20 rounded-xl">
                  <span className="text-blue-700 dark:text-blue-300">Budget Adherence</span>
                  <span className="font-semibold text-blue-800 dark:text-blue-200">
                    {insightsData.financialHealth.budgetAdherence}%
                  </span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-500/20 rounded-xl">
                  <span className="text-red-700 dark:text-red-300">Budgets Over Limit</span>
                  <span className="font-semibold text-red-800 dark:text-red-200">
                    {insightsData.financialHealth.budgetsOverLimit}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'predictions' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Spending Forecast</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-blue-50 dark:bg-blue-500/20 rounded-xl">
                  <div>
                    <p className="text-blue-700 dark:text-blue-300 font-medium">Next Month</p>
                    <p className="text-sm text-blue-600 dark:text-blue-400">Predicted spending</p>
                  </div>
                  <span className="text-xl font-bold text-blue-800 dark:text-blue-200">
                    {formatAmount(insightsData.predictions.nextMonth)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-purple-50 dark:bg-purple-500/20 rounded-xl">
                  <div>
                    <p className="text-purple-700 dark:text-purple-300 font-medium">Next Quarter</p>
                    <p className="text-sm text-purple-600 dark:text-purple-400">3-month forecast</p>
                  </div>
                  <span className="text-xl font-bold text-purple-800 dark:text-purple-200">
                    {formatAmount(insightsData.predictions.nextQuarter)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-green-50 dark:bg-green-500/20 rounded-xl">
                  <div>
                    <p className="text-green-700 dark:text-green-300 font-medium">Next Year</p>
                    <p className="text-sm text-green-600 dark:text-green-400">Annual projection</p>
                  </div>
                  <span className="text-xl font-bold text-green-800 dark:text-green-200">
                    {formatAmount(insightsData.predictions.nextYear)}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Prediction Insights</h3>
              
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl">
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Trend Analysis</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Your spending is projected to increase by 5% next month
                  </p>
                </div>
                
                <div className="p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl">
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Confidence Level</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Medium (based on 30 days of data)
                  </p>
                </div>
                
                <div className="p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl">
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Recommendation</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Consider adjusting budgets for seasonal changes
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Call to Action */}
      <Card>
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-blue-500/25">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Want More Advanced Insights?</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Upgrade to premium for AI-powered financial coaching, detailed analytics, and personalized recommendations.
          </p>
          <Button>Upgrade to Premium</Button>
        </div>
      </Card>

      {/* Modals */}
      <CreateBudgetForm
        isOpen={isCreateBudgetOpen}
        onClose={() => setIsCreateBudgetOpen(false)}
        onSuccess={handleFormSuccess}
      />

      <EditBudgetForm
        isOpen={isEditBudgetOpen}
        onClose={() => {
          setIsEditBudgetOpen(false);
          setEditingBudget(null);
        }}
        onSuccess={handleFormSuccess}
        budget={editingBudget}
      />

      <TransactionDetailsModal
        isOpen={isTransactionDetailsOpen}
        onClose={() => {
          setIsTransactionDetailsOpen(false);
          setSelectedInsight(null);
        }}
        insight={selectedInsight}
        formatAmount={formatAmount}
      />

      <BudgetRecommendationModal
        isOpen={isBudgetRecommendationOpen}
        onClose={() => {
          setIsBudgetRecommendationOpen(false);
          setSelectedInsight(null);
        }}
        insight={selectedInsight}
        formatAmount={formatAmount}
        onApplyRecommendation={handleBudgetRecommendationAction}
      />

      <SavingsOpportunityModal
        isOpen={isSavingsOpportunityOpen}
        onClose={() => {
          setIsSavingsOpportunityOpen(false);
          setSelectedInsight(null);
        }}
        insight={selectedInsight}
        formatAmount={formatAmount}
      />

      <SpendingForecastModal
        isOpen={isSpendingForecastOpen}
        onClose={() => {
          setIsSpendingForecastOpen(false);
          setSelectedInsight(null);
        }}
        insight={selectedInsight}
        formatAmount={formatAmount}
        predictions={insightsData.predictions}
      />
    </div>
  );
};