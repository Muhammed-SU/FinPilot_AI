import api from "./api";

export interface Category {
  _id?: string;
  id?: string;
  name: string;
  type: "income" | "expense" | "both";
  color: string;
  icon?: string;
  isDefault: boolean;
  isActive: boolean;
  userId?: string;
}

export type NewCategory = Omit<Category, "id" | "_id" | "userId" | "isDefault">;

// Category CRUD operations
export const getCategories = async (): Promise<Category[]> => {
  try {
    const res = await api.get<Category[]>("/categories");
    return res.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    // Return default categories if API fails
    return getDefaultCategories();
  }
};

export const createCategory = async (data: NewCategory): Promise<Category> => {
  const res = await api.post<Category>("/categories", data);
  return res.data;
};

export const updateCategory = async (id: string, data: Partial<NewCategory>): Promise<Category> => {
  const res = await api.put<Category>(`/categories/${id}`, data);
  return res.data;
};

export const deleteCategory = async (id: string): Promise<{ message: string }> => {
  const res = await api.delete<{ message: string }>(`/categories/${id}`);
  return res.data;
};

// Get categories by type
export const getCategoriesByType = async (type: "income" | "expense"): Promise<Category[]> => {
  const categories = await getCategories();
  return categories.filter(cat => cat.type === type || cat.type === "both");
};

// Default categories fallback
export const getDefaultCategories = (): Category[] => [
  // Expense categories
  { id: 'exp-1', name: 'Food & Dining', type: 'expense', color: '#EF4444', isDefault: true, isActive: true },
  { id: 'exp-2', name: 'Transportation', type: 'expense', color: '#3B82F6', isDefault: true, isActive: true },
  { id: 'exp-3', name: 'Shopping', type: 'expense', color: '#8B5CF6', isDefault: true, isActive: true },
  { id: 'exp-4', name: 'Entertainment', type: 'expense', color: '#F59E0B', isDefault: true, isActive: true },
  { id: 'exp-5', name: 'Bills & Utilities', type: 'expense', color: '#10B981', isDefault: true, isActive: true },
  { id: 'exp-6', name: 'Healthcare', type: 'expense', color: '#EC4899', isDefault: true, isActive: true },
  { id: 'exp-7', name: 'Education', type: 'expense', color: '#06B6D4', isDefault: true, isActive: true },
  { id: 'exp-8', name: 'Travel', type: 'expense', color: '#84CC16', isDefault: true, isActive: true },
  { id: 'exp-9', name: 'Groceries', type: 'expense', color: '#F97316', isDefault: true, isActive: true },
  { id: 'exp-10', name: 'Other', type: 'expense', color: '#6B7280', isDefault: true, isActive: true },
  
  // Income categories
  { id: 'inc-1', name: 'Salary', type: 'income', color: '#10B981', isDefault: true, isActive: true },
  { id: 'inc-2', name: 'Freelance', type: 'income', color: '#3B82F6', isDefault: true, isActive: true },
  { id: 'inc-3', name: 'Investment', type: 'income', color: '#8B5CF6', isDefault: true, isActive: true },
  { id: 'inc-4', name: 'Business', type: 'income', color: '#F59E0B', isDefault: true, isActive: true },
  { id: 'inc-5', name: 'Gift', type: 'income', color: '#EC4899', isDefault: true, isActive: true },
  { id: 'inc-6', name: 'Other', type: 'income', color: '#6B7280', isDefault: true, isActive: true }
];

// Category cache
let categoryCache: Category[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const getCachedCategories = async (): Promise<Category[]> => {
  const now = Date.now();
  
  if (categoryCache && (now - cacheTimestamp) < CACHE_DURATION) {
    return categoryCache;
  }
  
  categoryCache = await getCategories();
  cacheTimestamp = now;
  return categoryCache;
};

export const clearCategoryCache = () => {
  categoryCache = null;
  cacheTimestamp = 0;
};