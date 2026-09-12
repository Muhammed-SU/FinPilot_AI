import React from 'react';
import { Edit3, Trash2, Target, Calendar, Flag, Play, Pause, CheckCircle, Plus } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { BudgetGoal } from '../services/budgetService';

interface BudgetGoalCardProps {
  goal: BudgetGoal;
  onEdit: () => void;
  onDelete: () => void;
  onAddProgress: () => void;
  onStatusChange: (status: 'active' | 'completed' | 'paused' | 'cancelled') => void;
  formatAmount: (amount: number) => string;
}

export const BudgetGoalCard: React.FC<BudgetGoalCardProps> = ({
  goal,
  onEdit,
  onDelete,
  onAddProgress,
  onStatusChange,
  formatAmount
}) => {
  const percentage = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
  const remaining = goal.targetAmount - goal.currentAmount;
  const daysRemaining = Math.ceil((new Date(goal.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  const getPriorityColor = () => {
    switch (goal.priority) {
      case 'critical':
        return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/20';
      case 'high':
        return 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/20';
      case 'medium':
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-500/20';
      default:
        return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/20';
    }
  };

  const getStatusIcon = () => {
    switch (goal.status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400" />;
      case 'paused':
        return <Pause className="w-4 h-4 text-yellow-500 dark:text-yellow-400" />;
      case 'cancelled':
        return <Trash2 className="w-4 h-4 text-red-500 dark:text-red-400" />;
      default:
        return <Play className="w-4 h-4 text-blue-500 dark:text-blue-400" />;
    }
  };

  const getStatusColor = () => {
    switch (goal.status) {
      case 'completed':
        return 'bg-green-500';
      case 'paused':
        return 'bg-yellow-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-blue-500';
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusOptions = () => {
    const allStatuses = [
      { value: 'active', label: 'Active', icon: Play },
      { value: 'completed', label: 'Completed', icon: CheckCircle },
      { value: 'paused', label: 'Paused', icon: Pause },
      { value: 'cancelled', label: 'Cancelled', icon: Trash2 }
    ];
    return allStatuses.filter(status => status.value !== goal.status);
  };

  return (
    <Card className="hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 hover:scale-105">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <div 
              className="w-4 h-4 rounded-full shadow-lg flex-shrink-0" 
              style={{ backgroundColor: goal.color }}
            />
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                {goal.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                {goal.category}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-1 flex-shrink-0">
            {getStatusIcon()}
            <div className="flex items-center space-x-1">
              <button
                onClick={onEdit}
                className="p-1 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                title="Edit goal"
              >
                <Edit3 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </button>
              <button
                onClick={onDelete}
                className="p-1 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                title="Delete goal"
              >
                <Trash2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Priority and Status */}
        <div className="flex items-center justify-between">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor()}`}>
            <Flag className="w-3 h-3 mr-1" />
            {goal.priority.charAt(0).toUpperCase() + goal.priority.slice(1)} Priority
          </span>
          
          {/* Status Dropdown */}
          <div className="relative group">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize cursor-pointer ${
              goal.status === 'completed' ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/20' :
              goal.status === 'paused' ? 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-500/20' :
              goal.status === 'cancelled' ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/20' :
              'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/20'
            }`}>
              {goal.status}
            </span>
            
            {/* Dropdown Menu */}
            <div className="absolute right-0 top-full mt-1 w-32 bg-white dark:bg-slate-800 border border-gray-200/50 dark:border-slate-700/50 rounded-xl shadow-xl backdrop-blur-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
              {getStatusOptions().map((status) => {
                const StatusIcon = status.icon;
                return (
                  <button
                    key={status.value}
                    onClick={() => onStatusChange(status.value as any)}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors text-sm first:rounded-t-xl last:rounded-b-xl"
                  >
                    <StatusIcon className="w-3 h-3" />
                    <span>{status.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Description */}
        {goal.description && (
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
            {goal.description}
          </p>
        )}

        {/* Progress */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-300">Current</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {formatAmount(goal.currentAmount)}
            </span>
          </div>
          
          <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-3 backdrop-blur-md overflow-hidden">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${getStatusColor()}`}
              style={{ width: `${percentage}%` }}
            />
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-300">Target</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {formatAmount(goal.targetAmount)}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-200/50 dark:border-slate-700/50">
          <div className="text-center">
            <p className="text-xs text-gray-600 dark:text-gray-300">Remaining</p>
            <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
              {formatAmount(remaining)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-600 dark:text-gray-300">Progress</p>
            <p className="text-sm font-semibold text-green-600 dark:text-green-400">
              {percentage.toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Timeline */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200/50 dark:border-slate-700/50">
          <div className="flex items-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span>Target: {formatDate(goal.targetDate)}</span>
          </div>
          <span className={`font-medium ${
            daysRemaining < 0 ? 'text-red-500 dark:text-red-400' :
            daysRemaining < 30 ? 'text-yellow-500 dark:text-yellow-400' :
            'text-green-500 dark:text-green-400'
          }`}>
            {daysRemaining < 0 ? `${Math.abs(daysRemaining)} days overdue` :
             daysRemaining === 0 ? 'Due today' :
             `${daysRemaining} days left`}
          </span>
        </div>

        {/* Recurring Badge */}
        {goal.isRecurring && (
          <div className="flex items-center space-x-2 pt-2">
            <div className="flex items-center space-x-1 px-2 py-1 bg-purple-50 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 rounded-md text-xs">
              <Target className="w-3 h-3" />
              <span>Recurring {goal.recurringPeriod}</span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-2 pt-2">
          <Button variant="glass" size="sm" className="flex-1" onClick={onEdit}>
            <Edit3 className="w-3 h-3 mr-1" />
            Edit
          </Button>
          <Button variant="ghost" size="sm" className="flex-1" onClick={onAddProgress}>
            <Plus className="w-3 h-3 mr-1" />
            Add Progress
          </Button>
        </div>
      </div>
    </Card>
  );
};