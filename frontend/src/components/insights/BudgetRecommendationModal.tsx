import React from 'react';
import { X, Target, TrendingUp, Plus, Edit3 } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { AIInsight } from '../services/aiInsightsService';

interface BudgetRecommendationModalProps {
  isOpen: boolean;
  onClose: () => void;
  insight: AIInsight | null;
  formatAmount: (amount: number) => string;
  onApplyRecommendation: (recommendation: any) => void;
}

export const BudgetRecommendationModal: React.FC<BudgetRecommendationModalProps> = ({
  isOpen,
  onClose,
  insight,
  formatAmount,
  onApplyRecommendation
}) => {
  if (!isOpen || !insight || insight.id !== 'budget-recommendations') return null;

  const recommendations = insight.data || [];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/20';
      case 'medium':
        return 'border-yellow-200 dark:border-yellow-500/30 bg-yellow-50 dark:bg-yellow-500/20';
      default:
        return 'border-green-200 dark:border-green-500/30 bg-green-50 dark:bg-green-500/20';
    }
  };

  const getPriorityBadge = (priority: string) => {
    const badges: Record<string, { color: string; label: string }> = {
      'high': { color: 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400', label: 'High Priority' },
      'medium': { color: 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400', label: 'Medium Priority' },
      'low': { color: 'bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400', label: 'Low Priority' }
    };
    
    const badge = badges[priority] || badges.low;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${badge.color}`}>
        {badge.label}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
      <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 animate-in slide-in-from-bottom-4">
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
              <div className="w-12 h-12 bg-purple-50 dark:bg-purple-500/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Target className="w-6 h-6 text-purple-500 dark:text-purple-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  Budget Recommendations
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Smart suggestions to optimize your budgets based on spending patterns
                </p>
              </div>
            </div>

            {/* Recommendations List */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recommendations ({recommendations.length})
              </h3>
              
              {recommendations.length > 0 ? (
                <div className="space-y-4">
                  {recommendations.map((rec: any, index: number) => (
                    <div key={index} className={`p-4 rounded-xl border ${getPriorityColor(rec.priority)}`}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-semibold text-gray-900 dark:text-white capitalize">
                              {rec.type.replace('_', ' ')}
                            </h4>
                            {getPriorityBadge(rec.priority)}
                          </div>
                          <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                            {rec.message}
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="text-center p-3 bg-white dark:bg-slate-800 rounded-lg">
                          <p className="text-sm text-gray-500 dark:text-gray-400">Category</p>
                          <p className="font-medium text-gray-900 dark:text-white">{rec.category}</p>
                        </div>
                        
                        {rec.currentBudget && (
                          <div className="text-center p-3 bg-white dark:bg-slate-800 rounded-lg">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Current Budget</p>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {formatAmount(rec.currentBudget)}
                            </p>
                          </div>
                        )}
                        
                        <div className="text-center p-3 bg-white dark:bg-slate-800 rounded-lg">
                          <p className="text-sm text-gray-500 dark:text-gray-400">Suggested Budget</p>
                          <p className="font-medium text-blue-600 dark:text-blue-400">
                            {formatAmount(rec.suggestedBudget)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button 
                          variant="glass" 
                          className="flex-1"
                          onClick={() => onApplyRecommendation(rec)}
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
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No budget recommendations available</p>
                </div>
              )}
            </div>

            {/* Tips */}
            <div className="p-4 bg-blue-50 dark:bg-blue-500/20 rounded-xl">
              <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2 flex items-center">
                <TrendingUp className="w-4 h-4 mr-2" />
                Budget Optimization Tips
              </h4>
              <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                <li>• Review your spending patterns monthly to identify trends</li>
                <li>• Increase budgets gradually rather than making large jumps</li>
                <li>• Consider seasonal variations in your spending</li>
                <li>• Set aside buffer amounts for unexpected expenses</li>
                <li>• Use the 50/30/20 rule: 50% needs, 30% wants, 20% savings</li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex space-x-3 pt-4">
              <Button variant="ghost" onClick={onClose} className="flex-1">
                Close
              </Button>
              <Button className="flex-1">
                View All Budgets
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};