import React, { useState, useEffect } from 'react';
import { Plus, Target, AlertTriangle, CheckCircle, TrendingUp, Settings, Calendar, Filter } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { BudgetCard } from './BudgetCard';
import { BudgetGoalCard } from './BudgetGoalCard';
import { BudgetAnalyticsChart } from './BudgetAnalyticsChart';
import { BudgetDetailsModal } from './BudgetDetailsModal';
import { AddProgressModal } from './AddProgressModal';
import { BudgetFilters } from './BudgetFilters';
import { CreateBudgetForm } from '../forms/CreateBudgetForm';
import { CreateBudgetGoalForm } from '../forms/CreateBudgetGoalForm';
import { EditBudgetForm } from '../forms/EditBudgetForm';
import { EditBudgetGoalForm } from '../forms/EditBudgetGoalForm';
import { BudgetAlerts } from './BudgetAlerts';
import { useCurrency } from '../../contexts/CurrencyContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { 
  Budget, 
  BudgetGoal, 
  BudgetAnalytics,
  getBudgets, 
  getBudgetGoals, 
  getBudgetAnalytics,
  deleteBudget,
  deleteBudgetGoal,
  updateBudgetGoal,
  refreshBudgets
} from '../services/budgetService';

export const BudgetOverview: React.FC = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [goals, setGoals] = useState<BudgetGoal[]>([]);
  const [analytics, setAnalytics] = useState<BudgetAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'budgets' | 'goals' | 'analytics'>('budgets');
  
  // Form states
  const [isCreateBudgetOpen, setIsCreateBudgetOpen] = useState(false);
  const [isCreateGoalOpen, setIsCreateGoalOpen] = useState(false);
  const [isEditBudgetOpen, setIsEditBudgetOpen] = useState(false);
  const [isEditGoalOpen, setIsEditGoalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [editingGoal, setEditingGoal] = useState<BudgetGoal | null>(null);
  
  // Modal states
  const [isBudgetDetailsOpen, setIsBudgetDetailsOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const [isAddProgressOpen, setIsAddProgressOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<BudgetGoal | null>(null);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    period: 'all',
    status: 'all',
    category: 'all',
    sortBy: 'name',
    sortDirection: 'asc',
    dateRange: { start: '', end: '' }
  });
  
  const { formatAmount } = useCurrency();
  const { t } = useLanguage();

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // First refresh budgets to ensure latest spending calculations
      console.log('Refreshing budget calculations...');
      await refreshBudgets();
      
      const [budgetsData, goalsData, analyticsData] = await Promise.all([
        getBudgets(),
        getBudgetGoals(),
        getBudgetAnalytics()
      ]);
      
      console.log('Fetched budgets:', budgetsData);
      setBudgets(budgetsData);
      setGoals(goalsData);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error fetching budget data:', error);
      // Set mock data if API fails
      setBudgets([]);
      setGoals([]);
      setAnalytics({
        totalBudgeted: 2000,
        totalSpent: 1200,
        budgetsOverLimit: 1,
        budgetsNearLimit: 2,
        categoryBreakdown: {
          'Food & Dining': { budgeted: 500, spent: 320, percentage: 64 },
          'Transportation': { budgeted: 300, spent: 180, percentage: 60 },
          'Entertainment': { budgeted: 200, spent: 150, percentage: 75 }
        },
        monthlyTrend: [
          { month: 'Aug', budgeted: 1800, spent: 1600 },
          { month: 'Sep', budgeted: 1900, spent: 1700 },
          { month: 'Oct', budgeted: 2000, spent: 1800 },
          { month: 'Nov', budgeted: 2100, spent: 1900 },
          { month: 'Dec', budgeted: 2000, spent: 1500 },
          { month: 'Jan', budgeted: 2000, spent: 1200 }
        ]
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter and sort budgets
  const filteredBudgets = budgets
    .filter(budget => {
      if (filters.period !== 'all' && budget.period !== filters.period) return false;
      if (filters.category !== 'all' && budget.category !== filters.category) return false;
      
      if (filters.status !== 'all') {
        const percentage = (budget.spentAmount / budget.budgetedAmount) * 100;
        if (filters.status === 'over-budget' && percentage < 100) return false;
        if (filters.status === 'warning' && (percentage < budget.alertThreshold || percentage >= 100)) return false;
        if (filters.status === 'on-track' && percentage >= budget.alertThreshold) return false;
      }
      
      if (filters.dateRange.start && new Date(budget.startDate) < new Date(filters.dateRange.start)) return false;
      if (filters.dateRange.end && new Date(budget.endDate) > new Date(filters.dateRange.end)) return false;
      
      return true;
    })
    .sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (filters.sortBy) {
        case 'amount':
          aValue = a.budgetedAmount;
          bValue = b.budgetedAmount;
          break;
        case 'spent':
          aValue = a.spentAmount;
          bValue = b.spentAmount;
          break;
        case 'percentage':
          aValue = (a.spentAmount / a.budgetedAmount) * 100;
          bValue = (b.spentAmount / b.budgetedAmount) * 100;
          break;
        case 'remaining':
          aValue = a.budgetedAmount - a.spentAmount;
          bValue = b.budgetedAmount - b.spentAmount;
          break;
        case 'endDate':
          aValue = new Date(a.endDate).getTime();
          bValue = new Date(b.endDate).getTime();
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }
      
      if (filters.sortDirection === 'desc') {
        return aValue < bValue ? 1 : -1;
      }
      return aValue > bValue ? 1 : -1;
    });

  // Filter and sort goals
  const filteredGoals = goals
    .filter(goal => {
      if (filters.status !== 'all' && goal.status !== filters.status) return false;
      if (filters.category !== 'all' && goal.category !== filters.category) return false;
      return true;
    })
    .sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (filters.sortBy) {
        case 'amount':
          aValue = a.targetAmount;
          bValue = b.targetAmount;
          break;
        case 'percentage':
          aValue = (a.currentAmount / a.targetAmount) * 100;
          bValue = (b.currentAmount / b.targetAmount) * 100;
          break;
        case 'remaining':
          aValue = a.targetAmount - a.currentAmount;
          bValue = b.targetAmount - b.currentAmount;
          break;
        case 'endDate':
          aValue = new Date(a.targetDate).getTime();
          bValue = new Date(b.targetDate).getTime();
          break;
        default:
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
      }
      
      if (filters.sortDirection === 'desc') {
        return aValue < bValue ? 1 : -1;
      }
      return aValue > bValue ? 1 : -1;
    });

  const handleDeleteBudget = async (id: string) => {
    if (confirm('Are you sure you want to delete this budget?')) {
      try {
        await deleteBudget(id);
        fetchData();
      } catch (error) {
        console.error('Error deleting budget:', error);
      }
    }
  };

  const handleDeleteGoal = async (id: string) => {
    if (confirm('Are you sure you want to delete this goal?')) {
      try {
        await deleteBudgetGoal(id);
        fetchData();
      } catch (error) {
        console.error('Error deleting goal:', error);
      }
    }
  };

  const handleEditBudget = (budget: Budget) => {
    setEditingBudget(budget);
    setIsEditBudgetOpen(true);
  };

  const handleEditGoal = (goal: BudgetGoal) => {
    setEditingGoal(goal);
    setIsEditGoalOpen(true);
  };

  const handleViewBudgetDetails = (budget: Budget) => {
    setSelectedBudget(budget);
    setIsBudgetDetailsOpen(true);
  };

  const handleAddProgress = (goal: BudgetGoal) => {
    setSelectedGoal(goal);
    setIsAddProgressOpen(true);
  };

  const handleProgressSubmit = async (amount: number) => {
    if (!selectedGoal) return;
    
    try {
      const goalId = selectedGoal._id || selectedGoal.id;
      if (!goalId) throw new Error('Goal ID not found');
      
      await updateBudgetGoal(goalId, {
        currentAmount: selectedGoal.currentAmount + amount
      });
      
      fetchData();
    } catch (error) {
      console.error('Error adding progress:', error);
      throw error;
    }
  };

  const handleStatusChange = async (goal: BudgetGoal, status: 'active' | 'completed' | 'paused' | 'cancelled') => {
    try {
      const goalId = goal._id || goal.id;
      if (!goalId) throw new Error('Goal ID not found');
      
      await updateBudgetGoal(goalId, { status });
      fetchData();
    } catch (error) {
      console.error('Error updating goal status:', error);
    }
  };

  const categories = Array.from(new Set([
    ...budgets.map(b => b.category),
    ...goals.map(g => g.category)
  ]));

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('budgetManagement')}</h1>
            <p className="text-gray-600 dark:text-gray-300">{t('loading')}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('budgetManagement')}</h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm truncate">
            {t('budgetSubtitle')}
          </p>
        </div>
        <div className="flex items-center space-x-3 flex-shrink-0">
          <Button 
            variant="glass" 
            size="sm"
            onClick={() => setIsCreateGoalOpen(true)}
          >
            <Target className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">{t('budgetGoals')}</span>
          </Button>
          <Button onClick={() => setIsCreateBudgetOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">{t('createBudget')}</span>
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{t('totalBudgeted')}</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {formatAmount(analytics.totalBudgeted)}
                </p>
              </div>
              <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-500/20 rounded-xl flex items-center justify-center">
                <Target className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{t('totalSpent')}</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {formatAmount(analytics.totalSpent)}
                </p>
              </div>
              <div className="w-10 h-10 bg-red-50 dark:bg-red-500/20 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-red-500 dark:text-red-400" />
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{t('overBudget')}</p>
                <p className="text-xl font-bold text-red-600 dark:text-red-400">
                  {analytics.budgetsOverLimit}
                </p>
              </div>
              <div className="w-10 h-10 bg-red-50 dark:bg-red-500/20 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-500 dark:text-red-400" />
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{t('nearLimit')}</p>
                <p className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
                  {analytics.budgetsNearLimit}
                </p>
              </div>
              <div className="w-10 h-10 bg-yellow-50 dark:bg-yellow-500/20 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-yellow-500 dark:text-yellow-400" />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Budget Alerts */}
      <BudgetAlerts budgets={budgets} formatAmount={formatAmount} />

      {/* Tab Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1 bg-gray-100 dark:bg-slate-800 rounded-xl p-1">
          {[
            { id: 'budgets', label: t('budget'), icon: Target },
            { id: 'goals', label: t('budgetGoals'), icon: CheckCircle },
            { id: 'analytics', label: t('aiInsights'), icon: TrendingUp }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
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

        {/* Filters */}
        <div className="flex items-center space-x-2">
          <Button variant="glass" size="sm" onClick={() => setIsFiltersOpen(true)}>
            <Filter className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">{t('filter')}</span>
          </Button>
        </div>
      </div>


      {/* Tab Content */}
      {activeTab === 'budgets' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredBudgets.map((budget) => (
            <BudgetCard
              key={budget._id || budget.id}
              budget={budget}
              onEdit={() => handleEditBudget(budget)}
              onDelete={() => handleDeleteBudget(budget._id || budget.id || '')}
              onViewDetails={() => handleViewBudgetDetails(budget)}
              formatAmount={formatAmount}
            />
          ))}
          
          {filteredBudgets.length === 0 && (
            <div className="col-span-full">
              <Card className="text-center py-12">
                <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No budgets found</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {budgets.length === 0 
                    ? 'Create your first budget to start tracking your spending.'
                    : 'No budgets match your current filters. Try adjusting your filter criteria.'
                  }
                </p>
                <Button onClick={() => setIsCreateBudgetOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Budget
                </Button>
              </Card>
            </div>
          )}
        </div>
      )}

      {activeTab === 'goals' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredGoals.map((goal) => (
            <BudgetGoalCard
              key={goal._id || goal.id}
              goal={goal}
              onEdit={() => handleEditGoal(goal)}
              onDelete={() => handleDeleteGoal(goal._id || goal.id || '')}
              onAddProgress={() => handleAddProgress(goal)}
              onStatusChange={(status) => handleStatusChange(goal, status)}
              formatAmount={formatAmount}
            />
          ))}
          
          {filteredGoals.length === 0 && (
            <div className="col-span-full">
              <Card className="text-center py-12">
                <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No goals found</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {goals.length === 0 
                    ? 'Set your first financial goal to start saving.'
                    : 'No goals match your current filters. Try adjusting your filter criteria.'
                  }
                </p>
                <Button onClick={() => setIsCreateGoalOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Goal
                </Button>
              </Card>
            </div>
          )}
        </div>
      )}

      {activeTab === 'analytics' && analytics && (
        <BudgetAnalyticsChart analytics={analytics} formatAmount={formatAmount} />
      )}

      {/* Modals and Forms */}
      <CreateBudgetForm
        isOpen={isCreateBudgetOpen}
        onClose={() => setIsCreateBudgetOpen(false)}
        onSuccess={fetchData}
      />

      <CreateBudgetGoalForm
        isOpen={isCreateGoalOpen}
        onClose={() => setIsCreateGoalOpen(false)}
        onSuccess={fetchData}
      />

      <EditBudgetForm
        isOpen={isEditBudgetOpen}
        onClose={() => {
          setIsEditBudgetOpen(false);
          setEditingBudget(null);
        }}
        onSuccess={fetchData}
        budget={editingBudget}
      />

      <EditBudgetGoalForm
        isOpen={isEditGoalOpen}
        onClose={() => {
          setIsEditGoalOpen(false);
          setEditingGoal(null);
        }}
        onSuccess={fetchData}
        goal={editingGoal}
      />

      <BudgetDetailsModal
        isOpen={isBudgetDetailsOpen}
        onClose={() => {
          setIsBudgetDetailsOpen(false);
          setSelectedBudget(null);
        }}
        budget={selectedBudget}
        formatAmount={formatAmount}
      />

      <AddProgressModal
        isOpen={isAddProgressOpen}
        onClose={() => {
          setIsAddProgressOpen(false);
          setSelectedGoal(null);
        }}
        goal={selectedGoal}
        onAddProgress={handleProgressSubmit}
        formatAmount={formatAmount}
      />

      <BudgetFilters
        isOpen={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
        filters={filters}
        onFiltersChange={setFilters}
        categories={categories}
      />
    </div>
  );
};