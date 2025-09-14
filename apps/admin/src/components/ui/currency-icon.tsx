import { DollarSign, Euro } from 'lucide-react'
import { getCurrencyIcon } from '@/lib/currency'

interface CurrencyIconProps {
  className?: string
  currency?: string
}

export function CurrencyIcon({ className = "h-4 w-4", currency }: CurrencyIconProps) {
  const iconName = getCurrencyIcon(currency)
  
  switch (iconName) {
    case 'Rupee':
      // Use a simple text symbol for INR since Rupee icon might not exist
      return <span className={`${className} text-muted-foreground font-bold`}>₹</span>
    case 'Euro':
      return <Euro className={className} />
    case 'DollarSign':
    default:
      return <DollarSign className={className} />
  }
}
