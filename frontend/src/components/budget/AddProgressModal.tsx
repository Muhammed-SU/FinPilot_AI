import React, { useState } from 'react';
import { X, Plus, DollarSign } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { BudgetGoal } from '../services/budgetService';

interface AddProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal: BudgetGoal | null;
  onAddProgress: (amount: number) => void;
  formatAmount: (amount: number) => string;
}

export const AddProgressModal: React.FC<AddProgressModalProps> = ({
  isOpen,
  onClose,
  goal,
  onAddProgress,
  formatAmount
}) => {
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (!goal) return;

    const progressAmount = parseFloat(amount);
    const newTotal = goal.currentAmount + progressAmount;
    
    if (newTotal > goal.targetAmount) {
      setError(`Amount would exceed target. Maximum you can add: ${formatAmount(goal.targetAmount - goal.currentAmount)}`);
      return;
    }

    setIsLoading(true);
    try {
      await onAddProgress(progressAmount);
      setAmount('');
      setError('');
      onClose();
    } catch (error) {
      setError('Failed to add progress. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (value: string) => {
    setAmount(value);
    if (error) setError('');
  };

  if (!isOpen || !goal) return null;

  const remaining = goal.targetAmount - goal.currentAmount;
  const currentPercentage = (goal.currentAmount / goal.targetAmount) * 100;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
      <div className="w-full max-w-md transform transition-all duration-300 animate-in slide-in-from-bottom-4">
        <Card className="relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            disabled={isLoading}
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Add Progress</h2>
            <p className="text-gray-600 dark:text-gray-300">Add money to your "{goal.title}" goal</p>
          </div>

          {/* Current Progress */}
          <div className="mb-6 p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl">
            <div className="flex items-center space-x-3 mb-3">
              <div 
                className="w-4 h-4 rounded-full shadow-lg" 
                style={{ backgroundColor: goal.color }}
              />
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">{goal.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{goal.category}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Current Progress</span>
                <span>{currentPercentage.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                <div
                  className="h-2 bg-blue-500 rounded-full transition-all duration-300"
                  style={{ width: `${currentPercentage}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>{formatAmount(goal.currentAmount)}</span>
                <span>{formatAmount(goal.targetAmount)}</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-500/20 border border-red-200 dark:border-red-500/30 rounded-xl">
                <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
              </div>
            )}

            <Input
              label="Amount to Add"
              type="number"
              step="0.01"
              min="0"
              max={remaining}
              value={amount}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="0.00"
              icon={<DollarSign className="w-5 h-5 text-gray-400" />}
              disabled={isLoading}
            />

            <div className="p-3 bg-blue-50 dark:bg-blue-500/20 rounded-xl">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-blue-600 dark:text-blue-400">Remaining to goal:</span>
                <span className="font-medium text-blue-700 dark:text-blue-300">
                  {formatAmount(remaining)}
                </span>
              </div>
              {amount && parseFloat(amount) > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-blue-600 dark:text-blue-400">After this addition:</span>
                  <span className="font-medium text-blue-700 dark:text-blue-300">
                    {formatAmount(remaining - parseFloat(amount))}
                  </span>
                </div>
              )}
            </div>

            {/* Quick Amount Buttons */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Quick amounts
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[10, 25, 50, 100].map((quickAmount) => (
                  <button
                    key={quickAmount}
                    type="button"
                    onClick={() => handleInputChange(quickAmount.toString())}
                    className="px-3 py-2 text-sm bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
                    disabled={isLoading || quickAmount > remaining}
                  >
                    ${quickAmount}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                className="flex-1"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={isLoading || !amount || parseFloat(amount) <= 0}
              >
                {isLoading ? 'Adding...' : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Progress
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};