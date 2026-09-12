import React, { useState, useEffect } from 'react';
import { X, Target, DollarSign, Calendar, FileText, Palette, AlertTriangle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { CategorySelector } from '../ui/CategorySelector';
import { createBudget } from '../services/budgetService';

interface CreateBudgetFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const predefinedColors = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', 
  '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
];

const periods = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'yearly', label: 'Yearly' }
];

export const CreateBudgetForm: React.FC<CreateBudgetFormProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    budgetedAmount: '',
    period: 'monthly' as 'weekly' | 'monthly' | 'quarterly' | 'yearly',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    alertThreshold: '80',
    color: predefinedColors[0],
    description: '',
    tags: '',
    rollover: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-calculate end date based on period and start date
  useEffect(() => {
    if (formData.startDate && formData.period) {
      const startDate = new Date(formData.startDate);
      let endDate = new Date(startDate);
      
      switch (formData.period) {
        case 'weekly':
          endDate.setDate(startDate.getDate() + 7);
          break;
        case 'monthly':
          endDate.setMonth(startDate.getMonth() + 1);
          break;
        case 'quarterly':
          endDate.setMonth(startDate.getMonth() + 3);
          break;
        case 'yearly':
          endDate.setFullYear(startDate.getFullYear() + 1);
          break;
      }
      
      setFormData(prev => ({
        ...prev,
        endDate: endDate.toISOString().split('T')[0]
      }));
    }
  }, [formData.startDate, formData.period]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Budget name is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.budgetedAmount || parseFloat(formData.budgetedAmount) <= 0) {
      newErrors.budgetedAmount = 'Budget amount must be greater than 0';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    } else if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      newErrors.endDate = 'End date must be after start date';
    }

    const threshold = parseFloat(formData.alertThreshold);
    if (isNaN(threshold) || threshold < 0 || threshold > 100) {
      newErrors.alertThreshold = 'Alert threshold must be between 0 and 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const budgetData = {
        name: formData.name.trim(),
        category: formData.category,
        budgetedAmount: parseFloat(formData.budgetedAmount),
        period: formData.period,
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
        alertThreshold: parseFloat(formData.alertThreshold),
        isActive: true,
        color: formData.color,
        description: formData.description.trim() || undefined,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
        rollover: formData.rollover
      };

      await createBudget(budgetData);
      
      // Reset form
      setFormData({
        name: '',
        category: '',
        budgetedAmount: '',
        period: 'monthly',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        alertThreshold: '80',
        color: predefinedColors[0],
        description: '',
        tags: '',
        rollover: false
      });
      
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error creating budget:', error);
      setErrors({ 
        submit: error.response?.data?.error || 'Failed to create budget. Please try again.' 
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

  // Validate end date when start date changes
  const handleStartDateChange = (value: string) => {
    handleInputChange('startDate', value);
    
    // Clear end date error if it exists and dates are now valid
    if (errors.endDate && formData.endDate && new Date(formData.endDate) > new Date(value)) {
      setErrors(prev => ({ ...prev, endDate: '' }));
    }
  };

  // Validate end date when it changes
  const handleEndDateChange = (value: string) => {
    handleInputChange('endDate', value);
    
    // Validate immediately
    if (value && formData.startDate && new Date(value) <= new Date(formData.startDate)) {
      setErrors(prev => ({ ...prev, endDate: 'End date must be after start date' }));
    } else if (errors.endDate) {
      setErrors(prev => ({ ...prev, endDate: '' }));
    }
  };

  if (!isOpen) return null;

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
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Create Budget</h2>
            <p className="text-gray-600 dark:text-gray-300">Set up a new budget to track your spending</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.submit && (
              <div className="p-3 bg-red-50 dark:bg-red-500/20 border border-red-200 dark:border-red-500/30 rounded-xl">
                <p className="text-red-600 dark:text-red-400 text-sm">{errors.submit}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Budget Name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="e.g., Monthly Groceries"
                icon={<Target className="w-5 h-5 text-gray-400" />}
                error={errors.name}
                disabled={isLoading}
              />

              <CategorySelector
                value={formData.category}
                onChange={(value) => handleInputChange('category', value)}
                type="expense"
                error={errors.category}
                disabled={isLoading}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Budget Amount"
                type="number"
                step="0.01"
                min="0"
                value={formData.budgetedAmount}
                onChange={(e) => handleInputChange('budgetedAmount', e.target.value)}
                placeholder="0.00"
                icon={<DollarSign className="w-5 h-5 text-gray-400" />}
                error={errors.budgetedAmount}
                disabled={isLoading}
              />

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Period
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {periods.map((period) => (
                    <button
                      key={period.value}
                      type="button"
                      onClick={() => handleInputChange('period', period.value)}
                      className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                        formData.period === period.value
                          ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                          : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700'
                      }`}
                      disabled={isLoading}
                    >
                      {period.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Start Date"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleStartDateChange(e.target.value)}
                icon={<Calendar className="w-5 h-5 text-gray-400" />}
                error={errors.startDate}
                disabled={isLoading}
              />

              <Input
                label="End Date"
                type="date"
                value={formData.endDate}
                onChange={(e) => handleEndDateChange(e.target.value)}
                min={formData.startDate ? new Date(new Date(formData.startDate).getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0] : undefined}
                icon={<Calendar className="w-5 h-5 text-gray-400" />}
                error={errors.endDate}
                disabled={isLoading}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Alert Threshold (%)"
                type="number"
                min="0"
                max="100"
                value={formData.alertThreshold}
                onChange={(e) => handleInputChange('alertThreshold', e.target.value)}
                placeholder="80"
                icon={<AlertTriangle className="w-5 h-5 text-gray-400" />}
                error={errors.alertThreshold}
                disabled={isLoading}
              />

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
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Description (Optional)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Add a description for this budget..."
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

            <Input
              label="Tags (Optional)"
              type="text"
              value={formData.tags}
              onChange={(e) => handleInputChange('tags', e.target.value)}
              placeholder="e.g., essential, family, weekly (comma separated)"
              icon={<FileText className="w-5 h-5 text-gray-400" />}
              disabled={isLoading}
            />

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="rollover"
                checked={formData.rollover}
                onChange={(e) => handleInputChange('rollover', e.target.checked)}
                className="rounded border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-blue-600 focus:ring-blue-500/50 focus:ring-offset-0"
                disabled={isLoading}
              />
              <label htmlFor="rollover" className="text-sm text-gray-700 dark:text-gray-200">
                Rollover unused budget to next period
              </label>
            </div>

            {/* Preview */}
            <div className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Preview</h4>
              <div className="flex items-center space-x-3">
                <div 
                  className="w-4 h-4 rounded-full shadow-lg" 
                  style={{ backgroundColor: formData.color }}
                />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {formData.name || 'Budget Name'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {formData.category || 'Category'} • {formData.period} • ${formData.budgetedAmount || '0'}
                  </p>
                </div>
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
                {isLoading ? 'Creating...' : 'Create Budget'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};