import React from 'react';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { Card } from '../ui/Card';
import { useLanguage } from '../../contexts/LanguageContext';

interface StatsCardsProps {
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
  formatAmount: (amount: number) => string;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ 
  totalBalance, 
  totalIncome, 
  totalExpenses,
  formatAmount
}) => {
  const { t } = useLanguage();

  const stats = [
    {
      title: t('totalBalance'),
      value: totalBalance,
      icon: Wallet,
      color: totalBalance >= 0 ? 'text-emerald-500 dark:text-emerald-400' : 'text-red-500 dark:text-red-400',
      bgColor: totalBalance >= 0 ? 'bg-emerald-50 dark:bg-emerald-500/20' : 'bg-red-50 dark:bg-red-500/20',
      change: '+2.5%',
      changeType: 'positive' as const
    },
    {
      title: t('totalIncome'),
      value: totalIncome,
      icon: TrendingUp,
      color: 'text-green-500 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-500/20',
      change: '+12.3%',
      changeType: 'positive' as const
    },
    {
      title: t('totalExpenses'),
      value: totalExpenses,
      icon: TrendingDown,
      color: 'text-red-500 dark:text-red-400',
      bgColor: 'bg-red-50 dark:bg-red-500/20',
      change: '-5.1%',
      changeType: 'negative' as const
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        
        return (
          <Card key={index} className="hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatAmount(Math.abs(stat.value))}
                </p>
                <div className={`flex items-center mt-2 text-sm ${
                  stat.changeType === 'positive' ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'
                }`}>
                  {stat.changeType === 'positive' ? (
                    <TrendingUp className="w-4 h-4 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 mr-1" />
                  )}
                  <span>{stat.change} {t('fromLastMonth')}</span>
                </div>
              </div>
              <div className={`w-12 h-12 rounded-2xl ${stat.bgColor} flex items-center justify-center backdrop-blur-md border border-white/20 dark:border-slate-600/30`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};