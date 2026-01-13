export const EXCHANGE_RATES = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 149.50,
  CHF: 0.88,
  AUD: 1.52,
  CAD: 1.36,
  CNY: 7.24,
  HKD: 7.83,
};

export const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  CHF: 'CHF',
  AUD: 'A$',
  CAD: 'C$',
  CNY: '¥',
  HKD: 'HK$',
};

export type Currency = keyof typeof EXCHANGE_RATES;

export function convertCurrency(amount: number, from: Currency, to: Currency): number {
  const amountInUSD = amount / EXCHANGE_RATES[from];
  return Math.round(amountInUSD * EXCHANGE_RATES[to]);
}

export function formatCurrency(amount: number, currency: Currency): string {
  const symbol = CURRENCY_SYMBOLS[currency];
  const formatted = amount.toLocaleString();
  
  if (currency === 'JPY') {
    return `${symbol}${formatted}`;
  }
  
  return `${symbol}${formatted}`;
}
