import React from 'react';

interface LineChartProps {
  data: { month: string; amount: number }[];
  height?: number;
}

export const LineChart: React.FC<LineChartProps> = ({ data, height = 200 }) => {
  const maxValue = Math.max(...data.map(d => d.amount));
  const minValue = Math.min(...data.map(d => d.amount));
  const range = maxValue - minValue;
  
  const width = 400;
  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;
  
  const points = data.map((item, index) => {
    const x = padding + (index / (data.length - 1)) * chartWidth;
    const y = padding + chartHeight - ((item.amount - minValue) / range) * chartHeight;
    return { x, y, ...item };
  });
  
  const pathData = points.map((point, index) => 
    `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
  ).join(' ');
  
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">6-Month Spending Trend</h3>
      <svg width={width} height={height} className="overflow-visible">
        {/* Grid lines */}
        <defs>
          <pattern id="grid" width="40" height="20" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 20" fill="none" stroke="rgba(156, 163, 175, 0.3)" strokeWidth="1"/>
          </pattern>
          <pattern id="grid-dark" width="40" height="20" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 20" fill="none" stroke="rgba(71, 85, 105, 0.3)" strokeWidth="1"/>
          </pattern>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
        <rect width={width} height={height} fill="url(#grid)" className="dark:hidden" />
        <rect width={width} height={height} fill="url(#grid-dark)" className="hidden dark:block" />
        
        {/* Line */}
        <path
          d={pathData}
          fill="none"
          stroke="url(#lineGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="drop-shadow-lg"
        />
        
        {/* Points */}
        {points.map((point, index) => (
          <g key={index}>
            <circle
              cx={point.x}
              cy={point.y}
              r="6"
              fill="url(#lineGradient)"
              className="hover:r-8 transition-all duration-300 drop-shadow-lg"
            />
            <circle
              cx={point.x}
              cy={point.y}
              r="3"
              fill="white"
            />
            <text
              x={point.x}
              y={height - 10}
              textAnchor="middle"
              className="text-xs fill-gray-600 dark:fill-gray-400"
            >
              {point.month}
            </text>
            <text
              x={point.x}
              y={point.y - 15}
              textAnchor="middle"
              className="text-xs fill-gray-700 dark:fill-gray-300 font-medium"
            >
              ${point.amount.toLocaleString()}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};