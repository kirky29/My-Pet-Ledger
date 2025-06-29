'use client'

import { useState, useEffect } from 'react'
import { EventEntry, EventType } from '@/types/animal'
import { Save, X } from 'lucide-react'
import { useCurrency } from '@/lib/settings-context'

interface AddEventFormProps {
  animalId: string
  event?: EventEntry | null
  onSuccess: () => void
  onCancel: () => void
}

export default function AddEventForm({ animalId, event, onSuccess, onCancel }: AddEventFormProps) {
  const { currency, formatCurrency } = useCurrency()
  
  const [formData, setFormData] = useState({
    type: 'general' as EventType,
    title: '',
    description: '',
    notes: '',
    date: new Date().toISOString().split('T')[0], // Today's date
    veterinarian: '',
    cost: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Pre-populate form when editing
  useEffect(() => {
    if (event) {
      setFormData({
        type: event.type,
        title: event.title,
        description: event.description || '',
        notes: event.notes || '',
        date: event.date.includes('T') ? event.date.split('T')[0] : event.date, // Handle both ISO and date-only formats
        veterinarian: event.veterinarian || '',
        cost: event.cost?.toString() || '',
      })
    }
  }, [event])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }

    if (!formData.date) {
      newErrors.date = 'Date is required'
    }

    if (formData.cost && isNaN(parseFloat(formData.cost))) {
      newErrors.cost = 'Cost must be a valid number'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const url = event 
        ? `/api/animals/${animalId}/events/${event.id}`
        : `/api/animals/${animalId}/events`
      
      const method = event ? 'PUT' : 'POST'
      
      const eventData = {
        type: formData.type,
        title: formData.title,
        description: formData.description || undefined,
        notes: formData.notes || undefined,
        date: formData.date,
        veterinarian: formData.veterinarian || undefined,
        cost: formData.cost ? parseFloat(formData.cost) : undefined,
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      })

      if (response.ok) {
        onSuccess()
      } else {
        const error = await response.json()
        setErrors({ submit: error.message || `Failed to ${event ? 'update' : 'add'} event` })
      }
    } catch (error) {
      setErrors({ submit: 'Network error. Please try again.' })
    }

    setIsSubmitting(false)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const eventTypes: Array<{ value: EventType; label: string; description: string }> = [
    { value: 'medical', label: 'Medical', description: 'Vaccinations, treatments, checkups, illnesses' },
    { value: 'surgical', label: 'Surgical', description: 'Neutering, spaying, surgeries' },
    { value: 'behavioral', label: 'Behavioral', description: 'Training, behavioral changes, milestones' },
    { value: 'lifecycle', label: 'Lifecycle', description: 'Birth, adoption, death, breeding, pregnancy' },
    { value: 'grooming', label: 'Grooming', description: 'Grooming sessions, nail trims, dental care' },
    { value: 'nutrition', label: 'Nutrition', description: 'Diet changes, feeding schedules' },
    { value: 'exercise', label: 'Exercise', description: 'Exercise routines, activities' },
    { value: 'general', label: 'General', description: 'General notes, observations, other events' },
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-earth-900">
          {event ? 'Edit Event' : 'Add New Event'}
        </h3>
        <button
          type="button"
          onClick={onCancel}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label htmlFor="type" className="form-label">
            Event Type *
          </label>
          <select
            id="type"
            value={formData.type}
            onChange={(e) => handleInputChange('type', e.target.value)}
            className="form-input"
          >
            {eventTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label} - {type.description}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="title" className="form-label">
            Title *
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className={`form-input ${errors.title ? 'border-red-500' : ''}`}
            placeholder="e.g., Annual vaccination, Dental cleaning"
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
        </div>

        <div>
          <label htmlFor="date" className="form-label">
            Date *
          </label>
          <input
            type="date"
            id="date"
            value={formData.date}
            onChange={(e) => handleInputChange('date', e.target.value)}
            className={`form-input ${errors.date ? 'border-red-500' : ''}`}
          />
          {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
        </div>

        {(formData.type === 'medical' || formData.type === 'surgical') && (
          <div>
            <label htmlFor="veterinarian" className="form-label">
              Veterinarian/Clinic
            </label>
            <input
              type="text"
              id="veterinarian"
              value={formData.veterinarian}
              onChange={(e) => handleInputChange('veterinarian', e.target.value)}
              className="form-input"
              placeholder="Dr. Smith, ABC Veterinary Clinic"
            />
          </div>
        )}

        <div>
          <label htmlFor="cost" className="form-label">
            Cost ({currency.symbol})
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.01"
              min="0"
              id="cost"
              value={formData.cost}
              onChange={(e) => handleInputChange('cost', e.target.value)}
              className={`form-input ${errors.cost ? 'border-red-500' : ''}`}
              placeholder="0.00"
            />
            {formData.cost && parseFloat(formData.cost) > 0 && (
              <div className="absolute top-full left-0 mt-1 text-sm text-earth-600">
                Preview: {formatCurrency(parseFloat(formData.cost))}
              </div>
            )}
          </div>
          {errors.cost && <p className="text-red-500 text-sm mt-1">{errors.cost}</p>}
        </div>

        <div className="md:col-span-2">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            id="description"
            rows={3}
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className="form-input"
            placeholder="Brief description of the event..."
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="notes" className="form-label">
            Additional Notes
          </label>
          <textarea
            id="notes"
            rows={3}
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            className="form-input"
            placeholder="Any additional notes, observations, or details..."
          />
        </div>
      </div>

      {errors.submit && (
        <div className="text-red-500 text-sm text-center">
          {errors.submit}
        </div>
      )}

      <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn-primary flex items-center space-x-2"
          disabled={isSubmitting}
        >
          <Save className="h-4 w-4" />
          <span>
            {isSubmitting 
              ? (event ? 'Updating...' : 'Adding...') 
              : (event ? 'Update Event' : 'Add Event')
            }
          </span>
        </button>
      </div>
    </form>
  )
} 