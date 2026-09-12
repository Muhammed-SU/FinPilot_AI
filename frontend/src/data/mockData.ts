import { Transaction, BudgetItem, ChartData, AIInsight } from '../types';

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    date: '2024-01-15',
    description: 'Grocery Store',
    amount: -85.50,
    category: 'Food & Dining',
    type: 'expense'
  },
  {
    id: '2',
    date: '2024-01-14',
    description: 'Salary Deposit',
    amount: 3500.00,
    category: 'Income',
    type: 'income'
  },
  {
    id: '3',
    date: '2024-01-13',
    description: 'Gas Station',
    amount: -45.20,
    category: 'Transportation',
    type: 'expense'
  },
  {
    id: '4',
    date: '2024-01-12',
    description: 'Netflix Subscription',
    amount: -15.99,
    category: 'Entertainment',
    type: 'expense'
  },
  {
    id: '5',
    date: '2024-01-11',
    description: 'Coffee Shop',
    amount: -4.75,
    category: 'Food & Dining',
    type: 'expense'
  }
];

export const mockBudgetItems: BudgetItem[] = [
  {
    id: '1',
    category: 'Food & Dining',
    budgeted: 400,
    spent: 285.50,
    color: '#3B82F6'
  },
  {
    id: '2',
    category: 'Transportation',
    budgeted: 200,
    spent: 145.20,
    color: '#10B981'
  },
  {
    id: '3',
    category: 'Entertainment',
    budgeted: 100,
    spent: 65.99,
    color: '#F59E0B'
  },
  {
    id: '4',
    category: 'Shopping',
    budgeted: 300,
    spent: 320.00,
    color: '#EF4444'
  }
];

export const expenseChartData: ChartData[] = [
  { label: 'Food & Dining', value: 285.50, color: '#3B82F6' },
  { label: 'Transportation', value: 145.20, color: '#10B981' },
  { label: 'Entertainment', value: 65.99, color: '#F59E0B' },
  { label: 'Shopping', value: 320.00, color: '#EF4444' },
  { label: 'Utilities', value: 180.00, color: '#8B5CF6' }
];

export const monthlySpendingData = [
  { month: 'Aug', amount: 2400 },
  { month: 'Sep', amount: 2200 },
  { month: 'Oct', amount: 2800 },
  { month: 'Nov', amount: 2600 },
  { month: 'Dec', amount: 3200 },
  { month: 'Jan', amount: 2900 }
];

export const aiInsights: AIInsight[] = [
  {
    id: '1',
    type: 'spending',
    title: 'High Spending Alert',
    description: 'You\'ve spent 15% more on dining out this month compared to last month.',
    icon: 'TrendingUp',
    actionText: 'View Details'
  },
  {
    id: '2',
    type: 'saving',
    title: 'Saving Opportunity',
    description: 'You could save $120/month by switching to a different phone plan.',
    icon: 'PiggyBank',
    actionText: 'Learn More'
  },
  {
    id: '3',
    type: 'recommendation',
    title: 'Budget Recommendation',
    description: 'Consider increasing your entertainment budget by $50 based on your spending patterns.',
    icon: 'Target',
    actionText: 'Adjust Budget'
  }
];