import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  glass?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  padding = 'md',
  glass = true
}) => {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };
  
  const glassClasses = glass 
    ? 'bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-gray-200/50 dark:border-slate-700/50' 
    : 'bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700';
  
  return (
    <div className={`rounded-2xl shadow-xl ${glassClasses} ${paddingClasses[padding]} ${className}`}>
      {children}
    </div>
  );
};