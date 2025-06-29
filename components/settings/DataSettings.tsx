'use client'

import { useState } from 'react'
import { Download, FileText, Shield } from 'lucide-react'

interface DataSettingsProps {
  onExport: (format: 'json' | 'csv' | 'pdf') => void
}

export default function DataSettings({ onExport }: DataSettingsProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [exportFormat, setExportFormat] = useState<'json' | 'csv' | 'pdf'>('json')

  const handleExport = async () => {
    setIsExporting(true)
    try {
      await onExport(exportFormat)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg">
          <Shield className="h-5 w-5 text-orange-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-earth-900">Data Management</h2>
          <p className="text-earth-600">Export and manage your pet data</p>
        </div>
      </div>

      {/* Data Export */}
      <div className="card bg-blue-50 border-blue-200">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 mt-1">
            <Download className="h-6 w-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-earth-900 mb-2">Export Data</h3>
            <p className="text-earth-600 mb-4">
              Download your pet data in various formats for backup or migration purposes.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div>
                <label htmlFor="exportFormat" className="form-label">
                  Export Format
                </label>
                <select
                  id="exportFormat"
                  value={exportFormat}
                  onChange={(e) => setExportFormat(e.target.value as 'json' | 'csv' | 'pdf')}
                  className="form-input w-40"
                >
                  <option value="json">JSON</option>
                  <option value="csv">CSV</option>
                  <option value="pdf">PDF</option>
                </select>
              </div>
              
              <button
                onClick={handleExport}
                disabled={isExporting}
                className="btn-primary flex items-center space-x-2 mt-6 sm:mt-0"
              >
                <Download className="h-4 w-4" />
                <span>{isExporting ? 'Exporting...' : 'Export Data'}</span>
              </button>
            </div>

            <div className="mt-4 text-sm text-earth-600">
              <div className="space-y-1">
                <div><strong>JSON:</strong> Complete data with all fields and relationships</div>
                <div><strong>CSV:</strong> Spreadsheet format with basic animal information</div>
                <div><strong>PDF:</strong> Formatted report with photos and summaries</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Data Information */}
      <div className="card bg-sage-50 border-sage-200">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 mt-1">
            <FileText className="h-6 w-6 text-sage-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-earth-900 mb-2">Data Storage</h3>
            <p className="text-earth-600 mb-4">
              Your pet data is stored locally in your browser and on your device. 
              Regular exports are recommended to prevent data loss.
            </p>
            
            <div className="bg-white p-4 rounded-lg border border-sage-300">
              <h4 className="font-semibold text-earth-800 mb-2">What's included in exports:</h4>
              <ul className="text-sm text-earth-600 space-y-1">
                <li>• Basic animal information (name, species, breed, etc.)</li>
                <li>• Medical records and notes</li>
                <li>• Weight and height measurements</li>
                <li>• Event timeline and activity logs</li>
                <li>• Profile pictures and attachments</li>
                <li>• Custom settings and preferences</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 