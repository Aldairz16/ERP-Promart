import React from 'react';
import { currencies } from '../../data/mockData';

interface CurrencyToggleProps {
  selectedCurrency: 'PEN' | 'USD';
  onCurrencyChange: (currency: 'PEN' | 'USD') => void;
}

const CurrencyToggle: React.FC<CurrencyToggleProps> = ({ selectedCurrency, onCurrencyChange }) => {
  return (
    <div className="flex space-x-2">
      {currencies.map((currency) => (
        <button
          key={currency.code}
          onClick={() => onCurrencyChange(currency.code)}
          className={`chip ${
            selectedCurrency === currency.code ? 'chip-active' : 'chip-inactive'
          }`}
        >
          {currency.symbol} {currency.code}
        </button>
      ))}
    </div>
  );
};

export default CurrencyToggle;