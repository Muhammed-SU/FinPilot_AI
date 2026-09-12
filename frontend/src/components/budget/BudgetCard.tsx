import React from 'react';
import { Edit3, Trash2, AlertTriangle, CheckCircle, TrendingUp, Calendar, Tag, Eye } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Budget } from '../services/budgetService';

interface BudgetCardProps {
  budget: Budget;
  onEdit: () => void;
  onDelete: () => void;
  onViewDetails: () => void;
  formatAmount: (amount: number) => string;
}

export const BudgetCard: React.FC<BudgetCardProps> = ({
  budget,
  onEdit,
  onDelete,
  onViewDetails,
  formatAmount
}) => {
  const percentage = Math.min((budget.spentAmount / budget.budgetedAmount) * 100, 100);
  const remaining = budget.budgetedAmount - budget.spentAmount;
  
  const getStatus = () => {
    if (percentage >= 100) return 'over';
    if (percentage >= budget.alertThreshold) return 'warning';
    return 'good';
  };

  const status = getStatus();

  const getStatusIcon = () => {
    switch (status) {
      case 'over':
        return <AlertTriangle className="w-5 h-5 text-red-500 dark:text-red-400" />;
      case 'warning':
        return <TrendingUp className="w-5 h-5 text-yellow-500 dark:text-yellow-400" />;
      default:
        return <CheckCircle className="w-5 h-5 text-green-500 dark:text-green-400" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'over':
        return 'bg-red-500';
      case 'warning':
        return 'bg-yellow-500';
      default:
        return 'bg-green-500';
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysRemaining = () => {
    const endDate = new Date(budget.endDate);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysRemaining = getDaysRemaining();
  

  return (
    <Card className="hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 hover:scale-105">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <div 
              className="w-4 h-4 rounded-full shadow-lg flex-shrink-0" 
              style={{ backgroundColor: budget.color }}
            />
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                {budget.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                {budget.category}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-1 flex-shrink-0">
            {getStatusIcon()}
            <div className="flex items-center space-x-1">
              <button
                onClick={onEdit}
                className="p-1 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                title="Edit budget"
              >
                <Edit3 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </button>
              <button
                onClick={onDelete}
                className="p-1 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                title="Delete budget"
              >
                <Trash2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Description */}
        {budget.description && (
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
            {budget.description}
          </p>
        )}

        {/* Progress */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            
            <span className="text-gray-600 dark:text-gray-300">Spent</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {formatAmount(budget.spentAmount) }
            </span>
          </div>
          
          <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-3 backdrop-blur-md overflow-hidden relative">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${getStatusColor()}`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
            {percentage > 100 && (
              <div className="absolute inset-0 bg-red-500/20 rounded-full animate-pulse" />
            )}
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-300">Budget</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {formatAmount(budget.budgetedAmount)}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-200/50 dark:border-slate-700/50">
          <div className="text-center">
            <p className="text-xs text-gray-600 dark:text-gray-300">Remaining</p>
            <p className={`text-sm font-semibold ${
              remaining >= 0 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-red-600 dark:text-red-400'
            }`}>
              {formatAmount(Math.abs(remaining))}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-600 dark:text-gray-300">Progress</p>
            <p className={`text-sm font-semibold ${
              status === 'over' ? 'text-red-600 dark:text-red-400' :
              status === 'warning' ? 'text-yellow-600 dark:text-yellow-400' : 
              'text-green-600 dark:text-green-400'
            }`}>
              {percentage.toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Period and Dates */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200/50 dark:border-slate-700/50">
          <div className="flex items-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span className="capitalize">{budget.period}</span>
          </div>
          <span className={`font-medium ${
            daysRemaining < 0 ? 'text-red-500 dark:text-red-400' :
            daysRemaining < 7 ? 'text-yellow-500 dark:text-yellow-400' :
            'text-green-500 dark:text-green-400'
          }`}>
            {daysRemaining < 0 ? `${Math.abs(daysRemaining)} days overdue` :
             daysRemaining === 0 ? 'Ends today' :
             `${daysRemaining} days left`}
          </span>
        </div>

        {/* Tags */}
        {budget.tags && budget.tags.length > 0 && (
          <div className="flex items-center space-x-2 pt-2">
            <Tag className="w-3 h-3 text-gray-400" />
            <div className="flex flex-wrap gap-1">
              {budget.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 dark:bg-slate-800 text-xs text-gray-600 dark:text-gray-300 rounded-md"
                >
                  {tag}
                </span>
              ))}
              {budget.tags.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 dark:bg-slate-800 text-xs text-gray-600 dark:text-gray-300 rounded-md">
                  +{budget.tags.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-2 pt-2">
          <Button variant="glass" size="sm" className="flex-1" onClick={onEdit}>
            <Edit3 className="w-3 h-3 mr-1" />
            Edit
          </Button>
          <Button variant="ghost" size="sm" className="flex-1" onClick={onViewDetails}>
            <Eye className="w-3 h-3 mr-1" />
            Details
          </Button>
        </div>
      </div>
    </Card>
  );
};