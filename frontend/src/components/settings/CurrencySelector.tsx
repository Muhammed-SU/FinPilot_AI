import React, { useState, useEffect } from 'react';
import { Globe, Check } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useLanguage } from '../../contexts/LanguageContext';
import { Currency, currencies, useCurrency } from '../../contexts/CurrencyContext';

// Re-export for backwards compatibility
export { useCurrency, currencies };
export type { Currency };

interface CurrencySelectorProps {
  isOpen: boolean;
  onClose: () => void;
  currentCurrency?: Currency;
  onCurrencyChange?: (currency: Currency) => void;
}

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  isOpen,
  onClose,
  currentCurrency: propCurrency,
  onCurrencyChange: propOnCurrencyChange
}) => {
  const { t } = useLanguage();
  const contextCurrency = useCurrency();
  const activeCurrency = propCurrency || contextCurrency.currency;
  const updateCurrency = propOnCurrencyChange || contextCurrency.updateCurrency;

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(activeCurrency);

  useEffect(() => {
    if (isOpen) {
      setSelectedCurrency(activeCurrency);
    }
  }, [isOpen, activeCurrency]);

  const filteredCurrencies = currencies.filter(currency =>
    currency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    currency.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    currency.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = () => {
    updateCurrency(selectedCurrency);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
      <div className="w-full max-w-md transform transition-all duration-300 animate-in slide-in-from-bottom-4">
        <Card className="max-h-[85vh] overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {t('selectCurrency')}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {t('choosePreferredCurrency')}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              <Globe className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          <div className="mb-4">
            <input
              type="text"
              placeholder={t('searchCurrencies')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300/50 dark:border-slate-600/50 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-md text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50"
            />
          </div>

          <div className="max-h-80 overflow-y-auto space-y-2 mb-6 pr-1">
            {filteredCurrencies.map((curr) => {
              const isSelected = selectedCurrency.code === curr.code;
              return (
                <button
                  key={curr.code}
                  onClick={() => setSelectedCurrency(curr)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-300 ${
                    isSelected
                      ? 'bg-emerald-500/10 dark:bg-emerald-500/20 border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 shadow-sm'
                      : 'hover:bg-gray-50 dark:hover:bg-slate-800/50 text-gray-900 dark:text-white border border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{curr.flag}</span>
                    <div className="text-left">
                      <div className="flex items-center space-x-2">
                        <p className="font-semibold">{curr.name}</p>
                        {curr.code === 'TRY' && (
                          <span className="text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400">
                            TL
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{curr.code}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold">{curr.symbol}</span>
                    {isSelected && <Check className="w-5 h-5 text-emerald-500" />}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex space-x-3 pt-2 border-t border-gray-100 dark:border-slate-800">
            <Button variant="ghost" onClick={onClose} className="flex-1">
              {t('cancel')}
            </Button>
            <Button onClick={handleSave} className="flex-1">
              {t('saveCurrency')}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};