// Currency configuration
export interface CurrencyConfig {
  symbol: string
  code: string
  name: string
  position: 'before' | 'after'
  decimalPlaces: number
}

// Supported currencies
export const CURRENCIES: Record<string, CurrencyConfig> = {
  INR: {
    symbol: '₹',
    code: 'INR',
    name: 'Indian Rupee',
    position: 'before',
    decimalPlaces: 0
  },
  USD: {
    symbol: '$',
    code: 'USD',
    name: 'US Dollar',
    position: 'before',
    decimalPlaces: 2
  },
  EUR: {
    symbol: '€',
    code: 'EUR',
    name: 'Euro',
    position: 'after',
    decimalPlaces: 2
  }
}

// Default currency (can be changed to organization level later)
export const DEFAULT_CURRENCY = 'INR'

// Get current currency configuration
export function getCurrencyConfig(): CurrencyConfig {
  // TODO: This can be made dynamic based on organization settings
  return CURRENCIES[DEFAULT_CURRENCY]
}

// Format amount with currency
export function formatCurrency(amount: number, currency?: string): string {
  const config = currency ? CURRENCIES[currency] : getCurrencyConfig()
  const formattedAmount = amount.toFixed(config.decimalPlaces)
  
  if (config.position === 'before') {
    return `${config.symbol}${formattedAmount}`
  } else {
    return `${formattedAmount} ${config.symbol}`
  }
}

// Get currency symbol
export function getCurrencySymbol(currency?: string): string {
  const config = currency ? CURRENCIES[currency] : getCurrencyConfig()
  return config.symbol
}

// Get currency icon component name (for Lucide icons)
export function getCurrencyIcon(currency?: string): string {
  const currencyCode = currency || DEFAULT_CURRENCY
  
  switch (currencyCode) {
    case 'INR':
      return 'Rupee'
    case 'USD':
      return 'DollarSign'
    case 'EUR':
      return 'Euro'
    default:
      return 'DollarSign'
  }
}
