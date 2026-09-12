import React from 'react';
import { AlertTriangle, TrendingUp, CheckCircle, X } from 'lucide-react';
import { Card } from '../ui/Card';
import { Budget } from '../services/budgetService';

interface BudgetAlertsProps {
  budgets: Budget[];
  formatAmount: (amount: number) => string;
}

export const BudgetAlerts: React.FC<BudgetAlertsProps> = ({ budgets, formatAmount }) => {
  const alerts = budgets
    .map(budget => {
      const percentage = (budget.spentAmount / budget.budgetedAmount) * 100;
      
      if (percentage >= 100) {
        return {
          id: budget._id || budget.id,
          type: 'over' as const,
          budget,
          percentage,
          message: `You've exceeded your ${budget.name} budget by ${formatAmount(budget.spentAmount - budget.budgetedAmount)}`
        };
      } else if (percentage >= budget.alertThreshold) {
        return {
          id: budget._id || budget.id,
          type: 'warning' as const,
          budget,
          percentage,
          message: `You've used ${percentage.toFixed(1)}% of your ${budget.name} budget`
        };
      }
      
      return null;
    })
    .filter(Boolean) as Array<{
      id: string;
      type: 'over' | 'warning';
      budget: Budget;
      percentage: number;
      message: string;
    }>;

  if (alerts.length === 0) {
    return (
      <Card className="p-4 bg-green-50 dark:bg-green-500/20 border-green-200 dark:border-green-500/30">
        <div className="flex items-center space-x-3">
          <CheckCircle className="w-5 h-5 text-green-500 dark:text-green-400 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-green-800 dark:text-green-300">All budgets on track!</h3>
            <p className="text-sm text-green-600 dark:text-green-400">
              You're staying within your budget limits. Keep up the good work!
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {alerts.map((alert) => (
        <Card 
          key={alert.id}
          className={`p-4 ${
            alert.type === 'over' 
              ? 'bg-red-50 dark:bg-red-500/20 border-red-200 dark:border-red-500/30' 
              : 'bg-yellow-50 dark:bg-yellow-500/20 border-yellow-200 dark:border-yellow-500/30'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3 min-w-0 flex-1">
              {alert.type === 'over' ? (
                <AlertTriangle className="w-5 h-5 text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5" />
              ) : (
                <TrendingUp className="w-5 h-5 text-yellow-500 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
              )}
              <div className="min-w-0 flex-1">
                <h3 className={`font-medium ${
                  alert.type === 'over' 
                    ? 'text-red-800 dark:text-red-300' 
                    : 'text-yellow-800 dark:text-yellow-300'
                }`}>
                  {alert.type === 'over' ? 'Budget Exceeded' : 'Budget Alert'}
                </h3>
                <p className={`text-sm ${
                  alert.type === 'over' 
                    ? 'text-red-600 dark:text-red-400' 
                    : 'text-yellow-600 dark:text-yellow-400'
                }`}>
                  {alert.message}
                </p>
                <div className="flex items-center space-x-4 mt-2 text-xs">
                  <span className={
                    alert.type === 'over' 
                      ? 'text-red-500 dark:text-red-400' 
                      : 'text-yellow-500 dark:text-yellow-400'
                  }>
                    Spent: {formatAmount(alert.budget.spentAmount)}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">
                    Budget: {formatAmount(alert.budget.budgetedAmount)}
                  </span>
                  <span className={`font-medium ${
                    alert.type === 'over' 
                      ? 'text-red-600 dark:text-red-400' 
                      : 'text-yellow-600 dark:text-yellow-400'
                  }`}>
                    {alert.percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
            <button className="p-1 hover:bg-white/50 dark:hover:bg-slate-800/50 rounded-lg transition-colors flex-shrink-0">
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </Card>
      ))}
    </div>
  );
};