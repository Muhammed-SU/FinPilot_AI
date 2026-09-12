export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
}

export interface BudgetItem {
  id: string;
  category: string;
  budgeted: number;
  spent: number;
  color: string;
}

export interface ChartData {
  label: string;
  value: number;
  color: string;
}

export interface AIInsight {
  id: string;
  type: 'spending' | 'saving' | 'recommendation';
  title: string;
  description: string;
  icon: string;
  actionText?: string;
}

export interface User {
  name: string;
  email: string;
  avatar?: string;
}

export interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}