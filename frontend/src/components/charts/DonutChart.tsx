import React from 'react';
import { ChartData } from '../../types';

interface DonutChartProps {
  data: ChartData[];
  size?: number;
}

export const DonutChart: React.FC<DonutChartProps> = ({ data, size = 200 }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const center = size / 2;
  const radius = size * 0.35;
  const strokeWidth = 30;
  
  let cumulativePercentage = 0;
  
  const createPath = (percentage: number, cumulativePercentage: number) => {
    const startAngle = cumulativePercentage * 3.6 - 90;
    const endAngle = (cumulativePercentage + percentage) * 3.6 - 90;
    
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
    <div className="flex items-center space-x-8">
      <div className="relative">
        <svg width={size} height={size} className="transform -rotate-90 drop-shadow-lg">
          {data.map((item, index) => {
            const percentage = (item.value / total) * 100;
            const path = createPath(percentage, cumulativePercentage);
            cumulativePercentage += percentage;
            
            return (
              <path
                key={index}
                d={path}
                fill={item.color}
                className="hover:opacity-80 transition-all duration-300 hover:drop-shadow-lg"
                style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))' }}
              />
            );
          })}
          {/* Inner circle to create donut effect */}
          <circle
            cx={center}
            cy={center}
            r={radius - strokeWidth}
            fill="transparent"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-2xl font-semibold text-gray-900 dark:text-white">
            ${total.toLocaleString()}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Total Expenses</div>
        </div>
      </div>
      
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
            <div 
              className="w-3 h-3 rounded-full shadow-lg" 
              style={{ backgroundColor: item.color }}
            />
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900 dark:text-white">{item.label}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                ${item.value.toLocaleString()} ({((item.value / total) * 100).toFixed(1)}%)
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};