import { NextRequest, NextResponse } from 'next/server'
import { getSettings, updateSettings, resetSettings } from '@/lib/firestore-data'
import { AppSettings, defaultSettings } from '@/types/settings'

export async function GET() {
  try {
    const settings = await getSettings()
    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error reading settings:', error)
    return NextResponse.json(defaultSettings)
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.currency || !body.fieldOptions || !body.display || !body.notifications) {
      return NextResponse.json(
        { error: 'Invalid settings data' },
        { status: 400 }
      )
    }

    const updatedSettings = await updateSettings(body)
    return NextResponse.json(updatedSettings)
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    )
  }
}

export async function DELETE() {
  try {
    const resetSettingsData = await resetSettings()
    return NextResponse.json(resetSettingsData)
  } catch (error) {
    console.error('Error resetting settings:', error)
    return NextResponse.json(
      { error: 'Failed to reset settings' },
      { status: 500 }
    )
  }
} 