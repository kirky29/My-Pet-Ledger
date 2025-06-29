'use client'

import { useState } from 'react'
import { EventEntry, EventType } from '@/types/animal'
import { useCurrency, useDateFormat } from '@/lib/settings-context'
import { 
  Calendar, 
  Stethoscope, 
  Scissors, 
  Brain, 
  Heart, 
  Sparkles, 
  Apple, 
  Activity,
  FileText,
  Plus,
  Edit,
  Trash2,
  DollarSign,
  User
} from 'lucide-react'
import AddEventForm from './AddEventForm'

interface EventTimelineProps {
  events: EventEntry[]
  animalId: string
  onEventAdded: () => void
  onEventUpdated: () => void
  onEventDeleted: () => void
}

const getEventIcon = (type: EventType) => {
  switch (type) {
    case 'medical': return <Stethoscope className="h-5 w-5" />
    case 'surgical': return <Scissors className="h-5 w-5" />
    case 'behavioral': return <Brain className="h-5 w-5" />
    case 'lifecycle': return <Heart className="h-5 w-5" />
    case 'grooming': return <Sparkles className="h-5 w-5" />
    case 'nutrition': return <Apple className="h-5 w-5" />
    case 'exercise': return <Activity className="h-5 w-5" />
    default: return <FileText className="h-5 w-5" />
  }
}

const getEventColor = (type: EventType) => {
  switch (type) {
    case 'medical': return 'bg-red-100 text-red-800 border-red-200'
    case 'surgical': return 'bg-orange-100 text-orange-800 border-orange-200'
    case 'behavioral': return 'bg-purple-100 text-purple-800 border-purple-200'
    case 'lifecycle': return 'bg-pink-100 text-pink-800 border-pink-200'
    case 'grooming': return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'nutrition': return 'bg-green-100 text-green-800 border-green-200'
    case 'exercise': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    default: return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

const getEventTypeLabel = (type: EventType) => {
  switch (type) {
    case 'medical': return 'Medical'
    case 'surgical': return 'Surgical'
    case 'behavioral': return 'Behavioral'
    case 'lifecycle': return 'Lifecycle'
    case 'grooming': return 'Grooming'
    case 'nutrition': return 'Nutrition'
    case 'exercise': return 'Exercise'
    default: return 'General'
  }
}

export default function EventTimeline({ 
  events, 
  animalId, 
  onEventAdded, 
  onEventUpdated, 
  onEventDeleted 
}: EventTimelineProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState<EventEntry | null>(null)
  const [filterType, setFilterType] = useState<EventType | 'all'>('all')
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  
  const { formatCurrency } = useCurrency()
  const { formatDate } = useDateFormat()

  const filteredEvents = filterType === 'all' 
    ? events 
    : events.filter(event => event.type === filterType)

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event? This action cannot be undone.')) return

    setIsDeleting(eventId)

    try {
      const response = await fetch(`/api/animals/${animalId}/events/${eventId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        onEventDeleted()
      } else {
        const errorData = await response.json()
        console.error('Failed to delete event:', errorData)
        alert(errorData.error || 'Failed to delete event')
      }
    } catch (error) {
      console.error('Error deleting event:', error)
      alert('Network error. Please try again.')
    } finally {
      setIsDeleting(null)
    }
  }

  const eventTypes: Array<{ value: EventType | 'all'; label: string }> = [
    { value: 'all', label: 'All Events' },
    { value: 'medical', label: 'Medical' },
    { value: 'surgical', label: 'Surgical' },
    { value: 'behavioral', label: 'Behavioral' },
    { value: 'lifecycle', label: 'Lifecycle' },
    { value: 'grooming', label: 'Grooming' },
    { value: 'nutrition', label: 'Nutrition' },
    { value: 'exercise', label: 'Exercise' },
    { value: 'general', label: 'General' },
  ]

  return (
    <div className="space-y-6">
      {/* Header with Add Button and Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg">
            <Calendar className="h-5 w-5 text-primary-600" />
          </div>
          <h3 className="text-xl font-semibold text-earth-900">Health & Activity Log</h3>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as EventType | 'all')}
            className="form-input text-sm w-40"
          >
            {eventTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          
          <button
            onClick={() => setShowAddForm(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Event</span>
          </button>
        </div>
      </div>

      {/* Add/Edit Event Form */}
      {(showAddForm || editingEvent) && (
        <div className="card">
          <AddEventForm
            animalId={animalId}
            event={editingEvent}
            onSuccess={() => {
              setShowAddForm(false)
              setEditingEvent(null)
              if (editingEvent) {
                onEventUpdated()
              } else {
                onEventAdded()
              }
            }}
            onCancel={() => {
              setShowAddForm(false)
              setEditingEvent(null)
            }}
          />
        </div>
      )}

      {/* Timeline */}
      {filteredEvents.length === 0 ? (
        <div className="card text-center py-12">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-gray-600 mb-2">
            {filterType === 'all' ? 'No events recorded yet' : `No ${getEventTypeLabel(filterType as EventType).toLowerCase()} events`}
          </h4>
          <p className="text-gray-500 mb-6">
            Start building your pet's health and activity timeline by adding their first event.
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className="btn-primary"
          >
            Add First Event
          </button>
        </div>
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-200 via-primary-300 to-primary-200"></div>
          
          <div className="space-y-6">
            {filteredEvents.map((event, index) => (
              <div key={event.id} className="relative flex items-start space-x-4">
                {/* Timeline dot */}
                <div className={`flex-shrink-0 w-16 h-16 rounded-xl border-2 border-white shadow-soft flex items-center justify-center ${getEventColor(event.type)} z-10`}>
                  {getEventIcon(event.type)}
                </div>
                
                {/* Event content */}
                <div className="flex-1 min-w-0">
                  <div className="card hover:shadow-nature transition-shadow duration-200">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="text-lg font-semibold text-earth-900">{event.title}</h4>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getEventColor(event.type)}`}>
                            {getEventTypeLabel(event.type)}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-earth-600 space-x-4">
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {formatDate(event.date)}
                          </span>
                          {event.veterinarian && (
                            <span className="flex items-center">
                              <User className="h-4 w-4 mr-1" />
                              {event.veterinarian}
                            </span>
                          )}
                          {event.cost && (
                            <span className="flex items-center">
                              <DollarSign className="h-4 w-4 mr-1" />
                              {formatCurrency(event.cost)}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setEditingEvent(event)}
                          className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          title="Edit event"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event.id)}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete event"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    {event.description && (
                      <p className="text-earth-700 mb-3">{event.description}</p>
                    )}
                    
                    {event.notes && (
                      <div className="bg-sage-50 p-3 rounded-lg">
                        <p className="text-sm text-earth-600">{event.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 