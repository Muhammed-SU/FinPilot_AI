import React from 'react';
import { TrendingUp, TrendingDown, Target, DollarSign } from 'lucide-react';
import { Card } from '../ui/Card';
import { BudgetAnalytics } from '../services/budgetService';

interface BudgetAnalyticsChartProps {
  analytics: BudgetAnalytics;
  formatAmount: (amount: number) => string;
}

export const BudgetAnalyticsChart: React.FC<BudgetAnalyticsChartProps> = ({
  analytics,
  formatAmount
}) => {
  const { monthlyTrend, categoryBreakdown } = analytics;
  
  const maxValue = Math.max(
    ...monthlyTrend.map(d => Math.max(d.budgeted, d.spent))
  );

  const categoryData = Object.entries(categoryBreakdown)
    .map(([category, data]) => ({ category, ...data }))
    .sort((a, b) => b.spent - a.spent);

  const height = 240;
  const padding = 80; // Increased padding for better label visibility
  const chartHeight = height - padding * 2;
  const barWidth = 30;

  const getY = (value: number) => {
    return padding + chartHeight - (value / maxValue) * chartHeight;
  };

  const getX = (index: number, barIndex: number, totalWidth: number) => {
    const usableWidth = totalWidth - padding * 2;
    const groupWidth = usableWidth / monthlyTrend.length;
    const groupCenter = padding + (index * groupWidth) + (groupWidth / 2);
    return groupCenter + (barIndex - 0.5) * (barWidth + 5);
  };

  return (
    <div className="space-y-6">
      {/* Monthly Trend Chart */}
      <Card className="p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Budget vs Spending Trend</h3>
          
          <div className="w-full">
            <div className="w-full overflow-x-auto">
              <div style={{ minWidth: '600px', width: '100%' }}>
                <svg 
                  width="100%" 
                  height={height} 
                  viewBox={`0 0 600 ${height}`}
                  preserveAspectRatio="xMidYMid meet"
                  className="w-full"
                >
                  <defs>
                    <linearGradient id="budgetBarGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#3B82F6" />
                      <stop offset="100%" stopColor="#1D4ED8" />
                    </linearGradient>
                    <linearGradient id="spentBarGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#EF4444" />
                      <stop offset="100%" stopColor="#DC2626" />
                    </linearGradient>
                    
                    <pattern id="budgetGrid" width="50" height="30" patternUnits="userSpaceOnUse">
                      <path d="M 50 0 L 0 0 0 30" fill="none" stroke="rgba(156, 163, 175, 0.2)" strokeWidth="1"/>
                    </pattern>
                  </defs>

                  {/* Grid background */}
                  <rect width="600" height={height} fill="url(#budgetGrid)" />

                  {/* Bars */}
                  {monthlyTrend.map((data, index) => {
                    const budgetHeight = (data.budgeted / maxValue) * chartHeight;
                    const spentHeight = (data.spent / maxValue) * chartHeight;
                    
                    return (
                      <g key={index}>
                        {/* Budget bar */}
                        <rect
                          x={getX(index, 0, 600)}
                          y={getY(data.budgeted)}
                          width={barWidth}
                          height={budgetHeight}
                          fill="url(#budgetBarGradient)"
                          rx="4"
                          className="hover:opacity-80 transition-opacity duration-300 cursor-pointer"
                        />
                        
                        {/* Spent bar */}
                        <rect
                          x={getX(index, 1, 600)}
                          y={getY(data.spent)}
                          width={barWidth}
                          height={spentHeight}
                          fill="url(#spentBarGradient)"
                          rx="4"
                          className="hover:opacity-80 transition-opacity duration-300 cursor-pointer"
                        />
                        
                        {/* Month label */}
                        <text
                          x={getX(index, 0.5, 600) + barWidth / 2}
                          y={height - 15}
                          textAnchor="middle"
                          className="text-xs fill-gray-700 dark:fill-gray-300 font-medium"
                        >
                          {data.month}
                        </text>
                      </g>
                    );
                  })}

                  {/* Y-axis labels with better spacing */}
                  {[0, maxValue * 0.25, maxValue * 0.5, maxValue * 0.75, maxValue].map((value, index) => (
                    <text
                      key={index}
                      x={padding - 15}
                      y={getY(value)}
                      textAnchor="end"
                      className="text-xs fill-gray-600 dark:fill-gray-400"
                      dominantBaseline="middle"
                    >
                      {formatAmount(value)}
                    </text>
                  ))}

                  {/* Axis lines */}
                  <line
                    x1={padding}
                    y1={padding}
                    x2={padding}
                    y2={height - padding}
                    stroke="rgba(156, 163, 175, 0.3)"
                    strokeWidth="1"
                  />
                  <line
                    x1={padding}
                    y1={height - padding}
                    x2={600 - padding}
                    y2={height - padding}
                    stroke="rgba(156, 163, 175, 0.3)"
                    strokeWidth="1"
                  />
                </svg>
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center space-x-6 mt-4">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span className="text-sm text-gray-600 dark:text-gray-300">Budgeted</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span className="text-sm text-gray-600 dark:text-gray-300">Spent</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Category Breakdown and Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Category Performance</h3>
            
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {categoryData.map((category, index) => (
                <div key={category.category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {category.category}
                    </span>
                    <span className={`text-sm font-semibold ${
                      category.percentage >= 100 ? 'text-red-600 dark:text-red-400' :
                      category.percentage >= 80 ? 'text-yellow-600 dark:text-yellow-400' :
                      'text-green-600 dark:text-green-400'
                    }`}>
                      {category.percentage.toFixed(1)}%
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        category.percentage >= 100 ? 'bg-red-500' :
                        category.percentage >= 80 ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(category.percentage, 100)}%` }}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>Spent: {formatAmount(category.spent)}</span>
                    <span>Budget: {formatAmount(category.budgeted)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Budget Summary</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-500/20 rounded-xl">
                <DollarSign className="w-8 h-8 text-blue-500 dark:text-blue-400 mx-auto mb-2" />
                <p className="text-sm text-blue-600 dark:text-blue-400">Total Budgeted</p>
                <p className="text-lg font-bold text-blue-700 dark:text-blue-300">
                  {formatAmount(analytics.totalBudgeted)}
                </p>
              </div>
              
              <div className="text-center p-4 bg-red-50 dark:bg-red-500/20 rounded-xl">
                <TrendingUp className="w-8 h-8 text-red-500 dark:text-red-400 mx-auto mb-2" />
                <p className="text-sm text-red-600 dark:text-red-400">Total Spent</p>
                <p className="text-lg font-bold text-red-700 dark:text-red-300">
                  {formatAmount(analytics.totalSpent)}
                </p>
              </div>
              
              <div className="text-center p-4 bg-green-50 dark:bg-green-500/20 rounded-xl">
                <Target className="w-8 h-8 text-green-500 dark:text-green-400 mx-auto mb-2" />
                <p className="text-sm text-green-600 dark:text-green-400">Remaining</p>
                <p className="text-lg font-bold text-green-700 dark:text-green-300">
                  {formatAmount(analytics.totalBudgeted - analytics.totalSpent)}
                </p>
              </div>
              
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-500/20 rounded-xl">
                <TrendingDown className="w-8 h-8 text-purple-500 dark:text-purple-400 mx-auto mb-2" />
                <p className="text-sm text-purple-600 dark:text-purple-400">Savings Rate</p>
                <p className="text-lg font-bold text-purple-700 dark:text-purple-300">
                  {analytics.totalBudgeted > 0 
                    ? (((analytics.totalBudgeted - analytics.totalSpent) / analytics.totalBudgeted) * 100).toFixed(1)
                    : '0'
                  }%
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200/50 dark:border-slate-700/50">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Over Budget</p>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {analytics.budgetsOverLimit}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Near Limit</p>
                  <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                    {analytics.budgetsNearLimit}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};