import React from 'react';
import { X, Calendar, Target, TrendingUp, AlertTriangle, Tag, DollarSign } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Budget } from '../services/budgetService';

interface BudgetDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  budget: Budget | null;
  formatAmount: (amount: number) => string;
}

export const BudgetDetailsModal: React.FC<BudgetDetailsModalProps> = ({
  isOpen,
  onClose,
  budget,
  formatAmount
}) => {
  if (!isOpen || !budget) return null;

  const percentage = (budget.spentAmount / budget.budgetedAmount) * 100;
  const remaining = budget.budgetedAmount - budget.spentAmount;
  const dailyBudget = budget.budgetedAmount / getDaysInPeriod(budget.period);
  const dailySpent = budget.spentAmount / getDaysElapsed(budget.startDate);
  
  function getDaysInPeriod(period: string): number {
    switch (period) {
      case 'weekly': return 7;
      case 'monthly': return 30;
      case 'quarterly': return 90;
      case 'yearly': return 365;
      default: return 30;
    }
  }

  function getDaysElapsed(startDate: Date | string): number {
    const start = new Date(startDate);
    const today = new Date();
    const diffTime = today.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(diffDays, 1);
  }

  function getDaysRemaining(endDate: Date | string): number {
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  const daysRemaining = getDaysRemaining(budget.endDate);
  const daysElapsed = getDaysElapsed(budget.startDate);
  const totalDays = getDaysInPeriod(budget.period);

  const getStatus = () => {
    if (percentage >= 100) return { label: 'Over Budget', color: 'text-red-600 dark:text-red-400', bgColor: 'bg-red-50 dark:bg-red-500/20' };
    if (percentage >= budget.alertThreshold) return { label: 'Near Limit', color: 'text-yellow-600 dark:text-yellow-400', bgColor: 'bg-yellow-50 dark:bg-yellow-500/20' };
    return { label: 'On Track', color: 'text-green-600 dark:text-green-400', bgColor: 'bg-green-50 dark:bg-green-500/20' };
  };

  const status = getStatus();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 animate-in slide-in-from-bottom-4">
        <Card className="relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors z-10"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>

          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start space-x-4">
              <div 
                className="w-12 h-12 rounded-2xl shadow-lg flex-shrink-0 flex items-center justify-center"
                style={{ backgroundColor: budget.color }}
              >
                <Target className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {budget.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-2">{budget.category}</p>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${status.color} ${status.bgColor}`}>
                  {status.label}
                </div>
              </div>
            </div>

            {/* Description */}
            {budget.description && (
              <div className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">Description</h3>
                <p className="text-gray-600 dark:text-gray-300">{budget.description}</p>
              </div>
            )}

            {/* Progress Overview */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Progress Overview</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">Spent</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatAmount(budget.spentAmount)}
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-4 backdrop-blur-md overflow-hidden">
                  <div
                    className={`h-4 rounded-full transition-all duration-500 ${
                      percentage >= 100 ? 'bg-red-500' :
                      percentage >= budget.alertThreshold ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">Budget</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatAmount(budget.budgetedAmount)}
                  </span>
                </div>
              </div>
            </div>

            {/* Statistics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-500/20 rounded-xl">
                <DollarSign className="w-6 h-6 text-blue-500 dark:text-blue-400 mx-auto mb-2" />
                <p className="text-xs text-blue-600 dark:text-blue-400 mb-1">Remaining</p>
                <p className={`text-lg font-bold ${
                  remaining >= 0 ? 'text-blue-700 dark:text-blue-300' : 'text-red-700 dark:text-red-300'
                }`}>
                  {formatAmount(Math.abs(remaining))}
                </p>
              </div>

              <div className="text-center p-4 bg-green-50 dark:bg-green-500/20 rounded-xl">
                <TrendingUp className="w-6 h-6 text-green-500 dark:text-green-400 mx-auto mb-2" />
                <p className="text-xs text-green-600 dark:text-green-400 mb-1">Progress</p>
                <p className="text-lg font-bold text-green-700 dark:text-green-300">
                  {percentage.toFixed(1)}%
                </p>
              </div>

              <div className="text-center p-4 bg-purple-50 dark:bg-purple-500/20 rounded-xl">
                <Calendar className="w-6 h-6 text-purple-500 dark:text-purple-400 mx-auto mb-2" />
                <p className="text-xs text-purple-600 dark:text-purple-400 mb-1">Days Left</p>
                <p className={`text-lg font-bold ${
                  daysRemaining < 0 ? 'text-red-700 dark:text-red-300' :
                  daysRemaining < 7 ? 'text-yellow-700 dark:text-yellow-300' :
                  'text-purple-700 dark:text-purple-300'
                }`}>
                  {daysRemaining < 0 ? Math.abs(daysRemaining) : daysRemaining}
                </p>
              </div>

              <div className="text-center p-4 bg-orange-50 dark:bg-orange-500/20 rounded-xl">
                <AlertTriangle className="w-6 h-6 text-orange-500 dark:text-orange-400 mx-auto mb-2" />
                <p className="text-xs text-orange-600 dark:text-orange-400 mb-1">Alert at</p>
                <p className="text-lg font-bold text-orange-700 dark:text-orange-300">
                  {budget.alertThreshold}%
                </p>
              </div>
            </div>

            {/* Spending Analysis */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Spending Analysis</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Daily Average</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-300">Budgeted per day</span>
                      <span className="font-medium">{formatAmount(dailyBudget)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-300">Actual per day</span>
                      <span className={`font-medium ${
                        dailySpent > dailyBudget ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
                      }`}>
                        {formatAmount(dailySpent)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Time Progress</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-300">Days elapsed</span>
                      <span className="font-medium">{daysElapsed} / {totalDays}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                      <div
                        className="h-2 bg-blue-500 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min((daysElapsed / totalDays) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Budget Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Budget Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Period</span>
                    <span className="font-medium text-gray-900 dark:text-white capitalize">{budget.period}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Start Date</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {new Date(budget.startDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">End Date</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {new Date(budget.endDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Rollover</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {budget.rollover ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Status</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {budget.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tags */}
            {budget.tags && budget.tags.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {budget.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex space-x-3 pt-4 border-t border-gray-200/50 dark:border-slate-700/50">
              <Button variant="ghost" onClick={onClose} className="flex-1">
                Close
              </Button>
              <Button className="flex-1">
                Edit Budget
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};