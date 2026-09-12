import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface DataPoint {
  date: string;
  income: number;
  expense: number;
  balance: number;
}

interface AdvancedLineChartProps {
  data: DataPoint[];
  height?: number;
  showBalance?: boolean;
  title?: string;
  formatAmount?: (value: number) => string;
}

export const AdvancedLineChart: React.FC<AdvancedLineChartProps> = ({ 
  data, 
  height = 280, 
  showBalance = true,
  title = "Financial Trend",
  formatAmount
}) => {
  if (!data || data.length === 0) return null;  

  const maxIncome = Math.max(...data.map(d => d.income));
  const maxExpense = Math.max(...data.map(d => Math.abs(d.expense)));
  const maxBalance = Math.max(...data.map(d => Math.abs(d.balance)));
  const minBalance = Math.min(...data.map(d => d.balance));
  
  const maxValue = Math.max(maxIncome, maxExpense, maxBalance);
  const minValue = Math.min(0, minBalance);
  const range = maxValue - minValue;
  
  // Increased padding for better label visibility
  const padding = 80;
  const chartWidth = 100 - (padding * 2 / 5);
  const chartHeight = height - padding * 2;
  
  const getY = (value: number) => {
    return padding + chartHeight - ((value - minValue) / range) * chartHeight;
  };
  
  const getX = (index: number, totalWidth: number) => {
    const usableWidth = totalWidth - padding * 2;
    return padding + (index / (data.length - 1)) * usableWidth;
  };

  const latestData = data[data.length - 1];
  const previousData = data[data.length - 2];
  const balanceChange = latestData && previousData ? latestData.balance - previousData.balance : 0;
  const balanceChangePercent = previousData && previousData.balance !== 0 
    ? ((balanceChange / Math.abs(previousData.balance)) * 100).toFixed(1)
    : '0';

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">{title}</h3>
        {latestData && (
          <div className="flex items-center space-x-2 flex-shrink-0">
            <div className={`flex items-center space-x-1 text-sm ${
              balanceChange >= 0 ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'
            }`}>
              {balanceChange >= 0 ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span className="whitespace-nowrap">{balanceChangePercent}%</span>
            </div>
          </div>
        )}
      </div>

      <div className="w-full overflow-hidden">
        <div className="w-full" style={{ minWidth: '500px' }}>
          <svg 
            width="100%" 
            height={height} 
            viewBox={`0 0 600 ${height}`}
            preserveAspectRatio="xMidYMid meet"
            className="w-full h-auto"
          >
            <defs>
              <linearGradient id="incomeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0.05" />
              </linearGradient>
              <linearGradient id="expenseGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#EF4444" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#EF4444" stopOpacity="0.05" />
              </linearGradient>
              <linearGradient id="balanceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#059669" stopOpacity="0.05" />
              </linearGradient>
              
              <pattern id="grid" width="50" height="40" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 40" fill="none" stroke="rgba(156, 163, 175, 0.2)" strokeWidth="1"/>
              </pattern>
            </defs>

            {/* Grid background */}
            <rect width="600" height={height} fill="url(#grid)" />

            {/* Zero line */}
            <line
              x1={padding}
              y1={getY(0)}
              x2={600 - padding}
              y2={getY(0)}
              stroke="rgba(107, 114, 128, 0.3)"
              strokeWidth="1"
              strokeDasharray="5,5"
            />

            {/* Generate paths */}
            {(() => {
              const incomePoints = data.map((item, index) => ({
                x: getX(index, 600),
                y: getY(item.income),
                value: item.income,
                date: item.date
              }));

              const expensePoints = data.map((item, index) => ({
                x: getX(index, 600),
                y: getY(Math.abs(item.expense)),
                value: Math.abs(item.expense),
                date: item.date
              }));

              const balancePoints = data.map((item, index) => ({
                x: getX(index, 600),
                y: getY(item.balance),
                value: item.balance,
                date: item.date
              }));

              const createPath = (points: typeof incomePoints) => {
                return points.map((point, index) => 
                  `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
                ).join(' ');
              };

              const createArea = (points: typeof incomePoints) => {
                const pathData = createPath(points);
                const firstPoint = points[0];
                const lastPoint = points[points.length - 1];
                return `${pathData} L ${lastPoint.x} ${getY(0)} L ${firstPoint.x} ${getY(0)} Z`;
              };

              return (
                <>
                  {/* Areas */}
                  <path d={createArea(incomePoints)} fill="url(#incomeGradient)" />
                  <path d={createArea(expensePoints)} fill="url(#expenseGradient)" />
                  {showBalance && <path d={createArea(balancePoints)} fill="url(#balanceGradient)" />}

                  {/* Lines */}
                  <path
                    d={createPath(incomePoints)}
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d={createPath(expensePoints)}
                    fill="none"
                    stroke="#EF4444"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {showBalance && (
                    <path
                      d={createPath(balancePoints)}
                      fill="none"
                      stroke="#059669"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  )}

                  {/* Data points */}
                  {incomePoints.map((point, index) => (
                    <circle
                      key={`income-${index}`}
                      cx={point.x}
                      cy={point.y}
                      r="4"
                      fill="#10B981"
                      className="hover:r-6 transition-all duration-300 cursor-pointer"
                    />
                  ))}

                  {expensePoints.map((point, index) => (
                    <circle
                      key={`expense-${index}`}
                      cx={point.x}
                      cy={point.y}
                      r="4"
                      fill="#EF4444"
                      className="hover:r-6 transition-all duration-300 cursor-pointer"
                    />
                  ))}

                  {showBalance && balancePoints.map((point, index) => (
                    <circle
                      key={`balance-${index}`}
                      cx={point.x}
                      cy={point.y}
                      r="4"
                      fill="#059669"
                      className="hover:r-6 transition-all duration-300 cursor-pointer"
                    />
                  ))}

                  {/* X-axis labels */}
                  {data.map((item, index) => (
                    <text
                      key={index}
                      x={getX(index, 600)}
                      y={height - 15}
                      textAnchor="middle"
                      className="text-xs fill-gray-600 dark:fill-gray-400"
                    >
                      {new Date(item.date).toLocaleDateString('en-US', { month: 'short' })}
                    </text>
                  ))}

                  {/* Y-axis labels with better spacing */}
                  {[0, maxValue * 0.25, maxValue * 0.5, maxValue * 0.75, maxValue].map((value, index) => (
                    <text
                      key={index}
                      x={padding - 10}
                      y={getY(value)}
                      textAnchor="end"
                      className="text-xs fill-gray-600 dark:fill-gray-400"
                      dominantBaseline="middle"
                    >
                      {formatAmount ? formatAmount(value) : `${(value / 1000).toFixed(0)}k`}
                    </text>
                  ))}
                </>
              );
            })()}
          </svg>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center space-x-4 mt-4 flex-wrap">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600 dark:text-gray-300">Income</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-sm text-gray-600 dark:text-gray-300">Expenses</span>
          </div>
          {showBalance && (
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600 dark:text-gray-300">Balance</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};