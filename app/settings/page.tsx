'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Settings, Save, RefreshCw, ArrowLeft } from 'lucide-react'
import { useSettings } from '@/lib/settings-context'
import { AppSettings } from '@/types/settings'
import CurrencySettings from '@/components/settings/CurrencySettings'
import FieldOptionsSettings from '@/components/settings/FieldOptionsSettings'
import DisplaySettings from '@/components/settings/DisplaySettings'
import NotificationSettings from '@/components/settings/NotificationSettings'
import DataSettings from '@/components/settings/DataSettings'

type SettingsTab = 'currency' | 'fields' | 'display' | 'notifications' | 'data'

const tabs = [
  { id: 'currency' as SettingsTab, label: 'Currency', icon: '💰' },
  { id: 'fields' as SettingsTab, label: 'Field Options', icon: '📋' },
  { id: 'display' as SettingsTab, label: 'Display', icon: '🖥️' },
  { id: 'notifications' as SettingsTab, label: 'Notifications', icon: '🔔' },
  { id: 'data' as SettingsTab, label: 'Data', icon: '📊' },
]

export default function SettingsPage() {
  const router = useRouter()
  const { settings, updateSettings, resetSettings, isLoading, error } = useSettings()
  const [activeTab, setActiveTab] = useState<SettingsTab>('currency')
  const [localSettings, setLocalSettings] = useState<AppSettings>(settings)
  const [hasChanges, setHasChanges] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isResetting, setIsResetting] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  // Update local settings when global settings change
  useEffect(() => {
    setLocalSettings(settings)
    setHasChanges(false)
  }, [settings])

  // Check for changes
  useEffect(() => {
    const hasChanges = JSON.stringify(localSettings) !== JSON.stringify(settings)
    setHasChanges(hasChanges)
  }, [localSettings, settings])

  const handleCurrencyChange = (updates: Partial<typeof settings.currency>) => {
    setLocalSettings(prev => ({
      ...prev,
      currency: { ...prev.currency, ...updates }
    }))
  }

  const handleFieldOptionsChange = (updates: Partial<typeof settings.fieldOptions>) => {
    setLocalSettings(prev => ({
      ...prev,
      fieldOptions: { ...prev.fieldOptions, ...updates }
    }))
  }

  const handleDisplayChange = (updates: Partial<typeof settings.display>) => {
    setLocalSettings(prev => ({
      ...prev,
      display: { ...prev.display, ...updates }
    }))
  }

  const handleNotificationsChange = (updates: Partial<typeof settings.notifications>) => {
    setLocalSettings(prev => ({
      ...prev,
      notifications: { ...prev.notifications, ...updates }
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    setSaveError(null)
    
    try {
      await updateSettings(localSettings)
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Failed to save settings')
    }
    
    setIsSaving(false)
  }

  const handleReset = async () => {
    if (!confirm('Are you sure you want to reset all settings to defaults? This action cannot be undone.')) {
      return
    }

    setIsResetting(true)
    setSaveError(null)
    
    try {
      await resetSettings()
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Failed to reset settings')
    }
    
    setIsResetting(false)
  }

  const handleExport = async (format: 'json' | 'csv' | 'pdf') => {
    try {
      const response = await fetch(`/api/export?format=${format}`)
      
      if (!response.ok) {
        throw new Error('Export failed')
      }
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `pet-data-${format}-${new Date().toISOString().split('T')[0]}.${format}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Export failed:', error)
      alert('Export failed. Please try again.')
    }
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'currency':
        return (
          <CurrencySettings
            settings={localSettings.currency}
            onChange={handleCurrencyChange}
          />
        )
      case 'fields':
        return (
          <FieldOptionsSettings
            settings={localSettings.fieldOptions}
            onChange={handleFieldOptionsChange}
          />
        )
      case 'display':
        return (
          <DisplaySettings
            settings={localSettings.display}
            onChange={handleDisplayChange}
          />
        )
      case 'notifications':
        return (
          <NotificationSettings
            settings={localSettings.notifications}
            onChange={handleNotificationsChange}
          />
        )
      case 'data':
        return (
          <DataSettings
            onExport={handleExport}
          />
        )
      default:
        return null
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-earth-600">Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/')}
              className="p-2 text-earth-600 hover:text-earth-800 hover:bg-earth-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-earth-900">Settings</h1>
                <p className="text-earth-600">Customize your Pet Ledger experience</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <button
              onClick={handleReset}
              disabled={isResetting}
              className="btn-secondary flex items-center space-x-2"
            >
              <RefreshCw className={`h-4 w-4 ${isResetting ? 'animate-spin' : ''}`} />
              <span>{isResetting ? 'Resetting...' : 'Reset'}</span>
            </button>
            <button
              onClick={handleSave}
              disabled={!hasChanges || isSaving}
              className="btn-primary flex items-center space-x-2 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </div>

        {/* Error Display */}
        {(error || saveError) && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error || saveError}</p>
          </div>
        )}

        {/* Changes Indicator */}
        {hasChanges && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800">
              You have unsaved changes. Don't forget to save your settings.
            </p>
          </div>
        )}

        {/* Settings Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="card p-0 overflow-hidden">
              <div className="p-4 bg-gradient-to-r from-primary-500 to-primary-600">
                <h2 className="text-white font-semibold">Settings Categories</h2>
              </div>
              <nav className="space-y-1 p-2">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary-100 text-primary-700 border border-primary-200'
                        : 'text-earth-600 hover:bg-earth-50 hover:text-earth-800'
                    }`}
                  >
                    <span className="text-lg">{tab.icon}</span>
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="card">
              {renderActiveTab()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 