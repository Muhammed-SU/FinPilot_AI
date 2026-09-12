import React, { useState, useEffect } from 'react';
import { Tag, Plus, ChevronDown } from 'lucide-react';
import { Category, getCachedCategories } from '../services/categoryService';
import { AddCategoryForm } from '../forms/AddCategoryForm';

interface CategorySelectorProps {
  value: string;
  onChange: (value: string) => void;
  type: 'income' | 'expense';
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  allowAddNew?: boolean;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  value,
  onChange,
  type,
  placeholder = "Select a category",
  error,
  disabled = false,
  allowAddNew = true
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const data = await getCachedCategories();
      const filteredCategories = data.filter(cat => 
        cat.isActive && (cat.type === type || cat.type === 'both')
      );
      setCategories(filteredCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [type]);

  const handleCategorySelect = (categoryName: string) => {
    onChange(categoryName);
    setIsOpen(false);
  };

  const handleAddNewCategory = () => {
    setIsAddFormOpen(true);
    setIsOpen(false);
  };

  const handleFormSuccess = () => {
    fetchCategories();
  };

  const selectedCategory = categories.find(cat => cat.name === value);

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
        Category
      </label>
      
      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={`
            w-full flex items-center justify-between px-3 py-2.5 pl-10 pr-10
            text-left rounded-xl border border-gray-300/50 dark:border-slate-600/50 
            bg-white/50 dark:bg-slate-800/50 backdrop-blur-md
            text-gray-900 dark:text-white
            focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/50 
            focus:ring-offset-2 focus:ring-offset-transparent focus:outline-none 
            transition-all duration-300
            ${error ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/50' : ''}
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/70 dark:hover:bg-slate-800/70'}
          `}
          disabled={disabled}
        >
          <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          
          <div className="flex items-center space-x-2 min-w-0 flex-1">
            {selectedCategory && (
              <div 
                className="w-3 h-3 rounded-full flex-shrink-0" 
                style={{ backgroundColor: selectedCategory.color }}
              />
            )}
            <span className={`truncate ${value ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
              {value || placeholder}
            </span>
          </div>
          
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && !disabled && (
          <div className="absolute z-50 w-full mt-1 bg-white dark:bg-slate-800 border border-gray-200/50 dark:border-slate-700/50 rounded-xl shadow-xl backdrop-blur-xl max-h-60 overflow-y-auto">
            {isLoading ? (
              <div className="p-3 text-center text-gray-500 dark:text-gray-400">
                Loading categories...
              </div>
            ) : (
              <>
                {categories.map((category) => (
                  <button
                    key={category._id || category.id}
                    type="button"
                    onClick={() => handleCategorySelect(category.name)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors ${
                      value === category.name ? 'bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'
                    }`}
                  >
                    <div 
                      className="w-3 h-3 rounded-full flex-shrink-0" 
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="truncate">{category.name}</span>
                    {category.type === 'both' && (
                      <span className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 rounded-md">
                        Both
                      </span>
                    )}
                  </button>
                ))}
                
                {categories.length === 0 && (
                  <div className="p-3 text-center text-gray-500 dark:text-gray-400">
                    No categories found
                  </div>
                )}
                
                {allowAddNew && (
                  <>
                    <div className="border-t border-gray-200/50 dark:border-slate-700/50 my-1"></div>
                    <button
                      type="button"
                      onClick={handleAddNewCategory}
                      className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors text-blue-600 dark:text-blue-400"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add new category</span>
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-500 dark:text-red-400 mt-1">{error}</p>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}

      <AddCategoryForm
        isOpen={isAddFormOpen}
        onClose={() => setIsAddFormOpen(false)}
        onSuccess={handleFormSuccess}
        defaultType={type}
      />
    </div>
  );
};