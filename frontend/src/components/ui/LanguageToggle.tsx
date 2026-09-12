import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Globe } from 'lucide-react';

interface LanguageToggleProps {
  className?: string;
  variant?: 'pill' | 'button';
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({ 
  className = '', 
  variant = 'pill' 
}) => {
  const { language, setLanguage, toggleLanguage } = useLanguage();

  if (variant === 'button') {
    return (
      <button
        onClick={toggleLanguage}
        className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-sm font-medium
                   bg-white/50 dark:bg-slate-800/50 backdrop-blur-md 
                   border border-gray-200/50 dark:border-slate-700/50
                   hover:bg-gray-100 dark:hover:bg-slate-700/50
                   text-gray-700 dark:text-gray-200 shadow-sm transition-all duration-300 hover:scale-105 ${className}`}
        title={language === 'en' ? 'Türkçe\'ye geç' : 'Switch to English'}
      >
        <span className="text-base">{language === 'en' ? '🇬🇧' : '🇹🇷'}</span>
        <span className="font-semibold">{language === 'en' ? 'EN' : 'TR'}</span>
      </button>
    );
  }

  return (
    <div 
      className={`inline-flex items-center p-1 rounded-xl bg-gray-100/80 dark:bg-slate-800/80 
                 border border-gray-200/50 dark:border-slate-700/50 backdrop-blur-md ${className}`}
    >
      <button
        type="button"
        onClick={() => setLanguage('en')}
        className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all duration-300 ${
          language === 'en'
            ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/25 scale-100'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
        }`}
        title="English"
      >
        <span>🇬🇧</span>
        <span>EN</span>
      </button>
      <button
        type="button"
        onClick={() => setLanguage('tr')}
        className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all duration-300 ${
          language === 'tr'
            ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-md shadow-red-500/25 scale-100'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
        }`}
        title="Türkçe"
      >
        <span>🇹🇷</span>
        <span>TR</span>
      </button>
    </div>
  );
};
