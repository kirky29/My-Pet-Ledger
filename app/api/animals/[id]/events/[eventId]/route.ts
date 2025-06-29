import { NextRequest, NextResponse } from 'next/server'
import { updateEventEntry, deleteEventEntry } from '@/lib/firestore-data'
import { EventType } from '@/types/animal'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; eventId: string } }
) {
  try {
    const eventData = await request.json()
    
    // Basic validation
    if (!eventData.type || !eventData.title?.trim() || !eventData.date) {
      return NextResponse.json(
        { error: 'Missing required fields: type, title, date' },
        { status: 400 }
      )
    }

    // Validate date format
    if (isNaN(Date.parse(eventData.date))) {
      return NextResponse.json(
        { error: 'Invalid date format' },
        { status: 400 }
      )
    }

    // Validate cost if provided
    if (eventData.cost !== undefined && (isNaN(eventData.cost) || eventData.cost < 0)) {
      return NextResponse.json(
        { error: 'Cost must be a valid positive number' },
        { status: 400 }
      )
    }

    // Validate event type
    const validTypes: EventType[] = [
      'medical', 'surgical', 'behavioral', 'lifecycle', 
      'grooming', 'nutrition', 'exercise', 'general'
    ]
    
    if (!validTypes.includes(eventData.type)) {
      return NextResponse.json(
        { error: 'Invalid event type' },
        { status: 400 }
      )
    }

    const animal = await updateEventEntry(params.id, params.eventId, eventData)
    
    if (!animal) {
      return NextResponse.json(
        { error: 'Animal or event not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(animal)
  } catch (error) {
    console.error('Error updating event:', error)
    return NextResponse.json(
      { error: 'Failed to update event' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; eventId: string } }
) {
  try {
    const animal = await deleteEventEntry(params.id, params.eventId)
    
    if (!animal) {
      return NextResponse.json(
        { error: 'Animal or event not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting event:', error)
    return NextResponse.json(
      { error: 'Failed to delete event' },
      { status: 500 }
    )
  }
} 