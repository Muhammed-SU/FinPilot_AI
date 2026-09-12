import React from 'react';
import { Filter, Calendar, Target, TrendingUp, X } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface BudgetFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  filters: {
    period: string;
    status: string;
    category: string;
    sortBy: string;
    sortDirection: string;
    dateRange: { start: string; end: string };
  };
  onFiltersChange: (filters: any) => void;
  categories: string[];
}

export const BudgetFilters: React.FC<BudgetFiltersProps> = ({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  categories
}) => {
  const handleFilterChange = (key: string, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const handleDateRangeChange = (key: 'start' | 'end', value: string) => {
    onFiltersChange({
      ...filters,
      dateRange: { ...filters.dateRange, [key]: value }
    });
  };

  const resetFilters = () => {
    onFiltersChange({
      period: 'all',
      status: 'all',
      category: 'all',
      sortBy: 'name',
      sortDirection: 'asc',
      dateRange: { start: '', end: '' }
    });
  };

  const hasActiveFilters = () => {
    return filters.period !== 'all' || 
           filters.status !== 'all' || 
           filters.category !== 'all' ||
           filters.dateRange.start !== '' ||
           filters.dateRange.end !== '';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center p-4 z-50 animate-in fade-in duration-300 overflow-y-auto">
      <div className="w-full max-w-lg my-4 transform transition-all duration-300 animate-in slide-in-from-bottom-4">
        <Card className="relative max-h-[calc(100vh-2rem)] overflow-hidden">
          {/* Fixed Header */}
          <div className="sticky top-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border-b border-gray-200/50 dark:border-slate-700/50 p-6 pb-4">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors z-10"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>

            <div className="pr-12">
              <div className="flex items-center space-x-3 mb-2">
                <Filter className="w-6 h-6 text-blue-500 dark:text-blue-400" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Filter Budgets</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300">Customize your budget view</p>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="overflow-y-auto max-h-[calc(100vh-12rem)] px-6 py-4">
            <div className="space-y-6">
              {/* Period Filter */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Period
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'all', label: 'All Periods' },
                    { value: 'weekly', label: 'Weekly' },
                    { value: 'monthly', label: 'Monthly' },
                    { value: 'quarterly', label: 'Quarterly' },
                    { value: 'yearly', label: 'Yearly' }
                  ].map((period) => (
                    <button
                      key={period.value}
                      onClick={() => handleFilterChange('period', period.value)}
                      className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                        filters.period === period.value
                          ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                          : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {period.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status Filter */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  <TrendingUp className="w-4 h-4 inline mr-2" />
                  Status
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'all', label: 'All Status' },
                    { value: 'on-track', label: 'On Track' },
                    { value: 'warning', label: 'Near Limit' },
                    { value: 'over-budget', label: 'Over Budget' }
                  ].map((status) => (
                    <button
                      key={status.value}
                      onClick={() => handleFilterChange('status', status.value)}
                      className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                        filters.status === status.value
                          ? 'bg-green-500 text-white shadow-lg shadow-green-500/25'
                          : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {status.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Filter */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  <Target className="w-4 h-4 inline mr-2" />
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300/50 dark:border-slate-600/50 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-md text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
                >
                  <option value="all">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category} className="bg-white dark:bg-slate-800">
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Range Filter */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Date Range
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={filters.dateRange.start}
                      onChange={(e) => handleDateRangeChange('start', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300/50 dark:border-slate-600/50 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-md text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">End Date</label>
                    <input
                      type="date"
                      value={filters.dateRange.end}
                      onChange={(e) => handleDateRangeChange('end', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300/50 dark:border-slate-600/50 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-md text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
                    />
                  </div>
                </div>
              </div>

              {/* Sort Options */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Sort By
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Sort Field</label>
                    <select
                      value={filters.sortBy}
                      onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300/50 dark:border-slate-600/50 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-md text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
                    >
                      <option value="name">Name</option>
                      <option value="amount">Budget Amount</option>
                      <option value="spent">Amount Spent</option>
                      <option value="percentage">Progress %</option>
                      <option value="remaining">Remaining</option>
                      <option value="endDate">End Date</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Direction</label>
                    <select
                      value={filters.sortDirection}
                      onChange={(e) => handleFilterChange('sortDirection', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300/50 dark:border-slate-600/50 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-md text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
                    >
                      <option value="asc">Ascending</option>
                      <option value="desc">Descending</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Active Filters Summary */}
              {hasActiveFilters() && (
                <div className="p-3 bg-blue-50 dark:bg-blue-500/20 border border-blue-200 dark:border-blue-500/30 rounded-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                      Active filters applied
                    </span>
                    <button
                      onClick={resetFilters}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium transition-colors"
                    >
                      Clear all
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Fixed Footer */}
          <div className="sticky bottom-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border-t border-gray-200/50 dark:border-slate-700/50 p-6 pt-4">
            <div className="flex space-x-3">
              <Button variant="ghost" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button onClick={onClose} className="flex-1">
                Apply Filters
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};