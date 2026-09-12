import React from 'react';
import { X, AlertTriangle, Calendar, DollarSign, Tag } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { AIInsight } from '../services/aiInsightsService';

interface TransactionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  insight: AIInsight | null;
  formatAmount: (amount: number) => string;
}

export const TransactionDetailsModal: React.FC<TransactionDetailsModalProps> = ({
  isOpen,
  onClose,
  insight,
  formatAmount
}) => {
  if (!isOpen || !insight || insight.id !== 'unusual-spending') return null;

  const unusualTransactions = insight.data || [];

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
              <div className="w-12 h-12 bg-yellow-50 dark:bg-yellow-500/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-yellow-500 dark:text-yellow-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  Unusual Spending Detected
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  These transactions are significantly higher than your usual spending in their categories
                </p>
              </div>
            </div>

            {/* Unusual Transactions List */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Transactions ({unusualTransactions.length})
              </h3>
              
              {unusualTransactions.length > 0 ? (
                <div className="space-y-3">
                  {unusualTransactions.map((item: any, index: number) => (
                    <div key={index} className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-yellow-200 dark:border-yellow-500/30">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {item.transaction.title}
                        </h4>
                        <span className="text-lg font-bold text-red-600 dark:text-red-400">
                          {formatAmount(Math.abs(item.transaction.amount))}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600 dark:text-gray-300">
                            {new Date(item.transaction.date).toLocaleDateString()}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Tag className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600 dark:text-gray-300">
                            {item.transaction.category}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className="w-4 h-4 text-yellow-500" />
                          <span className="text-yellow-600 dark:text-yellow-400 font-medium">
                            {item.deviation}% above average
                          </span>
                        </div>
                      </div>
                      
                      {item.transaction.note && (
                        <div className="mt-2 p-2 bg-gray-100 dark:bg-slate-700 rounded-lg">
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            <strong>Note:</strong> {item.transaction.note}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No unusual transactions found</p>
                </div>
              )}
            </div>

            {/* Recommendations */}
            <div className="p-4 bg-blue-50 dark:bg-blue-500/20 rounded-xl">
              <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Recommendations</h4>
              <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                <li>• Review these transactions to ensure they're legitimate</li>
                <li>• Consider if these represent one-time expenses or new spending patterns</li>
                <li>• Adjust your budgets if these higher amounts are expected to continue</li>
                <li>• Set up alerts for future transactions above certain thresholds</li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex space-x-3 pt-4">
              <Button variant="ghost" onClick={onClose} className="flex-1">
                Close
              </Button>
              <Button className="flex-1">
                Review All Transactions
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};