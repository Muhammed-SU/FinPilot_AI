import React, { useState, useEffect } from 'react';
import { Plus, Settings, TrendingUp, BarChart3, PieChart } from 'lucide-react';
import { StatsCards } from './StatsCards';
import { RecentTransactions } from './RecentTransactions';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { LanguageToggle } from '../ui/LanguageToggle';
import { AddTransactionForm } from '../forms/AddTransactionForm';
import { CurrencySelector, useCurrency } from '../settings/CurrencySelector';
import { useLanguage } from '../../contexts/LanguageContext';
import { AdvancedLineChart } from '../charts/AdvancedLineChart';
import { CategoryBreakdownChart } from '../charts/CategoryBreakdownChart';
import { SpendingTrendChart } from '../charts/SpendingTrendChart';
import { MonthlyComparisonChart } from '../charts/MonthlyComparisonChart';
import { Transaction, getTransactions } from '../services/transactionService';
import { refreshBudgets } from '../services/budgetService';

export const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const [isCurrencySelectorOpen, setIsCurrencySelectorOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');
  const { currency, updateCurrency, formatAmount } = useCurrency();
  const { t } = useLanguage();

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const data = await getTransactions();
      setTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Generate financial trend data from real transactions
  const generateFinancialTrendData = () => {
    const now = new Date();
    const data = [];
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now);
      date.setMonth(date.getMonth() - i);
      
      const monthTransactions = transactions.filter(t => {
        const tDate = new Date(t.date);
        return tDate.getMonth() === date.getMonth() && 
               tDate.getFullYear() === date.getFullYear();
      });
      
      const income = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
      
      const expense = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
      
      data.push({
        date: date.toISOString().split('T')[0],
        income,
        expense,
        balance: income - expense
      });
    }
    
    return data;
  };

  // Calculate real totals from transactions
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const totalBalance = totalIncome - totalExpenses;

  const handleTransactionSuccess = async () => {
    // Refresh transactions list
    await fetchTransactions();
    // Also trigger budget refresh since transactions affect budget spending
    try {
      await refreshBudgets();
    } catch (error) {
      console.warn('Failed to refresh budgets:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('dashboard')}</h1>
            <p className="text-gray-600 dark:text-gray-300">{t('loading')}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-gray-200/50 dark:border-slate-700/50 rounded-2xl p-6 animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const financialTrendData = generateFinancialTrendData();

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('dashboard')}</h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm truncate">
            {t('dashboardSubtitle')}
          </p>
        </div>
        <div className="flex items-center flex-wrap gap-2.5 flex-shrink-0">
          {/* Language Toggle in Header */}
          <LanguageToggle variant="pill" />

          {/* Currency Button */}
          <Button 
            variant="glass" 
            size="sm"
            onClick={() => setIsCurrencySelectorOpen(true)}
            title={t('choosePreferredCurrency')}
          >
            <Settings className="w-4 h-4 mr-2" />
            <span className="font-semibold">{currency.flag} {currency.code}</span>
          </Button>

          {/* Add Transaction Button */}
          <Button 
            onClick={() => setIsAddTransactionOpen(true)}
            className="hidden md:flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>{t('addTransaction')}</span>
          </Button>
        </div>

        {/* Mobile floating action button */}
        <button 
          onClick={() => setIsAddTransactionOpen(true)}
          className="md:hidden fixed bottom-20 right-4 w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300 z-30 backdrop-blur-md border border-white/20"
          title={t('addTransaction')}
        >
          <Plus className="w-6 h-6 text-white" />
        </button>
      </div>

      <StatsCards 
        totalBalance={totalBalance}
        totalIncome={totalIncome}
        totalExpenses={totalExpenses}
        formatAmount={formatAmount}
      />

      {/* Advanced Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card className="overflow-hidden">
          <div className="p-6">
            <AdvancedLineChart 
              data={financialTrendData}
              title={t('financialTrend')}
              showBalance={true}
              height={280}
              formatAmount={formatAmount}
            />
          </div>
        </Card>

        <Card className="overflow-hidden">
          <div className="p-6">
            <CategoryBreakdownChart 
              transactions={transactions}
              type="expense"
              title={t('expenseCategories')}
              formatAmount={formatAmount}
            />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card className="overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('spendingTrend')}</h3>
              <div className="flex items-center space-x-1">
                {(['week', 'month', 'year'] as const).map((period) => (
                  <button
                    key={period}
                    onClick={() => setSelectedPeriod(period)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-300 ${
                      selectedPeriod === period
                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/25'
                        : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {t(period)}
                  </button>
                ))}
              </div>
            </div>
            <SpendingTrendChart 
              transactions={transactions}
              period={selectedPeriod}
              title=""
              formatAmount={formatAmount}
            />
          </div>
        </Card>

        <Card className="overflow-hidden">
          <div className="p-6">
            <MonthlyComparisonChart 
              transactions={transactions}
              title={t('monthlyComparison')}
              formatAmount={formatAmount}
            />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2 overflow-hidden">
          <div className="p-6">
            <CategoryBreakdownChart 
              transactions={transactions}
              type="income"
              title={t('income')}
              formatAmount={formatAmount}
            />
          </div>
        </Card>

        <Card>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t('actions')} & {t('overview')}
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-500/20 rounded-xl">
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <TrendingUp className="w-5 h-5 text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {t('transactions')} ({t('month')})
                  </span>
                </div>
                <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                  {transactions.filter(t => {
                    const tDate = new Date(t.date);
                    const now = new Date();
                    return tDate.getMonth() === now.getMonth() && 
                           tDate.getFullYear() === now.getFullYear();
                  }).length}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-500/20 rounded-xl">
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <BarChart3 className="w-5 h-5 text-green-500 dark:text-green-400 flex-shrink-0" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {t('totalIncome')}
                  </span>
                </div>
                <span className="text-lg font-bold text-green-600 dark:text-green-400 flex-shrink-0">
                  {formatAmount(totalIncome)}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-500/20 rounded-xl">
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <PieChart className="w-5 h-5 text-purple-500 dark:text-purple-400 flex-shrink-0" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {t('categories')}
                  </span>
                </div>
                <span className="text-lg font-bold text-purple-600 dark:text-purple-400 flex-shrink-0">
                  {new Set(transactions.map(t => t.category)).size}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-500/20 rounded-xl">
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <span className="text-lg flex-shrink-0">💰</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {t('savingsRate')}
                  </span>
                </div>
                <span className="text-lg font-bold text-orange-600 dark:text-orange-400 flex-shrink-0">
                  {totalIncome > 0 ? ((totalBalance / totalIncome) * 100).toFixed(1) : '0'}%
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <RecentTransactions transactions={transactions} formatAmount={formatAmount} />

      <AddTransactionForm
        isOpen={isAddTransactionOpen}
        onClose={() => setIsAddTransactionOpen(false)}
        onSuccess={handleTransactionSuccess}
      />

      <CurrencySelector
        isOpen={isCurrencySelectorOpen}
        onClose={() => setIsCurrencySelectorOpen(false)}
        currentCurrency={currency}
        onCurrencyChange={updateCurrency}
      />
    </div>
  );
};