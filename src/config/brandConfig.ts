export interface BrandConfig {
  appName: string;
  tagline: string;
  defaultCurrency: string;
  supportedCurrencies: readonly string[];
  creditLabel: string;
  cashierRoleLabel: string;
  enableLanguageToggle: boolean;
}

export const brandConfig: BrandConfig = {
  appName: (import.meta as any).env?.VITE_APP_NAME || 'AuraPOS',
  tagline: 'Universal Cloud Point of Sale',
  defaultCurrency: '$',
  supportedCurrencies: ['$', '₱', '€', '£', '¥'] as const,
  creditLabel: 'Customer Credit',
  cashierRoleLabel: 'Cashier / Associate',
  enableLanguageToggle: false,
};
