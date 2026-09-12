import React from 'react';
import { X, PiggyBank, TrendingDown, Target, DollarSign } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { AIInsight } from '../services/aiInsightsService';

interface SavingsOpportunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  insight: AIInsight | null;
  formatAmount: (amount: number) => string;
}

export const SavingsOpportunityModal: React.FC<SavingsOpportunityModalProps> = ({
  isOpen,
  onClose,
  insight,
  formatAmount
}) => {
  if (!isOpen || !insight || insight.id !== 'savings-opportunity') return null;

  const savingsData = insight.data || {};
  const { category, currentSpending, potentialSavings } = savingsData;

  const monthlyTarget = potentialSavings;
  const yearlyTarget = potentialSavings * 12;
  const reductionPercentage = ((potentialSavings / currentSpending) * 100).toFixed(1);

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
              <div className="w-12 h-12 bg-green-50 dark:bg-green-500/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                <PiggyBank className="w-6 h-6 text-green-500 dark:text-green-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  Savings Opportunity
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Reduce spending in {category} to boost your savings
                </p>
              </div>
            </div>

            {/* Savings Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-500/20 rounded-xl">
                <DollarSign className="w-8 h-8 text-blue-500 dark:text-blue-400 mx-auto mb-2" />
                <p className="text-sm text-blue-600 dark:text-blue-400">Current Spending</p>
                <p className="text-xl font-bold text-blue-700 dark:text-blue-300">
                  {formatAmount(currentSpending)}
                </p>
              </div>

              <div className="text-center p-4 bg-green-50 dark:bg-green-500/20 rounded-xl">
                <TrendingDown className="w-8 h-8 text-green-500 dark:text-green-400 mx-auto mb-2" />
                <p className="text-sm text-green-600 dark:text-green-400">Potential Monthly Savings</p>
                <p className="text-xl font-bold text-green-700 dark:text-green-300">
                  {formatAmount(monthlyTarget)}
                </p>
              </div>

              <div className="text-center p-4 bg-purple-50 dark:bg-purple-500/20 rounded-xl">
                <Target className="w-8 h-8 text-purple-500 dark:text-purple-400 mx-auto mb-2" />
                <p className="text-sm text-purple-600 dark:text-purple-400">Reduction Target</p>
                <p className="text-xl font-bold text-purple-700 dark:text-purple-300">
                  {reductionPercentage}%
                </p>
              </div>
            </div>

            {/* Savings Projection */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Savings Projection</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">6 Months</h4>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {formatAmount(monthlyTarget * 6)}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    By reducing {category} spending by {reductionPercentage}%
                  </p>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">1 Year</h4>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {formatAmount(yearlyTarget)}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Annual savings potential
                  </p>
                </div>
              </div>
            </div>

            {/* Actionable Tips */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                How to Save on {category}
              </h3>
              
              <div className="space-y-3">
                {category === 'Food & Dining' && (
                  <>
                    <div className="p-3 bg-blue-50 dark:bg-blue-500/20 rounded-lg">
                      <h5 className="font-medium text-blue-800 dark:text-blue-300">Meal Planning</h5>
                      <p className="text-sm text-blue-700 dark:text-blue-400">
                        Plan your meals weekly and cook at home more often
                      </p>
                    </div>
                    <div className="p-3 bg-blue-50 dark:bg-blue-500/20 rounded-lg">
                      <h5 className="font-medium text-blue-800 dark:text-blue-300">Bulk Buying</h5>
                      <p className="text-sm text-blue-700 dark:text-blue-400">
                        Buy non-perishables in bulk and use coupons
                      </p>
                    </div>
                    <div className="p-3 bg-blue-50 dark:bg-blue-500/20 rounded-lg">
                      <h5 className="font-medium text-blue-800 dark:text-blue-300">Dining Out</h5>
                      <p className="text-sm text-blue-700 dark:text-blue-400">
                        Limit restaurant visits and try lunch specials instead of dinner
                      </p>
                    </div>
                  </>
                )}
                
                {category === 'Transportation' && (
                  <>
                    <div className="p-3 bg-blue-50 dark:bg-blue-500/20 rounded-lg">
                      <h5 className="font-medium text-blue-800 dark:text-blue-300">Public Transport</h5>
                      <p className="text-sm text-blue-700 dark:text-blue-400">
                        Use public transportation or carpool when possible
                      </p>
                    </div>
                    <div className="p-3 bg-blue-50 dark:bg-blue-500/20 rounded-lg">
                      <h5 className="font-medium text-blue-800 dark:text-blue-300">Fuel Efficiency</h5>
                      <p className="text-sm text-blue-700 dark:text-blue-400">
                        Maintain your vehicle and drive efficiently to save on gas
                      </p>
                    </div>
                  </>
                )}
                
                {category === 'Entertainment' && (
                  <>
                    <div className="p-3 bg-blue-50 dark:bg-blue-500/20 rounded-lg">
                      <h5 className="font-medium text-blue-800 dark:text-blue-300">Free Activities</h5>
                      <p className="text-sm text-blue-700 dark:text-blue-400">
                        Explore free events, parks, and community activities
                      </p>
                    </div>
                    <div className="p-3 bg-blue-50 dark:bg-blue-500/20 rounded-lg">
                      <h5 className="font-medium text-blue-800 dark:text-blue-300">Subscriptions</h5>
                      <p className="text-sm text-blue-700 dark:text-blue-400">
                        Review and cancel unused streaming or subscription services
                      </p>
                    </div>
                  </>
                )}
                
                {!['Food & Dining', 'Transportation', 'Entertainment'].includes(category) && (
                  <div className="p-3 bg-blue-50 dark:bg-blue-500/20 rounded-lg">
                    <h5 className="font-medium text-blue-800 dark:text-blue-300">Smart Spending</h5>
                    <p className="text-sm text-blue-700 dark:text-blue-400">
                      Look for discounts, compare prices, and consider alternatives before purchasing
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Goal Setting */}
            <div className="p-4 bg-green-50 dark:bg-green-500/20 rounded-xl">
              <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">Set a Savings Goal</h4>
              <p className="text-sm text-green-700 dark:text-green-400 mb-3">
                Start with a realistic target and gradually increase your savings rate.
              </p>
              <div className="flex space-x-2">
                <Button variant="glass" className="flex-1">
                  Save {formatAmount(monthlyTarget / 2)}/month
                </Button>
                <Button className="flex-1">
                  Save {formatAmount(monthlyTarget)}/month
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-3 pt-4">
              <Button variant="ghost" onClick={onClose} className="flex-1">
                Close
              </Button>
              <Button className="flex-1">
                Create Savings Goal
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};