import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative w-14 h-7 rounded-full p-1 transition-all duration-300 ease-in-out
                 bg-gray-200 dark:bg-slate-700 border border-gray-300 dark:border-slate-600
                 hover:bg-gray-300 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 
                 focus:ring-emerald-500/50 focus:ring-offset-2 focus:ring-offset-transparent"
    >
      <div
        className={`w-5 h-5 rounded-full transition-all duration-300 ease-in-out flex items-center justify-center shadow-md
                   ${isDark 
                     ? 'translate-x-7 bg-slate-800 text-yellow-400' 
                     : 'translate-x-0 bg-yellow-400 text-slate-800'
                   }`}
      >
        {isDark ? (
          <Moon className="w-3 h-3" />
        ) : (
          <Sun className="w-3 h-3" />
        )}
      </div>
    </button>
  );
};