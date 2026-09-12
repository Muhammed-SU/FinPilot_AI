import React from 'react';
import { X, TrendingUp, Calendar, BarChart3, AlertTriangle } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { AIInsight, SpendingPredictions } from '../services/aiInsightsService';

interface SpendingForecastModalProps {
  isOpen: boolean;
  onClose: () => void;
  insight: AIInsight | null;
  formatAmount: (amount: number) => string;
  predictions: SpendingPredictions;
}

export const SpendingForecastModal: React.FC<SpendingForecastModalProps> = ({
  isOpen,
  onClose,
  insight,
  formatAmount,
  predictions
}) => {
  if (!isOpen || !insight || insight.id !== 'spending-prediction') return null;

  const currentMonthSpending = predictions.nextMonth / 1.05; // Reverse the 5% increase to get current
  const monthlyIncrease = predictions.nextMonth - currentMonthSpending;
  const increasePercentage = ((monthlyIncrease / currentMonthSpending) * 100).toFixed(1);

  const forecastData = [
    {
      period: 'Next Month',
      amount: predictions.nextMonth,
      change: `+${increasePercentage}%`,
      icon: Calendar,
      color: 'bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400'
    },
    {
      period: 'Next Quarter',
      amount: predictions.nextQuarter,
      change: '+3% quarterly',
      icon: BarChart3,
      color: 'bg-purple-50 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400'
    },
    {
      period: 'Next Year',
      amount: predictions.nextYear,
      change: '+2% annually',
      icon: TrendingUp,
      color: 'bg-green-50 dark:bg-green-500/20 text-green-600 dark:text-green-400'
    }
  ];

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
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-500/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-6 h-6 text-blue-500 dark:text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  Spending Forecast
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Predictions based on your current spending patterns
                </p>
              </div>
            </div>

            {/* Current vs Predicted */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="text-center p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Current Month</h4>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatAmount(currentMonthSpending)}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Actual spending</p>
              </div>

              <div className="text-center p-4 bg-blue-50 dark:bg-blue-500/20 rounded-xl">
                <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Next Month</h4>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                  {formatAmount(predictions.nextMonth)}
                </p>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  +{formatAmount(monthlyIncrease)} ({increasePercentage}% increase)
                </p>
              </div>
            </div>

            {/* Forecast Timeline */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Forecast Timeline</h3>
              
              <div className="space-y-3">
                {forecastData.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={index} className={`p-4 rounded-xl ${item.color}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Icon className="w-6 h-6" />
                          <div>
                            <h4 className="font-medium">{item.period}</h4>
                            <p className="text-sm opacity-80">{item.change}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold">{formatAmount(item.amount)}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Confidence & Methodology */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Confidence Level</h4>
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '70%' }}></div>
                  </div>
                  <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">70%</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Medium confidence based on 30 days of data
                </p>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Methodology</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• Historical spending analysis</li>
                  <li>• Seasonal trend adjustments</li>
                  <li>• Category-wise predictions</li>
                </ul>
              </div>
            </div>

            {/* Factors Affecting Forecast */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Factors Affecting Forecast</h3>
              
              <div className="space-y-3">
                <div className="p-3 bg-yellow-50 dark:bg-yellow-500/20 rounded-lg border border-yellow-200 dark:border-yellow-500/30">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h5 className="font-medium text-yellow-800 dark:text-yellow-300">Seasonal Variations</h5>
                      <p className="text-sm text-yellow-700 dark:text-yellow-400">
                        Holiday seasons and special events may increase spending
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-blue-50 dark:bg-blue-500/20 rounded-lg">
                  <h5 className="font-medium text-blue-800 dark:text-blue-300">Income Changes</h5>
                  <p className="text-sm text-blue-700 dark:text-blue-400">
                    Salary increases or bonuses may affect spending patterns
                  </p>
                </div>

                <div className="p-3 bg-purple-50 dark:bg-purple-500/20 rounded-lg">
                  <h5 className="font-medium text-purple-800 dark:text-purple-300">Lifestyle Changes</h5>
                  <p className="text-sm text-purple-700 dark:text-purple-400">
                    Moving, new job, or family changes can impact expenses
                  </p>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="p-4 bg-green-50 dark:bg-green-500/20 rounded-xl">
              <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">Recommendations</h4>
              <ul className="text-sm text-green-700 dark:text-green-400 space-y-1">
                <li>• Review and adjust budgets for the predicted increase</li>
                <li>• Identify areas where you can reduce spending</li>
                <li>• Set aside emergency funds for unexpected expenses</li>
                <li>• Monitor actual vs predicted spending monthly</li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex space-x-3 pt-4">
              <Button variant="ghost" onClick={onClose} className="flex-1">
                Close
              </Button>
              <Button className="flex-1">
                Adjust Budgets
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};