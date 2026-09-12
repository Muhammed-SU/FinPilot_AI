import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, CreditCard, Target, Brain, Tag } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();

  const menuItems = [
    { id: 'dashboard', label: t('dashboard'), icon: LayoutDashboard, path: '/dashboard' },
    { id: 'transactions', label: t('transactions'), icon: CreditCard, path: '/transactions' },
    { id: 'budget', label: t('budget'), icon: Target, path: '/budget' },
    { id: 'categories', label: t('categories'), icon: Tag, path: '/categories' },
    { id: 'insights', label: t('aiInsights'), icon: Brain, path: '/insights' }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-gray-200/50 dark:border-slate-700/50 shadow-2xl z-40">
      <div className="px-2 py-2">
        <div className="flex items-center justify-around">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center space-y-1 px-2.5 py-1.5 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-500/30 font-semibold' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[11px] font-medium truncate max-w-[65px]">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};