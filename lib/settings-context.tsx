'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { AppSettings, defaultSettings } from '@/types/settings'
import { getSettings, updateSettings as updateSettingsFirestore, resetSettings as resetSettingsFirestore } from '@/lib/firestore-data'
import { useAuth } from '@/lib/auth-context'

interface SettingsContextType {
  settings: AppSettings
  updateSettings: (updates: Partial<AppSettings>) => Promise<void>
  resetSettings: () => Promise<void>
  isLoading: boolean
  error: string | null
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [settings, setSettings] = useState<AppSettings>(defaultSettings)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load settings on mount when user is available
  useEffect(() => {
    if (user) {
      loadSettings()
    } else {
      setIsLoading(false)
      setSettings(defaultSettings)
    }
  }, [user])

  const loadSettings = async () => {
    if (!user) {
      setSettings(defaultSettings)
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      
      const data = await getSettings()
      setSettings(data)
    } catch (error) {
      console.error('Error loading settings:', error)
      setError('Failed to load settings')
      setSettings(defaultSettings)
    } finally {
      setIsLoading(false)
    }
  }

  const updateSettings = async (updates: Partial<AppSettings>) => {
    if (!user) {
      throw new Error('User must be authenticated to update settings')
    }

    try {
      setError(null)
      
      const savedSettings = await updateSettingsFirestore(updates)
      setSettings(savedSettings)
    } catch (error) {
      console.error('Error updating settings:', error)
      setError(error instanceof Error ? error.message : 'Failed to update settings')
      throw error
    }
  }

  const resetSettings = async () => {
    if (!user) {
      throw new Error('User must be authenticated to reset settings')
    }

    try {
      setError(null)
      
      const resetSettingsData = await resetSettingsFirestore()
      setSettings(resetSettingsData)
    } catch (error) {
      console.error('Error resetting settings:', error)
      setError(error instanceof Error ? error.message : 'Failed to reset settings')
      throw error
    }
  }

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
        resetSettings,
        isLoading,
        error,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}

// Utility hooks for specific settings
export function useCurrency() {
  const { settings } = useSettings()
  
  const formatCurrency = (amount: number): string => {
    // Handle invalid or null/undefined values
    if (typeof amount !== 'number' || isNaN(amount)) {
      return `${settings.currency.symbol}0${settings.currency.decimals > 0 ? '.00' : ''}`
    }

    // Ensure we're working with a positive number for display
    const absoluteAmount = Math.abs(amount)
    
    const formattedAmount = settings.currency.decimals === 0 
      ? Math.round(absoluteAmount).toString() 
      : absoluteAmount.toFixed(settings.currency.decimals)
    
    const prefix = amount < 0 ? '-' : ''
    
    return settings.currency.position === 'before' 
      ? `${prefix}${settings.currency.symbol}${formattedAmount}` 
      : `${prefix}${formattedAmount}${settings.currency.symbol}`
  }

  return {
    currency: settings.currency,
    formatCurrency
  }
}

export function useDateFormat() {
  const { settings } = useSettings()
  
  const formatDate = (date: string | Date): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    
    if (isNaN(dateObj.getTime())) {
      return 'Invalid Date'
    }

    const day = dateObj.getDate().toString().padStart(2, '0')
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0')
    const year = dateObj.getFullYear()

    switch (settings.display.dateFormat) {
      case 'DD/MM/YYYY':
        return `${day}/${month}/${year}`
      case 'YYYY-MM-DD':
        return `${year}-${month}-${day}`
      case 'MM/DD/YYYY':
      default:
        return `${month}/${day}/${year}`
    }
  }

  return {
    dateFormat: settings.display.dateFormat,
    formatDate
  }
}

export function useFieldOptions() {
  const { settings } = useSettings()
  
  return {
    species: settings.fieldOptions.species,
    breeds: settings.fieldOptions.breeds,
    colors: settings.fieldOptions.colors,
    measurementUnits: settings.fieldOptions.measurementUnits,
    customFields: settings.fieldOptions.customFields
  }
} 