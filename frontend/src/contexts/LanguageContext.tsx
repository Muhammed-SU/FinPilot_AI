import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'tr';

export interface Translations {
  [key: string]: {
    en: string;
    tr: string;
  };
}

export const translations: Translations = {
  // Navigation & Common
  dashboard: { en: 'Dashboard', tr: 'Kontrol Paneli' },
  transactions: { en: 'Transactions', tr: 'İşlemler' },
  budget: { en: 'Budget', tr: 'Bütçe' },
  categories: { en: 'Categories', tr: 'Kategoriler' },
  aiInsights: { en: 'AI Insights', tr: 'Yapay Zeka' },
  settings: { en: 'Settings', tr: 'Ayarlar' },
  logout: { en: 'Logout', tr: 'Çıkış Yap' },
  currency: { en: 'Currency', tr: 'Para Birimi' },
  language: { en: 'Language', tr: 'Dil' },
  search: { en: 'Search...', tr: 'Ara...' },
  cancel: { en: 'Cancel', tr: 'İptal' },
  save: { en: 'Save', tr: 'Kaydet' },
  delete: { en: 'Delete', tr: 'Sil' },
  edit: { en: 'Edit', tr: 'Düzenle' },
  actions: { en: 'Actions', tr: 'İşlemler' },
  loading: { en: 'Loading...', tr: 'Yükleniyor...' },
  viewAll: { en: 'View all', tr: 'Tümünü Gör' },
  filter: { en: 'Filter', tr: 'Filtrele' },
  all: { en: 'All', tr: 'Tümü' },
  close: { en: 'Close', tr: 'Kapat' },

  // Dashboard & Stats
  financialDashboard: { en: 'Financial Dashboard', tr: 'Finansal Kontrol Paneli' },
  dashboardSubtitle: { en: "Welcome back! Here's your financial overview.", tr: 'Tekrar hoş geldiniz! İşte finansal durumunuz.' },
  addTransaction: { en: 'Add Transaction', tr: 'İşlem Ekle' },
  totalBalance: { en: 'Total Balance', tr: 'Toplam Bakiye' },
  totalIncome: { en: 'Total Income', tr: 'Toplam Gelir' },
  totalExpenses: { en: 'Total Expenses', tr: 'Toplam Gider' },
  fromLastMonth: { en: 'from last month', tr: 'geçen aya göre' },
  financialTrend: { en: '6-Month Financial Trend', tr: '6 Aylık Finansal Eğilim' },
  expenseCategories: { en: 'Expense Categories', tr: 'Gider Kategorileri' },
  spendingTrend: { en: 'Spending Trend', tr: 'Harcama Eğilimi' },
  monthlyComparison: { en: 'Monthly Comparison', tr: 'Aylık Karşılaştırma' },
  recentTransactions: { en: 'Recent Transactions', tr: 'Son İşlemler' },
  income: { en: 'Income', tr: 'Gelir' },
  expense: { en: 'Expense', tr: 'Gider' },
  balance: { en: 'Balance', tr: 'Bakiye' },
  week: { en: 'Week', tr: 'Hafta' },
  month: { en: 'Month', tr: 'Ay' },
  year: { en: 'Year', tr: 'Yıl' },

  // Transactions Page
  manageTransactions: { en: 'Manage your income and expenses', tr: 'Gelir ve giderlerinizi yönetin' },
  searchTransactions: { en: 'Search transactions...', tr: 'İşlemlerde ara...' },
  allTypes: { en: 'All Types', tr: 'Tüm Türler' },
  allCategories: { en: 'All Categories', tr: 'Tüm Kategoriler' },
  date: { en: 'Date', tr: 'Tarih' },
  title: { en: 'Title', tr: 'Başlık' },
  description: { en: 'Description', tr: 'Açıklama' },
  category: { en: 'Category', tr: 'Kategori' },
  amount: { en: 'Amount', tr: 'Tutar' },
  type: { en: 'Type', tr: 'Tür' },
  notes: { en: 'Notes', tr: 'Notlar' },
  notesPlaceholder: { en: 'Add any notes...', tr: 'Not ekleyin...' },
  noTransactionsFound: { en: 'No transactions found', tr: 'İşlem bulunamadı' },
  noTransactionsMatch: { en: 'Try adjusting your search or filter criteria', tr: 'Arama veya filtre kriterlerinizi değiştirmeyi deneyin' },
  export: { en: 'Export', tr: 'Dışa Aktar' },
  newTransaction: { en: 'New Transaction', tr: 'Yeni İşlem' },
  editTransaction: { en: 'Edit Transaction', tr: 'İşlemi Düzenle' },
  previous: { en: 'Previous', tr: 'Önceki' },
  next: { en: 'Next', tr: 'Sonraki' },
  showing: { en: 'Showing', tr: 'Gösterilen' },
  of: { en: 'of', tr: 'toplam' },
  transactionTitlePlaceholder: { en: 'e.g., Grocery Shopping, Salary', tr: 'ör. Market Alışverişi, Maaş' },
  selectCategory: { en: 'Select Category', tr: 'Kategori Seçin' },
  saveTransaction: { en: 'Save Transaction', tr: 'İşlemi Kaydet' },
  updateTransaction: { en: 'Update Transaction', tr: 'İşlemi Güncelle' },

  // Budget
  budgetManagement: { en: 'Budget Management', tr: 'Bütçe Yönetimi' },
  budgetSubtitle: { en: 'Track and manage your spending budgets', tr: 'Harcama bütçelerinizi takip edin ve yönetin' },
  createBudget: { en: 'Create Budget', tr: 'Bütçe Oluştur' },
  totalBudgeted: { en: 'Total Budgeted', tr: 'Toplam Bütçelenen' },
  totalSpent: { en: 'Total Spent', tr: 'Toplam Harcanan' },
  remaining: { en: 'Remaining', tr: 'Kalan' },
  progress: { en: 'Progress', tr: 'İlerleme' },
  activeBudgets: { en: 'Active Budgets', tr: 'Aktif Bütçeler' },
  budgetGoals: { en: 'Budget Goals', tr: 'Bütçe Hedefleri' },
  budgetAlerts: { en: 'Budget Alerts', tr: 'Bütçe Uyarıları' },
  overBudget: { en: 'Over Budget', tr: 'Bütçe Aşıldı' },
  nearLimit: { en: 'Near Limit', tr: 'Limite Yakın' },
  onTrack: { en: 'On Track', tr: 'Yolunda' },
  period: { en: 'Period', tr: 'Dönem' },
  daysLeft: { en: 'days left', tr: 'gün kaldı' },
  daysOverdue: { en: 'days overdue', tr: 'gün gecikti' },

  // Categories
  categoryManagement: { en: 'Category Management', tr: 'Kategori Yönetimi' },
  categorySubtitle: { en: 'Manage income and expense categories', tr: 'Gelir ve gider kategorilerini yönetin' },
  addCategory: { en: 'Add Category', tr: 'Kategori Ekle' },
  editCategory: { en: 'Edit Category', tr: 'Kategoriyi Düzenle' },
  categoryName: { en: 'Category Name', tr: 'Kategori Adı' },
  color: { en: 'Color', tr: 'Renk' },
  icon: { en: 'Icon', tr: 'Simge' },
  defaultCategories: { en: 'Default', tr: 'Varsayılan' },
  customCategories: { en: 'Custom', tr: 'Özel' },

  // AI Insights
  aiFinancialInsights: { en: 'AI Financial Insights', tr: 'Yapay Zeka Finansal İçgörüler' },
  aiInsightsSubtitle: { en: 'Smart recommendations and financial health analysis', tr: 'Akıllı öneriler ve finansal sağlık analizi' },
  financialHealthScore: { en: 'Financial Health Score', tr: 'Finansal Sağlık Skoru' },
  savingsOpportunity: { en: 'Savings Opportunity', tr: 'Tasarruf Fırsatı' },
  spendingForecast: { en: 'Spending Forecast', tr: 'Harcama Tahmini' },
  budgetRecommendations: { en: 'Budget Recommendations', tr: 'Bütçe Önerileri' },
  unusualSpending: { en: 'Unusual Spending Detected', tr: 'Olağandışı Harcama Tespit Edildi' },
  highPriority: { en: 'High Priority', tr: 'Yüksek Öncelik' },
  monthlySpending: { en: 'Monthly Spending', tr: 'Aylık Harcama' },
  savingsRate: { en: 'Savings Rate', tr: 'Tasarruf Oranı' },

  // Auth
  welcomeBackAuth: { en: 'Welcome Back', tr: 'Tekrar Hoş Geldiniz' },
  signInSubtitle: { en: 'Sign in to access your financial dashboard', tr: 'Finansal kontrol panelinize erişmek için giriş yapın' },
  emailAddress: { en: 'Email Address', tr: 'E-posta Adresi' },
  password: { en: 'Password', tr: 'Şifre' },
  confirmPassword: { en: 'Confirm Password', tr: 'Şifreyi Onayla' },
  signIn: { en: 'Sign In', tr: 'Giriş Yap' },
  signUp: { en: 'Sign Up', tr: 'Kayıt Ol' },
  fullName: { en: 'Full Name', tr: 'Ad Soyad' },
  dontHaveAccount: { en: "Don't have an account?", tr: 'Hesabınız yok mu?' },
  alreadyHaveAccount: { en: 'Already have an account?', tr: 'Zaten hesabınız var mı?' },
  createAccount: { en: 'Create Account', tr: 'Hesap Oluştur' },
  registerSubtitle: { en: 'Join FinPilot to take control of your finances', tr: 'Finanslarınızı kontrol altına almak için FinPilot\'a katılın' },

  // Currency Selector
  selectCurrency: { en: 'Select Currency', tr: 'Para Birimi Seçin' },
  choosePreferredCurrency: { en: 'Choose your preferred currency', tr: 'Tercih ettiğiniz para birimini belirleyin' },
  searchCurrencies: { en: 'Search currencies...', tr: 'Para birimi ara...' },
  saveCurrency: { en: 'Save Currency', tr: 'Para Birimini Kaydet' },
  turkishLira: { en: 'Turkish Lira (TL)', tr: 'Türk Lirası (TL)' }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const saved = localStorage.getItem('appLanguage') as Language;
    if (saved === 'en' || saved === 'tr') {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('appLanguage', lang);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'tr' : 'en');
  };

  const t = (key: string): string => {
    if (translations[key]) {
      return translations[key][language] || translations[key]['en'] || key;
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
