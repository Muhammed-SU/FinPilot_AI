import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ 
  label, 
  error, 
  icon, 
  className = '', 
  ...props 
}) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <input
          className={`
            block w-full rounded-xl border border-gray-300/50 dark:border-slate-600/50 px-3 py-2.5 
            text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400
            bg-white/50 dark:bg-slate-800/50 backdrop-blur-md
            focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/50 
            focus:ring-offset-2 focus:ring-offset-transparent focus:outline-none 
            transition-all duration-300
            ${icon ? 'pl-10' : ''}
            ${error ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/50' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};