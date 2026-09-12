import React, { useState, useEffect } from 'react';
import { X, Target, DollarSign, Calendar, Tag, FileText, Palette, Flag } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { BudgetGoal, updateBudgetGoal } from '../services/budgetService';

interface EditBudgetGoalFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  goal: BudgetGoal | null;
}

const predefinedColors = [
  '#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', 
  '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
];

const categories = [
  'Emergency Fund', 'Vacation', 'New Car', 'Home Down Payment', 
  'Education', 'Retirement', 'Investment', 'Debt Payoff',
  'Wedding', 'Home Improvement', 'Electronics', 'Other'
];

const priorities = [
  { value: 'low', label: 'Low', color: 'text-green-600 dark:text-green-400' },
  { value: 'medium', label: 'Medium', color: 'text-yellow-600 dark:text-yellow-400' },
  { value: 'high', label: 'High', color: 'text-orange-600 dark:text-orange-400' },
  { value: 'critical', label: 'Critical', color: 'text-red-600 dark:text-red-400' }
];

const recurringPeriods = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'yearly', label: 'Yearly' }
];

export const EditBudgetGoalForm: React.FC<EditBudgetGoalFormProps> = ({
  isOpen,
  onClose,
  onSuccess,
  goal
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetAmount: '',
    currentAmount: '0',
    targetDate: '',
    category: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    color: predefinedColors[0],
    isRecurring: false,
    recurringPeriod: 'monthly' as 'weekly' | 'monthly' | 'quarterly' | 'yearly'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Populate form when goal changes
  useEffect(() => {
    if (goal) {
      setFormData({
        title: goal.title,
        description: goal.description || '',
        targetAmount: goal.targetAmount.toString(),
        currentAmount: goal.currentAmount.toString(),
        targetDate: new Date(goal.targetDate).toISOString().split('T')[0],
        category: goal.category,
        priority: goal.priority,
        color: goal.color,
        isRecurring: goal.isRecurring,
        recurringPeriod: goal.recurringPeriod || 'monthly'
      });
    }
  }, [goal]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Goal title is required';
    }

    if (!formData.targetAmount || parseFloat(formData.targetAmount) <= 0) {
      newErrors.targetAmount = 'Target amount must be greater than 0';
    }

    const currentAmount = parseFloat(formData.currentAmount);
    const targetAmount = parseFloat(formData.targetAmount);
    if (currentAmount < 0) {
      newErrors.currentAmount = 'Current amount cannot be negative';
    }
    if (currentAmount > targetAmount) {
      newErrors.currentAmount = 'Current amount cannot exceed target amount';
    }

    if (!formData.targetDate) {
      newErrors.targetDate = 'Target date is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !goal) return;

    setIsLoading(true);

    try {
      const goalId = goal._id || goal.id;
      if (!goalId) {
        throw new Error('Goal ID not found');
      }

      const updatedData = {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        targetAmount: parseFloat(formData.targetAmount),
        currentAmount: parseFloat(formData.currentAmount),
        targetDate: new Date(formData.targetDate),
        category: formData.category,
        priority: formData.priority,
        color: formData.color,
        isRecurring: formData.isRecurring,
        recurringPeriod: formData.isRecurring ? formData.recurringPeriod : undefined
      };

      await updateBudgetGoal(goalId, updatedData);
      
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error updating goal:', error);
      setErrors({ 
        submit: error.response?.data?.error || 'Failed to update goal. Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen || !goal) return null;

  const progressPercentage = formData.targetAmount && formData.currentAmount 
    ? (parseFloat(formData.currentAmount) / parseFloat(formData.targetAmount)) * 100 
    : 0;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 animate-in slide-in-from-bottom-4">
        <Card className="relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors z-10"
            disabled={isLoading}
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Edit Savings Goal</h2>
            <p className="text-gray-600 dark:text-gray-300">Update your savings goal details</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.submit && (
              <div className="p-3 bg-red-50 dark:bg-red-500/20 border border-red-200 dark:border-red-500/30 rounded-xl">
                <p className="text-red-600 dark:text-red-400 text-sm">{errors.submit}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Goal Title"
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="e.g., Emergency Fund"
                icon={<Target className="w-5 h-5 text-gray-400" />}
                error={errors.title}
                disabled={isLoading}
              />

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Category
                </label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className={`
                      block w-full rounded-xl border border-gray-300/50 dark:border-slate-600/50 pl-10 pr-3 py-2.5 
                      text-gray-900 dark:text-white bg-white/50 dark:bg-slate-800/50 backdrop-blur-md
                      focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/50 
                      focus:ring-offset-2 focus:ring-offset-transparent focus:outline-none 
                      transition-all duration-300
                      ${errors.category ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/50' : ''}
                    `}
                    disabled={isLoading}
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category} value={category} className="bg-white dark:bg-slate-800">
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.category && (
                  <p className="text-sm text-red-500 dark:text-red-400">{errors.category}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Target Amount"
                type="number"
                step="0.01"
                min="0"
                value={formData.targetAmount}
                onChange={(e) => handleInputChange('targetAmount', e.target.value)}
                placeholder="0.00"
                icon={<DollarSign className="w-5 h-5 text-gray-400" />}
                error={errors.targetAmount}
                disabled={isLoading}
              />

              <Input
                label="Current Amount"
                type="number"
                step="0.01"
                min="0"
                value={formData.currentAmount}
                onChange={(e) => handleInputChange('currentAmount', e.target.value)}
                placeholder="0.00"
                icon={<DollarSign className="w-5 h-5 text-gray-400" />}
                error={errors.currentAmount}
                disabled={isLoading}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Target Date"
                type="date"
                value={formData.targetDate}
                onChange={(e) => handleInputChange('targetDate', e.target.value)}
                icon={<Calendar className="w-5 h-5 text-gray-400" />}
                error={errors.targetDate}
                disabled={isLoading}
              />

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Priority
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {priorities.map((priority) => (
                    <button
                      key={priority.value}
                      type="button"
                      onClick={() => handleInputChange('priority', priority.value)}
                      className={`flex items-center justify-center space-x-1 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                        formData.priority === priority.value
                          ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                          : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700'
                      }`}
                      disabled={isLoading}
                    >
                      <Flag className="w-3 h-3" />
                      <span>{priority.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-3">
                <Palette className="w-4 h-4 inline mr-2" />
                Color
              </label>
              <div className="grid grid-cols-5 gap-3">
                {predefinedColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => handleInputChange('color', color)}
                    className={`w-12 h-12 rounded-xl transition-all duration-300 hover:scale-110 ${
                      formData.color === color 
                        ? 'ring-4 ring-blue-500/50 ring-offset-2 ring-offset-white dark:ring-offset-slate-800 scale-110' 
                        : 'hover:ring-2 hover:ring-gray-300 dark:hover:ring-slate-600'
                    }`}
                    style={{ backgroundColor: color }}
                    disabled={isLoading}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Description (Optional)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Add a description for this goal..."
                rows={3}
                className="
                  block w-full rounded-xl border border-gray-300/50 dark:border-slate-600/50 px-3 py-2.5 
                  text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400
                  bg-white/50 dark:bg-slate-800/50 backdrop-blur-md
                  focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/50 
                  focus:ring-offset-2 focus:ring-offset-transparent focus:outline-none 
                  transition-all duration-300 resize-none
                "
                disabled={isLoading}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="isRecurring"
                  checked={formData.isRecurring}
                  onChange={(e) => handleInputChange('isRecurring', e.target.checked)}
                  className="rounded border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-blue-600 focus:ring-blue-500/50 focus:ring-offset-0"
                  disabled={isLoading}
                />
                <label htmlFor="isRecurring" className="text-sm text-gray-700 dark:text-gray-200">
                  Make this a recurring goal
                </label>
              </div>

              {formData.isRecurring && (
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Recurring Period
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {recurringPeriods.map((period) => (
                      <button
                        key={period.value}
                        type="button"
                        onClick={() => handleInputChange('recurringPeriod', period.value)}
                        className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                          formData.recurringPeriod === period.value
                            ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/25'
                            : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700'
                        }`}
                        disabled={isLoading}
                      >
                        {period.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Preview */}
            <div className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Preview</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full shadow-lg" 
                    style={{ backgroundColor: formData.color }}
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {formData.title || 'Goal Title'}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formData.category || 'Category'} • {formData.priority} priority
                    </p>
                  </div>
                </div>
                
                {formData.targetAmount && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{progressPercentage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-green-500 transition-all duration-300"
                        style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>${formData.currentAmount || '0'}</span>
                      <span>${formData.targetAmount}</span>
                    </div>
                  </div>
                )}
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
                disabled={isLoading}
              >
                {isLoading ? 'Updating...' : 'Update Goal'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};