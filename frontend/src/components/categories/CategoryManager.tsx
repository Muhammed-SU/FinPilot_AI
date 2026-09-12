import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, Tag, Palette, Eye, EyeOff } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { AddCategoryForm } from '../forms/AddCategoryForm';
import { EditCategoryForm } from '../forms/EditCategoryForm';
import { 
  Category, 
  getCategories, 
  deleteCategory, 
  clearCategoryCache 
} from '../services/categoryService';
import { useLanguage } from '../../contexts/LanguageContext';

export const CategoryManager: React.FC = () => {
  const { t } = useLanguage();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [showInactive, setShowInactive] = useState(false);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || category.type === filterType || category.type === 'both';
    const matchesActive = showInactive || category.isActive;
    return matchesSearch && matchesType && matchesActive;
  });

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setIsEditFormOpen(true);
  };

  const handleDeleteCategory = async (id: string, isDefault: boolean) => {
    if (isDefault) {
      alert('Default categories cannot be deleted');
      return;
    }

    if (confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteCategory(id);
        clearCategoryCache();
        fetchCategories();
      } catch (error) {
        console.error('Error deleting category:', error);
        alert('Failed to delete category');
      }
    }
  };

  const handleFormSuccess = () => {
    clearCategoryCache();
    fetchCategories();
  };

  const groupedCategories = {
    income: filteredCategories.filter(cat => cat.type === 'income' || cat.type === 'both'),
    expense: filteredCategories.filter(cat => cat.type === 'expense' || cat.type === 'both'),
    both: filteredCategories.filter(cat => cat.type === 'both')
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('categoryManagement')}</h1>
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('categoryManagement')}</h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            {t('categorySubtitle')}
          </p>
        </div>
        <Button onClick={() => setIsAddFormOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          {t('addCategory')}
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1 max-w-md">
            <Input
              placeholder={t('search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Tag className="w-5 h-5 text-gray-400" />}
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-3 py-2 border border-gray-300/50 dark:border-slate-600/50 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-md text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50"
            >
              <option value="all">{t('allTypes')}</option>
              <option value="income">{t('income')}</option>
              <option value="expense">{t('expense')}</option>
            </select>
            
            <button
              onClick={() => setShowInactive(!showInactive)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                showInactive
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/25'
                  : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700'
              }`}
            >
              {showInactive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              <span>Show Inactive</span>
            </button>
          </div>
        </div>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Categories</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {categories.filter(cat => cat.isActive).length}
              </p>
            </div>
            <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-500/20 rounded-xl flex items-center justify-center">
              <Tag className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Income Categories</p>
              <p className="text-xl font-bold text-green-600 dark:text-green-400">
                {categories.filter(cat => (cat.type === 'income' || cat.type === 'both') && cat.isActive).length}
              </p>
            </div>
            <div className="w-10 h-10 bg-green-50 dark:bg-green-500/20 rounded-xl flex items-center justify-center">
              <Tag className="w-5 h-5 text-green-500 dark:text-green-400" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Expense Categories</p>
              <p className="text-xl font-bold text-red-600 dark:text-red-400">
                {categories.filter(cat => (cat.type === 'expense' || cat.type === 'both') && cat.isActive).length}
              </p>
            </div>
            <div className="w-10 h-10 bg-red-50 dark:bg-red-500/20 rounded-xl flex items-center justify-center">
              <Tag className="w-5 h-5 text-red-500 dark:text-red-400" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Custom Categories</p>
              <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
                {categories.filter(cat => !cat.isDefault && cat.isActive).length}
              </p>
            </div>
            <div className="w-10 h-10 bg-purple-50 dark:bg-purple-500/20 rounded-xl flex items-center justify-center">
              <Palette className="w-5 h-5 text-purple-500 dark:text-purple-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Categories List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income Categories */}
        <Card>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Income Categories ({groupedCategories.income.length})
            </h3>
            
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {groupedCategories.income.map((category) => (
                <div
                  key={category._id || category.id}
                  className={`flex items-center justify-between p-3 rounded-xl transition-all duration-300 ${
                    category.isActive 
                      ? 'bg-gray-50 dark:bg-slate-800/50 hover:bg-gray-100 dark:hover:bg-slate-800' 
                      : 'bg-gray-100 dark:bg-slate-700/50 opacity-60'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    <div 
                      className="w-4 h-4 rounded-full shadow-lg flex-shrink-0" 
                      style={{ backgroundColor: category.color }}
                    />
                    <div className="min-w-0 flex-1">
                      <p className={`font-medium truncate ${
                        category.isActive ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {category.name}
                      </p>
                      <div className="flex items-center space-x-2 text-xs">
                        {category.isDefault && (
                          <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 rounded-md">
                            Default
                          </span>
                        )}
                        {category.type === 'both' && (
                          <span className="px-2 py-1 bg-teal-100 dark:bg-teal-500/20 text-teal-700 dark:text-teal-300 rounded-md">
                            Both
                          </span>
                        )}
                        {!category.isActive && (
                          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-500/20 text-gray-600 dark:text-gray-400 rounded-md">
                            Inactive
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 flex-shrink-0">
                    <button
                      onClick={() => handleEditCategory(category)}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                      title="Edit category"
                    >
                      <Edit3 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </button>
                    {!category.isDefault && (
                      <button
                        onClick={() => handleDeleteCategory(category._id || category.id || '', category.isDefault)}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                        title="Delete category"
                      >
                        <Trash2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              
              {groupedCategories.income.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">No income categories found</p>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Expense Categories */}
        <Card>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
              Expense Categories ({groupedCategories.expense.length})
            </h3>
            
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {groupedCategories.expense.map((category) => (
                <div
                  key={category._id || category.id}
                  className={`flex items-center justify-between p-3 rounded-xl transition-all duration-300 ${
                    category.isActive 
                      ? 'bg-gray-50 dark:bg-slate-800/50 hover:bg-gray-100 dark:hover:bg-slate-800' 
                      : 'bg-gray-100 dark:bg-slate-700/50 opacity-60'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    <div 
                      className="w-4 h-4 rounded-full shadow-lg flex-shrink-0" 
                      style={{ backgroundColor: category.color }}
                    />
                    <div className="min-w-0 flex-1">
                      <p className={`font-medium truncate ${
                        category.isActive ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {category.name}
                      </p>
                      <div className="flex items-center space-x-2 text-xs">
                        {category.isDefault && (
                          <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 rounded-md">
                            Default
                          </span>
                        )}
                        {category.type === 'both' && (
                          <span className="px-2 py-1 bg-teal-100 dark:bg-teal-500/20 text-teal-700 dark:text-teal-300 rounded-md">
                            Both
                          </span>
                        )}
                        {!category.isActive && (
                          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-500/20 text-gray-600 dark:text-gray-400 rounded-md">
                            Inactive
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 flex-shrink-0">
                    <button
                      onClick={() => handleEditCategory(category)}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                      title="Edit category"
                    >
                      <Edit3 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </button>
                    {!category.isDefault && (
                      <button
                        onClick={() => handleDeleteCategory(category._id || category.id || '', category.isDefault)}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                        title="Delete category"
                      >
                        <Trash2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              
              {groupedCategories.expense.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">No expense categories found</p>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Forms */}
      <AddCategoryForm
        isOpen={isAddFormOpen}
        onClose={() => setIsAddFormOpen(false)}
        onSuccess={handleFormSuccess}
      />

      <EditCategoryForm
        isOpen={isEditFormOpen}
        onClose={() => {
          setIsEditFormOpen(false);
          setEditingCategory(null);
        }}
        onSuccess={handleFormSuccess}
        category={editingCategory}
      />
    </div>
  );
};