'use client'

import { CurrencySettings as CurrencySettingsType } from '@/types/settings'
import { DollarSign, Eye } from 'lucide-react'
import { useCurrency } from '@/lib/settings-context'

interface CurrencySettingsProps {
  settings: CurrencySettingsType
  onChange: (updates: Partial<CurrencySettingsType>) => void
}

const currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'KRW', symbol: '₩', name: 'South Korean Won' },
  { code: 'SEK', symbol: 'kr', name: 'Swedish Krona' },
  { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone' },
  { code: 'DKK', symbol: 'kr', name: 'Danish Krone' },
  { code: 'PLN', symbol: 'zł', name: 'Polish Złoty' },
  { code: 'CZK', symbol: 'Kč', name: 'Czech Koruna' },
  { code: 'HUF', symbol: 'Ft', name: 'Hungarian Forint' },
]

export default function CurrencySettings({ settings, onChange }: CurrencySettingsProps) {
  const { formatCurrency } = useCurrency()

  const handleCurrencyChange = (currencyCode: string) => {
    const currency = currencies.find(c => c.code === currencyCode)
    if (currency) {
      onChange({
        code: currency.code,
        symbol: currency.symbol,
      })
    }
  }

  const handleInputChange = (field: keyof CurrencySettingsType, value: any) => {
    onChange({ [field]: value })
  }

  // Create a preview formatter using current settings
  const previewFormatter = (amount: number): string => {
    const formattedAmount = settings.decimals === 0 
      ? amount.toString() 
      : amount.toFixed(settings.decimals)
    
    return settings.position === 'before' 
      ? `${settings.symbol}${formattedAmount}` 
      : `${formattedAmount}${settings.symbol}`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-green-100 to-green-200 rounded-lg">
          <DollarSign className="h-5 w-5 text-green-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-earth-900">Currency Settings</h3>
          <p className="text-sm text-earth-600">Configure how monetary values are displayed throughout the app</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-earth-700 mb-2">
            Currency
          </label>
          <select
            value={settings.code}
            onChange={(e) => handleCurrencyChange(e.target.value)}
            className="w-full px-3 py-2 border border-earth-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
          >
            {currencies.map((currency) => (
              <option key={currency.code} value={currency.code}>
                {currency.symbol} - {currency.name} ({currency.code})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-earth-700 mb-2">
            Symbol Position
          </label>
          <select
            value={settings.position}
            onChange={(e) => handleInputChange('position', e.target.value as 'before' | 'after')}
            className="w-full px-3 py-2 border border-earth-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
          >
            <option value="before">Before amount ({settings.symbol}100)</option>
            <option value="after">After amount (100{settings.symbol})</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-earth-700 mb-2">
            Decimal Places
          </label>
          <select
            value={settings.decimals}
            onChange={(e) => handleInputChange('decimals', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-earth-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
          >
            <option value={0}>No decimals (100)</option>
            <option value={2}>Two decimal places (100.00)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-earth-700 mb-2">
            Custom Symbol (Optional)
          </label>
          <input
            type="text"
            value={settings.symbol}
            onChange={(e) => handleInputChange('symbol', e.target.value)}
            className="w-full px-3 py-2 border border-earth-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
            placeholder="$"
            maxLength={5}
          />
          <p className="text-xs text-earth-500 mt-1">Override the default currency symbol</p>
        </div>
      </div>

      {/* Live Preview */}
      <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-6 border border-primary-200">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-primary-500 rounded-lg">
            <Eye className="h-4 w-4 text-white" />
          </div>
          <h4 className="text-base font-semibold text-primary-800">Live Preview</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-white/80 rounded-lg p-3">
            <p className="text-earth-600 mb-1">Veterinary Visit</p>
            <p className="text-lg font-semibold text-earth-900">{previewFormatter(125.50)}</p>
          </div>
          <div className="bg-white/80 rounded-lg p-3">
            <p className="text-earth-600 mb-1">Pet Food</p>
            <p className="text-lg font-semibold text-earth-900">{previewFormatter(45)}</p>
          </div>
          <div className="bg-white/80 rounded-lg p-3">
            <p className="text-earth-600 mb-1">Grooming Session</p>
            <p className="text-lg font-semibold text-earth-900">{previewFormatter(80.75)}</p>
          </div>
        </div>
        
        <p className="text-xs text-primary-700 mt-3">
          This is how currency amounts will appear in event logs, medical records, and throughout the app.
        </p>
      </div>
    </div>
  )
} 