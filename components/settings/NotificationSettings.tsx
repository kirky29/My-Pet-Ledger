'use client'

import { NotificationSettings as NotificationSettingsType } from '@/types/settings'
import { Bell, Mail, Calendar, Shield } from 'lucide-react'

interface NotificationSettingsProps {
  settings: NotificationSettingsType
  onChange: (updates: Partial<NotificationSettingsType>) => void
}

export default function NotificationSettings({ settings, onChange }: NotificationSettingsProps) {
  const handleToggle = (field: keyof NotificationSettingsType, value: boolean) => {
    onChange({ [field]: value })
  }

  const handleEmailChange = (email: string) => {
    onChange({ emailAddress: email })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-lg">
          <Bell className="h-5 w-5 text-indigo-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-earth-900">Notification Settings</h2>
          <p className="text-earth-600">Configure alerts and reminders for your pets</p>
        </div>
      </div>

      {/* Email Address */}
      <div className="card bg-blue-50 border-blue-200">
        <div className="flex items-center space-x-3 mb-4">
          <Mail className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-earth-900">Email Address</h3>
        </div>
        
        <div>
          <label htmlFor="emailAddress" className="form-label">
            Notification Email
          </label>
          <input
            type="email"
            id="emailAddress"
            value={settings.emailAddress || ''}
            onChange={(e) => handleEmailChange(e.target.value)}
            className="form-input"
            placeholder="your.email@example.com"
          />
          <p className="text-sm text-earth-600 mt-1">
            Email address where you want to receive pet reminders and notifications
          </p>
        </div>
      </div>

      {/* Notification Toggles */}
      <div className="space-y-4">
        {/* Email Reminders */}
        <div className="card bg-green-50 border-green-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-green-600" />
              <div>
                <h3 className="text-lg font-semibold text-earth-900">Email Reminders</h3>
                <p className="text-earth-600">Receive email notifications for important pet events</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.emailReminders}
                onChange={(e) => handleToggle('emailReminders', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="card bg-purple-50 border-purple-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-purple-600" />
              <div>
                <h3 className="text-lg font-semibold text-earth-900">Upcoming Appointments</h3>
                <p className="text-earth-600">Get reminded about scheduled veterinary appointments</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.upcomingAppointments}
                onChange={(e) => handleToggle('upcomingAppointments', e.target.checked)}
                className="sr-only peer"
                disabled={!settings.emailReminders}
              />
              <div className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600 ${!settings.emailReminders ? 'opacity-50' : ''}`}></div>
            </label>
          </div>
          {!settings.emailReminders && (
            <p className="text-sm text-gray-500 mt-2">Enable email reminders first</p>
          )}
        </div>

        {/* Vaccination Reminders */}
        <div className="card bg-red-50 border-red-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="h-5 w-5 text-red-600" />
              <div>
                <h3 className="text-lg font-semibold text-earth-900">Vaccination Reminders</h3>
                <p className="text-earth-600">Stay on top of your pet's vaccination schedule</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.vaccinationReminders}
                onChange={(e) => handleToggle('vaccinationReminders', e.target.checked)}
                className="sr-only peer"
                disabled={!settings.emailReminders}
              />
              <div className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600 ${!settings.emailReminders ? 'opacity-50' : ''}`}></div>
            </label>
          </div>
          {!settings.emailReminders && (
            <p className="text-sm text-gray-500 mt-2">Enable email reminders first</p>
          )}
        </div>

        {/* Birthday Reminders */}
        <div className="card bg-pink-50 border-pink-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-pink-600" />
              <div>
                <h3 className="text-lg font-semibold text-earth-900">Birthday Reminders</h3>
                <p className="text-earth-600">Never forget your pet's special day</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.birthdayReminders}
                onChange={(e) => handleToggle('birthdayReminders', e.target.checked)}
                className="sr-only peer"
                disabled={!settings.emailReminders}
              />
              <div className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600 ${!settings.emailReminders ? 'opacity-50' : ''}`}></div>
            </label>
          </div>
          {!settings.emailReminders && (
            <p className="text-sm text-gray-500 mt-2">Enable email reminders first</p>
          )}
        </div>
      </div>

      {/* Preview/Status */}
      <div className="card bg-earth-50 border-earth-200">
        <h3 className="text-lg font-semibold text-earth-900 mb-4">Notification Summary</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-earth-700">Email notifications:</span>
            <span className={`font-semibold ${settings.emailReminders ? 'text-green-600' : 'text-red-600'}`}>
              {settings.emailReminders ? 'Enabled' : 'Disabled'}
            </span>
          </div>
          {settings.emailReminders && (
            <>
              <div className="flex justify-between">
                <span className="text-earth-700">Email address:</span>
                <span className="font-semibold text-earth-900">
                  {settings.emailAddress || 'Not set'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-earth-700">Active reminders:</span>
                <span className="font-semibold text-earth-900">
                  {[
                    settings.upcomingAppointments && 'Appointments',
                    settings.vaccinationReminders && 'Vaccinations',
                    settings.birthdayReminders && 'Birthdays'
                  ].filter(Boolean).join(', ') || 'None'}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
} 