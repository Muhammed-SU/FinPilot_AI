import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CreditCard, 
  Target, 
  Brain, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Globe,
  Tag
} from 'lucide-react';
import { ThemeToggle } from '../ui/ThemeToggle';
import { LanguageToggle } from '../ui/LanguageToggle';
import { FinPilotLogo } from '../ui/FinPilotLogo';
import { useCurrency } from '../../contexts/CurrencyContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { CurrencySelector } from '../settings/CurrencySelector';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  isCollapsed, 
  onToggleCollapse,
  onLogout 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currency } = useCurrency();
  const { t } = useLanguage();
  const [isCurrencyModalOpen, setIsCurrencyModalOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: t('dashboard'), icon: LayoutDashboard, path: '/dashboard' },
    { id: 'transactions', label: t('transactions'), icon: CreditCard, path: '/transactions' },
    { id: 'budget', label: t('budget'), icon: Target, path: '/budget' },
    { id: 'categories', label: t('categories'), icon: Tag, path: '/categories' },
    { id: 'insights', label: t('aiInsights'), icon: Brain, path: '/insights' }
  ];

  // Get user data from localStorage
  const getUserData = () => {
    try {
      const userData = localStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  };

  const user = getUserData();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  // Redirect to dashboard if on root path
  useEffect(() => {
    if (location.pathname === '/') {
      navigate('/dashboard', { replace: true });
    }
  }, [location.pathname, navigate]);

  return (
    <>
      <div className={`
        fixed left-0 top-0 h-screen z-50
        bg-white/90 dark:bg-slate-900/95 backdrop-blur-xl 
        border-r border-gray-200/30 dark:border-slate-700/30 
        shadow-2xl shadow-black/10 dark:shadow-black/30
        transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'} 
        hidden md:flex flex-col
      `}>
        {/* Header */}
        <div className="h-16 px-3.5 border-b border-gray-200/30 dark:border-slate-700/30 flex items-center justify-between flex-shrink-0">
          {!isCollapsed ? (
            <FinPilotLogo size="sm" />
          ) : (
            <FinPilotLogo size="sm" showText={false} />
          )}
          <button
            onClick={onToggleCollapse}
            className="p-2 rounded-xl hover:bg-gray-100/80 dark:hover:bg-slate-800/80 transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            ) : (
              <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            )}
          </button>
        </div>

        {/* Currency Display / Selector button */}
        {!isCollapsed ? (
          <div className="px-4 py-2.5 border-b border-gray-200/30 dark:border-slate-700/30">
            <button 
              onClick={() => setIsCurrencyModalOpen(true)}
              className="w-full flex items-center justify-between text-xs text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 p-1.5 rounded-lg hover:bg-gray-100/60 dark:hover:bg-slate-800/60 transition-colors"
              title={t('choosePreferredCurrency')}
            >
              <div className="flex items-center space-x-2 truncate">
                <Globe className="w-4 h-4 flex-shrink-0 text-emerald-500" />
                <span className="truncate">{t('currency')}:</span>
              </div>
              <span className="font-semibold bg-gray-100 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-gray-200/50 dark:border-slate-700/50">
                {currency.flag} {currency.code}
              </span>
            </button>
          </div>
        ) : (
          <div className="py-2.5 border-b border-gray-200/30 dark:border-slate-700/30 flex justify-center">
            <button 
              onClick={() => setIsCurrencyModalOpen(true)}
              title={`${t('currency')}: ${currency.name}`}
              className="p-2 rounded-lg hover:bg-gray-100/60 dark:hover:bg-slate-800/60 text-gray-600 dark:text-gray-300"
            >
              <Globe className="w-4 h-4 text-emerald-500" />
            </button>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-3 py-3 min-h-0 overflow-y-auto">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <li key={item.id}>
                  <button
                    onClick={() => navigate(item.path)}
                    className={`
                      w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all duration-300 group
                      ${isActive 
                        ? 'bg-gradient-to-r from-emerald-500/15 to-teal-500/15 dark:from-emerald-500/25 dark:to-teal-500/25 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 dark:border-emerald-500/40 shadow-lg shadow-emerald-500/15 scale-102 font-semibold' 
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-slate-800/80 hover:text-gray-900 dark:hover:text-white hover:scale-101'
                      }
                    `}
                  >
                    <Icon className={`w-5 h-5 flex-shrink-0 transition-all duration-300 ${
                      isActive 
                        ? 'text-emerald-600 dark:text-emerald-400 scale-110' 
                        : 'text-gray-500 dark:text-gray-400 group-hover:scale-105'
                    }`} />
                    {!isCollapsed && (
                      <span className="truncate">{item.label}</span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="px-3 pb-3 flex-shrink-0 space-y-2.5">
          {/* Theme & Language Controls */}
          {!isCollapsed ? (
            <div className="px-2 py-1.5 flex items-center justify-between gap-2 border-t border-b border-gray-200/30 dark:border-slate-700/30">
              <ThemeToggle />
              <LanguageToggle variant="pill" />
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1.5 py-1.5 border-t border-b border-gray-200/30 dark:border-slate-700/30">
              <LanguageToggle variant="button" className="!px-1 !py-1 text-xs" />
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="space-y-1">
            <button 
              onClick={() => setIsCurrencyModalOpen(true)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-slate-800/80 hover:text-gray-900 dark:hover:text-white transition-all duration-300 group ${isCollapsed ? 'justify-center' : ''}`}
            >
              <Settings className="w-5 h-5 flex-shrink-0 group-hover:rotate-90 transition-transform duration-300" />
              {!isCollapsed && <span className="truncate">{t('settings')}</span>}
            </button>
            
            <button 
              onClick={handleLogout}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-red-500 dark:text-red-400 hover:bg-red-50/80 dark:hover:bg-red-500/10 transition-all duration-300 group ${isCollapsed ? 'justify-center' : ''}`}
            >
              <LogOut className="w-5 h-5 flex-shrink-0 group-hover:translate-x-1 transition-transform duration-300" />
              {!isCollapsed && <span className="truncate">{t('logout')}</span>}
            </button>
          </div>

          {/* User Profile */}
          {!isCollapsed && user && (
            <div className="p-2.5 rounded-xl bg-gray-50/80 dark:bg-slate-800/80 border border-gray-200/50 dark:border-slate-700/50 backdrop-blur-md">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                  <span className="text-sm font-bold text-white">
                    {user.name ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase() : 'U'}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {user.name || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {user.email || ''}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Currency Modal */}
      <CurrencySelector 
        isOpen={isCurrencyModalOpen}
        onClose={() => setIsCurrencyModalOpen(false)}
      />
    </>
  );
};