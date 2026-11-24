import { brandConfig } from '../config/brandConfig';

let activeCurrencySymbol: string = brandConfig.defaultCurrency;

export function setGlobalCurrency(symbol: string | undefined | null): void {
  if (symbol && symbol.trim()) {
    activeCurrencySymbol = symbol.trim();
  } else {
    activeCurrencySymbol = brandConfig.defaultCurrency;
  }
}

export function getGlobalCurrency(): string {
  return activeCurrencySymbol || brandConfig.defaultCurrency;
}

export function formatCurrency(amount: number, symbol?: string): string {
  const sym = symbol || getGlobalCurrency();
  const safeAmount = isNaN(amount) ? 0 : amount;
  return `${sym}${safeAmount.toLocaleString('en-US', {
    minimumFractionDigits: safeAmount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatCurrencyExact(amount: number, symbol?: string): string {
  const sym = symbol || getGlobalCurrency();
  const safeAmount = isNaN(amount) ? 0 : amount;
  return `${sym}${safeAmount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

// Backward-compatibility aliases
export const formatPeso = formatCurrency;
export const formatPesoExact = formatCurrencyExact;
