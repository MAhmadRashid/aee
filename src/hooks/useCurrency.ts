import { useState, useEffect } from 'react';

type CurrencyData = {
  currencyCode: string;
  exchangeRate: number;
  symbol: string;
};

// Map of common currency symbols
const currencySymbols: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  PKR: 'Rs.',
  INR: '₹',
  AED: 'د.إ',
  SAR: 'ر.س',
};

// Cache rates so we only fetch once
let globalRates: Record<string, number> = {};

export function useCurrency() {
  const [data, setData] = useState<CurrencyData>({
    currencyCode: 'PKR',
    exchangeRate: 278, // fallback
    symbol: 'Rs.',
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function initCurrency() {
      try {
        if (Object.keys(globalRates).length === 0) {
          const rateRes = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
          if (rateRes.ok) {
            const rateData = await rateRes.json();
            globalRates = rateData.rates;
          }
        }
        changeCurrency('PKR');
      } catch (error) {
        console.error('Failed to fetch rates', error);
      } finally {
        setIsLoading(false);
      }
    }

    initCurrency();
  }, []);

  const changeCurrency = (code: string) => {
    const rate = globalRates[code] || (code === 'PKR' ? 278 : 1);
    setData({
      currencyCode: code,
      exchangeRate: rate,
      symbol: currencySymbols[code] || code,
    });
  };

  const formatPrice = (basePricePKR: number) => {
    // If target currency is PKR, rate is 1. Otherwise, convert PKR to target currency.
    const pkrRate = globalRates['PKR'] || 278;
    const conversionRate = data.currencyCode === 'PKR' ? 1 : (data.exchangeRate / pkrRate);
    const convertedPrice = basePricePKR * conversionRate;
    
    const isLargeCurrency = ['PKR', 'INR', 'JPY'].includes(data.currencyCode);
    
    const numStr = convertedPrice.toLocaleString('en-US', {
      minimumFractionDigits: isLargeCurrency ? 0 : 2,
      maximumFractionDigits: isLargeCurrency ? 0 : 2,
    });

    return `${data.symbol} ${numStr}`;
  };

  return { ...data, formatPrice, isLoading, changeCurrency };
}
