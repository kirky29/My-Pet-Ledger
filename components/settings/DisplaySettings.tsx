'use client'

import { DisplaySettings as DisplaySettingsType } from '@/types/settings'
import { Monitor, Calendar, Languages, Eye, Grid, List } from 'lucide-react'

interface DisplaySettingsProps {
  settings: DisplaySettingsType
  onChange: (updates: Partial<DisplaySettingsType>) => void
}

export default function DisplaySettings({ settings, onChange }: DisplaySettingsProps) {
  const handleInputChange = (field: keyof DisplaySettingsType, value: any) => {
    onChange({ [field]: value })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg">
          <Monitor className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-earth-900">Display Settings</h2>
          <p className="text-earth-600">Configure how information is displayed throughout the app</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Date Format */}
        <div>
          <label htmlFor="dateFormat" className="form-label flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>Date Format</span>
          </label>
          <select
            id="dateFormat"
            value={settings.dateFormat}
            onChange={(e) => handleInputChange('dateFormat', e.target.value)}
            className="form-input"
          >
            <option value="MM/DD/YYYY">MM/DD/YYYY (US Format)</option>
            <option value="DD/MM/YYYY">DD/MM/YYYY (European Format)</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD (ISO Format)</option>
          </select>
          <p className="text-sm text-earth-600 mt-1">
            Choose how dates are displayed throughout the application
          </p>
        </div>

        {/* Language */}
        <div>
          <label htmlFor="language" className="form-label flex items-center space-x-2">
            <Languages className="h-4 w-4" />
            <span>Language</span>
          </label>
          <select
            id="language"
            value={settings.language}
            onChange={(e) => handleInputChange('language', e.target.value)}
            className="form-input"
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
            <option value="it">Italiano</option>
            <option value="pt">Português</option>
          </select>
          <p className="text-sm text-earth-600 mt-1">
            Select your preferred language (Coming Soon)
          </p>
        </div>

        {/* Default View */}
        <div>
          <label htmlFor="defaultView" className="form-label flex items-center space-x-2">
            <Grid className="h-4 w-4" />
            <span>Default View</span>
          </label>
          <select
            id="defaultView"
            value={settings.defaultView}
            onChange={(e) => handleInputChange('defaultView', e.target.value)}
            className="form-input"
          >
            <option value="grid">Grid View</option>
            <option value="list">List View</option>
          </select>
          <p className="text-sm text-earth-600 mt-1">
            Choose how animals are displayed by default
          </p>
        </div>

        {/* Items Per Page */}
        <div>
          <label htmlFor="itemsPerPage" className="form-label">
            Items Per Page
          </label>
          <select
            id="itemsPerPage"
            value={settings.itemsPerPage}
            onChange={(e) => handleInputChange('itemsPerPage', parseInt(e.target.value))}
            className="form-input"
          >
            <option value={6}>6 items</option>
            <option value={12}>12 items</option>
            <option value={18}>18 items</option>
            <option value={24}>24 items</option>
            <option value={36}>36 items</option>
          </select>
          <p className="text-sm text-earth-600 mt-1">
            Number of animals to show per page
          </p>
        </div>
      </div>

      {/* Show Deceased Animals */}
      <div className="card bg-yellow-50 border-yellow-200">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 mt-1">
            <Eye className="h-5 w-5 text-yellow-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-earth-900">Show Deceased Animals</h3>
                <p className="text-earth-600 mt-1">
                  When enabled, deceased animals will be visible in animal lists and the dashboard. 
                  When disabled, they'll be hidden but still accessible through direct links.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.showDeceased}
                  onChange={(e) => handleInputChange('showDeceased', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Section */}
      <div className="card bg-sage-50 border-sage-200">
        <h3 className="text-lg font-semibold text-earth-900 mb-4 flex items-center space-x-2">
          <Monitor className="h-5 w-5" />
          <span>Preview</span>
        </h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-earth-700">Date format:</span>
            <span className="font-medium text-earth-900">
              {settings.dateFormat === 'MM/DD/YYYY' && '12/25/2024'}
              {settings.dateFormat === 'DD/MM/YYYY' && '25/12/2024'}
              {settings.dateFormat === 'YYYY-MM-DD' && '2024-12-25'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-earth-700">View mode:</span>
            <span className="font-medium text-earth-900 flex items-center space-x-1">
              {settings.defaultView === 'grid' ? <Grid className="h-4 w-4" /> : <List className="h-4 w-4" />}
              <span className="capitalize">{settings.defaultView}</span>
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-earth-700">Show deceased:</span>
            <span className="font-medium text-earth-900">
              {settings.showDeceased ? 'Yes' : 'No'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
} 