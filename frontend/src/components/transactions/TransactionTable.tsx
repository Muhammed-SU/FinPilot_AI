import React, { useState, useEffect } from 'react';
import { Search, Filter, ArrowUpDown, ArrowUpRight, ArrowDownLeft, Edit3, Trash2, Plus } from 'lucide-react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { AddTransactionForm } from '../forms/AddTransactionForm';
import { EditTransactionForm } from '../forms/EditTransactionForm';
import { Transaction, getTransactions, deleteTransaction } from '../services/transactionService';
import { useCurrency } from '../../contexts/CurrencyContext';
import { useLanguage } from '../../contexts/LanguageContext';

export const TransactionTable: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'title'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([]);
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const [isEditTransactionOpen, setIsEditTransactionOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const { formatAmount } = useCurrency();
  const { t, language } = useLanguage();

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

  const categories = ['all', ...Array.from(new Set(transactions.map(t => t.category)))];

  const filteredTransactions = transactions
    .filter(transaction => {
      const matchesSearch = transaction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || transaction.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      let aValue: any = a[sortBy];
      let bValue: any = b[sortBy];
      
      if (sortBy === 'amount') {
        aValue = Math.abs(aValue);
        bValue = Math.abs(bValue);
      }
      
      if (sortBy === 'date') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const handleSort = (column: 'date' | 'amount' | 'title') => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('desc');
    }
  };

  const handleSelectTransaction = (id: string) => {
    setSelectedTransactions(prev => 
      prev.includes(id) 
        ? prev.filter(t => t !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedTransactions.length === filteredTransactions.length) {
      setSelectedTransactions([]);
    } else {
      setSelectedTransactions(filteredTransactions.map(t => t._id || t.id || ''));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedTransactions.length === 0) return;
    
    try {
      await Promise.all(selectedTransactions.map(id => deleteTransaction(id)));
      setSelectedTransactions([]);
      fetchTransactions();
    } catch (error) {
      console.error('Error deleting transactions:', error);
    }
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsEditTransactionOpen(true);
  };

  const handleDeleteTransaction = async (id: string) => {
    try {
      await deleteTransaction(id);
      fetchTransactions();
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const handleTransactionSuccess = () => {
    fetchTransactions();
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('transactions')}</h1>
            <p className="text-gray-600 dark:text-gray-300">{t('loading')}</p>
          </div>
        </div>
        <Card>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-gray-200 dark:bg-slate-700 rounded-xl"></div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('transactions')}</h1>
          <p className="text-gray-600 dark:text-gray-300">{t('manageTransactions')}</p>
        </div>
        <Button onClick={() => setIsAddTransactionOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          {t('addTransaction')}
        </Button>
      </div>

      <Card>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex-1 max-w-md">
            <Input
              placeholder={t('searchTransactions')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-5 h-5 text-gray-400" />}
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300/50 dark:border-slate-600/50 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-md text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
            >
              {categories.map(category => (
                <option key={category} value={category} className="bg-white dark:bg-slate-800 text-gray-900 dark:text-white">
                  {category === 'all' ? t('allCategories') : category}
                </option>
              ))}
            </select>
            
            <Button variant="glass" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              {t('filter')}
            </Button>
          </div>
        </div>

        {selectedTransactions.length > 0 && (
          <div className="bg-blue-50 dark:bg-blue-500/20 border border-blue-200 dark:border-blue-500/30 rounded-xl p-4 mb-6 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <span className="text-blue-800 dark:text-blue-300 font-medium text-sm">
                {selectedTransactions.length} {t('transactions')} {t('showing')}
              </span>
              <div className="flex items-center space-x-2">
                <Button variant="glass" size="sm" onClick={handleDeleteSelected}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  {t('delete')}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200/50 dark:border-slate-700/50">
                <th className="text-left py-3 px-4">
                  <input
                    type="checkbox"
                    checked={selectedTransactions.length === filteredTransactions.length && filteredTransactions.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-blue-600 focus:ring-blue-500/50 focus:ring-offset-0"
                  />
                </th>
                <th className="text-left py-3 px-4">
                  <button
                    onClick={() => handleSort('date')}
                    className="flex items-center space-x-1 font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    <span>{t('date')}</span>
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="text-left py-3 px-4">
                  <button
                    onClick={() => handleSort('title')}
                    className="flex items-center space-x-1 font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    <span>{t('description')}</span>
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-200">{t('category')}</th>
                <th className="text-left py-3 px-4">
                  <button
                    onClick={() => handleSort('amount')}
                    className="flex items-center space-x-1 font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    <span>{t('amount')}</span>
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-200">{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction) => {
                const transactionId = transaction._id || transaction.id || '';
                return (
                  <tr key={transactionId} className="border-b border-gray-100/50 dark:border-slate-700/50 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-4 px-4">
                      <input
                        type="checkbox"
                        checked={selectedTransactions.includes(transactionId)}
                        onChange={() => handleSelectTransaction(transactionId)}
                        className="rounded border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-blue-600 focus:ring-blue-500/50 focus:ring-offset-0"
                      />
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-900 dark:text-gray-100">
                      {new Date(transaction.date).toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US')}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/20 dark:border-slate-600/30 ${
                          transaction.type === 'income' ? 'bg-green-50 dark:bg-green-500/20 text-green-600 dark:text-green-400' : 'bg-red-50 dark:bg-red-500/20 text-red-600 dark:text-red-400'
                        }`}>
                          {transaction.type === 'income' ? (
                            <ArrowUpRight className="w-4 h-4" />
                          ) : (
                            <ArrowDownLeft className="w-4 h-4" />
                          )}
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">{transaction.title}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-300">{transaction.category}</td>
                    <td className="py-4 px-4">
                      <span className={`font-semibold ${
                        transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}{formatAmount(Math.abs(transaction.amount))}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleEditTransaction(transaction)}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                          title={t('edit')}
                        >
                          <Edit3 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </button>
                        <button 
                          onClick={() => handleDeleteTransaction(transactionId)}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                          title={t('delete')}
                        >
                          <Trash2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile List */}
        <div className="md:hidden space-y-3">
          {filteredTransactions.map((transaction) => {
            const transactionId = transaction._id || transaction.id || '';
            return (
              <div key={transactionId} className="bg-gray-50 dark:bg-slate-800/50 rounded-xl p-4 backdrop-blur-md border border-gray-200/50 dark:border-slate-700/50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={selectedTransactions.includes(transactionId)}
                      onChange={() => handleSelectTransaction(transactionId)}
                      className="rounded border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-blue-600 focus:ring-blue-500/50 focus:ring-offset-0"
                    />
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/20 dark:border-slate-600/30 ${
                      transaction.type === 'income' ? 'bg-green-50 dark:bg-green-500/20 text-green-600 dark:text-green-400' : 'bg-red-50 dark:bg-red-500/20 text-red-600 dark:text-red-400'
                    }`}>
                      {transaction.type === 'income' ? (
                        <ArrowUpRight className="w-4 h-4" />
                      ) : (
                        <ArrowDownLeft className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{transaction.title}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{transaction.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => handleEditTransaction(transaction)}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                      title={t('edit')}
                    >
                      <Edit3 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </button>
                    <button 
                      onClick={() => handleDeleteTransaction(transactionId)}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                      title={t('delete')}
                    >
                      <Trash2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(transaction.date).toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US')}
                  </span>
                  <span className={`font-semibold ${
                    transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}{formatAmount(Math.abs(transaction.amount))}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">{t('noTransactionsFound')}</p>
          </div>
        )}
      </Card>

      <AddTransactionForm
        isOpen={isAddTransactionOpen}
        onClose={() => setIsAddTransactionOpen(false)}
        onSuccess={handleTransactionSuccess}
      />

      <EditTransactionForm
        isOpen={isEditTransactionOpen}
        onClose={() => {
          setIsEditTransactionOpen(false);
          setEditingTransaction(null);
        }}
        onSuccess={handleTransactionSuccess}
        transaction={editingTransaction}
      />
    </div>
  );
};