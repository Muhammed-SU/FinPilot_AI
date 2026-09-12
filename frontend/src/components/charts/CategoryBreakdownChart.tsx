import React from 'react';
import { Transaction } from '../services/transactionService';

interface CategoryData {
  category: string;
  amount: number;
  percentage: number;
  color: string;
  count: number;
}

interface CategoryBreakdownChartProps {
  transactions: Transaction[];
  type: 'income' | 'expense';
  title?: string;
  formatAmount?: (amount: number) => string;
}

const categoryColors = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
  '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1',
  '#14B8A6', '#F43F5E', '#8B5A2B', '#059669', '#7C3AED'
];

export const CategoryBreakdownChart: React.FC<CategoryBreakdownChartProps> = ({
  transactions,
  type,
  title,
  formatAmount = (amount) => `$${amount.toLocaleString()}`
}) => {
  const filteredTransactions = transactions.filter(t => t.type === type);
  
  if (filteredTransactions.length === 0) {
    return (
      <div className="w-full">
        {title && (
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 truncate">{title}</h3>
        )}
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">
            No {type} transactions found
          </p>
        </div>
      </div>
    );
  }

  // Group transactions by category
  const categoryMap = new Map<string, { amount: number; count: number }>();
  
  filteredTransactions.forEach(transaction => {
    const category = transaction.category;
    const amount = Math.abs(transaction.amount);
    
    if (categoryMap.has(category)) {
      const existing = categoryMap.get(category)!;
      categoryMap.set(category, {
        amount: existing.amount + amount,
        count: existing.count + 1
      });
    } else {
      categoryMap.set(category, { amount, count: 1 });
    }
  });

  const totalAmount = Array.from(categoryMap.values()).reduce((sum, { amount }) => sum + amount, 0);

  const categoryData: CategoryData[] = Array.from(categoryMap.entries())
    .map(([category, { amount, count }], index) => ({
      category,
      amount,
      count,
      percentage: (amount / totalAmount) * 100,
      color: categoryColors[index % categoryColors.length]
    }))
    .sort((a, b) => b.amount - a.amount);

  const size = 240; // Increased size for better visibility
  const center = size / 2;
  const radius = size * 0.4;
  
  let cumulativePercentage = 0;
  
  const createPath = (percentage: number, startPercentage: number) => {
    const startAngle = (startPercentage * 3.6) - 90;
    const endAngle = ((startPercentage + percentage) * 3.6) - 90;
    
    const startAngleRad = (startAngle * Math.PI) / 180;
    const endAngleRad = (endAngle * Math.PI) / 180;
    
    const x1 = center + radius * Math.cos(startAngleRad);
    const y1 = center + radius * Math.sin(startAngleRad);
    const x2 = center + radius * Math.cos(endAngleRad);
    const y2 = center + radius * Math.sin(endAngleRad);
    
    const largeArcFlag = percentage > 50 ? 1 : 0;
    
    return `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  };

  return (
    <div className="w-full space-y-4">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">{title}</h3>
      )}
      
      <div className="flex flex-col lg:flex-row items-center space-y-6 lg:space-y-0 lg:space-x-8">
        {/* Pie Chart */}
        <div className="relative flex-shrink-0">
          <svg width={size} height={size} className="transform -rotate-90 drop-shadow-lg">
            {categoryData.map((item, index) => {
              const path = createPath(item.percentage, cumulativePercentage);
              cumulativePercentage += item.percentage;
              
              return (
                <path
                  key={index}
                  d={path}
                  fill={item.color}
                  className="hover:opacity-80 transition-all duration-300 cursor-pointer"
                  style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
                />
              );
            })}
            
            {/* Inner circle for donut effect */}
            <circle
              cx={center}
              cy={center}
              r={radius * 0.55}
              fill="white"
              className="dark:fill-slate-800"
            />
          </svg>
          
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              {formatAmount(totalAmount)}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
              Total {type}
            </div>
          </div>
        </div>
        
        {/* Legend */}
        <div className="flex-1 w-full min-w-0">
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {categoryData.slice(0, 8).map((item, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <div 
                    className="w-4 h-4 rounded-full shadow-sm flex-shrink-0" 
                    style={{ backgroundColor: item.color }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {item.category}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {item.count} transaction{item.count > 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-3">
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">
                    {formatAmount(item.amount)}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {item.percentage.toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
            {categoryData.length > 8 && (
              <div className="text-center py-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  +{categoryData.length - 8} more categories
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};