import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLanguage } from './LanguageContext';

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
}

export const currencies: Currency[] = [
  { code: 'TRY', name: 'Türk Lirası (TL)', symbol: 'TL', flag: '🇹🇷' },
  { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
  { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', flag: '🇨🇭' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', flag: '🇧🇷' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩', flag: '🇰🇷' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬' }
];

interface CurrencyContextType {
  currency: Currency;
  updateCurrency: (newCurrency: Currency) => void;
  formatAmount: (amount: number) => string;
  currencySymbol: string;
  isCurrencySelectorOpen: boolean;
  setIsCurrencySelectorOpen: (open: boolean) => void;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { language } = useLanguage();
  const [currency, setCurrency] = useState<Currency>(currencies[0]); // Default to TRY or saved
  const [isCurrencySelectorOpen, setIsCurrencySelectorOpen] = useState(false);

  useEffect(() => {
    const savedCurrency = localStorage.getItem('selectedCurrency');
    if (savedCurrency) {
      try {
        const parsed = JSON.parse(savedCurrency);
        // Find existing match or fallback
        const match = currencies.find(c => c.code === parsed.code) || parsed;
        setCurrency(match);
      } catch (error) {
        console.error('Error parsing saved currency:', error);
      }
    } else {
      // Default to TRY (TL) if Turkish, else USD
      const defaultCurr = language === 'tr' ? currencies[0] : currencies[1];
      setCurrency(defaultCurr);
    }
  }, []);

  const updateCurrency = (newCurrency: Currency) => {
    setCurrency(newCurrency);
    localStorage.setItem('selectedCurrency', JSON.stringify(newCurrency));
  };

  const formatAmount = (amount: number): string => {
    const locale = language === 'tr' ? 'tr-TR' : 'en-US';
    
    if (currency.code === 'TRY') {
      const formattedNum = amount.toLocaleString(locale, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
      return `${formattedNum} TL`;
    }

    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency.code,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amount);
    } catch {
      return `${currency.symbol}${amount.toLocaleString(locale, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}`;
    }
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        updateCurrency,
        formatAmount,
        currencySymbol: currency.symbol,
        isCurrencySelectorOpen,
        setIsCurrencySelectorOpen
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
