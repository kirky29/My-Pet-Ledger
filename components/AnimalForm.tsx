'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { AnimalFormData, AnimalSpecies, Animal } from '@/types/animal'
import { getDefaultHeightUnit, getDefaultWeightUnit, getSpeciesDisplayName } from '@/lib/utils'
import { useFieldOptions } from '@/lib/settings-context'
import { useAuth } from '@/lib/auth-context'
import { debugLog } from './DebugLogger'
import { Heart, Calendar, Scale, Stethoscope, Camera, X } from 'lucide-react'

const animalSpecies: AnimalSpecies[] = [
  'horse', 'dog', 'cat', 'pig', 'goat', 'llama', 'alpaca', 
  'ferret', 'parrot', 'bird-of-prey', 'rabbit', 'sheep', 
  'cow', 'chicken', 'duck', 'other'
]

// Species-specific sex options
const getSexOptions = (species: AnimalSpecies) => {
  const baseOptions = [
    { value: 'unknown', label: 'Unknown' },
  ]

  const speciesOptions: Record<AnimalSpecies, Array<{ value: string; label: string }>> = {
    horse: [
      { value: 'stallion', label: 'Stallion (intact male)' },
      { value: 'gelding', label: 'Gelding (castrated male)' },
      { value: 'mare', label: 'Mare (female)' },
      { value: 'filly', label: 'Filly (young female)' },
      { value: 'colt', label: 'Colt (young male)' },
    ],
    dog: [
      { value: 'male', label: 'Male (intact)' },
      { value: 'neutered', label: 'Neutered (male)' },
      { value: 'female', label: 'Female (intact)' },
      { value: 'spayed', label: 'Spayed (female)' },
    ],
    cat: [
      { value: 'tom', label: 'Tom (intact male)' },
      { value: 'neutered', label: 'Neutered (male)' },
      { value: 'queen', label: 'Queen (intact female)' },
      { value: 'spayed', label: 'Spayed (female)' },
    ],
    cow: [
      { value: 'bull', label: 'Bull (intact male)' },
      { value: 'steer', label: 'Steer (castrated male)' },
      { value: 'cow', label: 'Cow (female)' },
      { value: 'heifer', label: 'Heifer (young female)' },
    ],
    pig: [
      { value: 'boar', label: 'Boar (intact male)' },
      { value: 'barrow', label: 'Barrow (castrated male)' },
      { value: 'sow', label: 'Sow (female)' },
      { value: 'gilt', label: 'Gilt (young female)' },
    ],
    goat: [
      { value: 'buck', label: 'Buck (intact male)' },
      { value: 'wether', label: 'Wether (castrated male)' },
      { value: 'doe', label: 'Doe (female)' },
    ],
    sheep: [
      { value: 'ram', label: 'Ram (intact male)' },
      { value: 'wether', label: 'Wether (castrated male)' },
      { value: 'ewe', label: 'Ewe (female)' },
    ],
    chicken: [
      { value: 'rooster', label: 'Rooster (male)' },
      { value: 'capon', label: 'Capon (castrated male)' },
      { value: 'hen', label: 'Hen (female)' },
    ],
    duck: [
      { value: 'drake', label: 'Drake (male)' },
      { value: 'duck', label: 'Duck (female)' },
    ],
    rabbit: [
      { value: 'buck', label: 'Buck (male)' },
      { value: 'doe', label: 'Doe (female)' },
    ],
    llama: [
      { value: 'male', label: 'Male' },
      { value: 'female', label: 'Female' },
    ],
    alpaca: [
      { value: 'male', label: 'Male' },
      { value: 'female', label: 'Female' },
    ],
    ferret: [
      { value: 'hob', label: 'Hob (male)' },
      { value: 'jill', label: 'Jill (female)' },
    ],
    parrot: [
      { value: 'male', label: 'Male' },
      { value: 'female', label: 'Female' },
    ],
    'bird-of-prey': [
      { value: 'tiercel', label: 'Tiercel (male)' },
      { value: 'falcon', label: 'Falcon (female)' },
    ],
    other: [
      { value: 'male', label: 'Male' },
      { value: 'female', label: 'Female' },
    ],
  }

  return [...baseOptions, ...(speciesOptions[species] || speciesOptions.other)]
}

interface AnimalFormProps {
  animal?: Animal
  isEdit?: boolean
}

export default function AnimalForm({ animal, isEdit = false }: AnimalFormProps) {
  const router = useRouter()
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [profilePicture, setProfilePicture] = useState<File | null>(null)
  const [profilePicturePreview, setProfilePicturePreview] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const { species: availableSpecies, colors: availableColors, measurementUnits } = useFieldOptions()
  
  const [formData, setFormData] = useState<AnimalFormData>({
    name: '',
    species: 'dog',
    breed: '',
    dateOfBirth: '',
    deathDate: '',
    sex: 'unknown',
    color: '',
    markings: '',
    initialWeight: '',
    weightUnit: 'lbs',
    initialHeight: '',
    heightUnit: 'inches',
    heightMeasurementType: 'shoulder',
    medicalNotes: '',
    specialNeeds: '',
    microchipId: '',
    registrationNumber: '',
    ownerName: 'Pet Owner',
    ownerEmail: '',
    ownerPhone: '',
    ownerAddress: '',
  })

  // Pre-populate form when editing
  useEffect(() => {
    if (isEdit && animal) {
      const latestWeight = animal.weight[animal.weight.length - 1]
      const latestHeight = animal.height[animal.height.length - 1]
      
      setFormData({
        name: animal.name,
        species: animal.species,
        breed: animal.breed || '',
        dateOfBirth: animal.dateOfBirth || '',
        deathDate: animal.deathDate || '',
        sex: animal.sex,
        color: animal.color || '',
        markings: animal.markings || '',
        initialWeight: latestWeight?.weight.toString() || '',
        weightUnit: latestWeight?.unit || 'lbs',
        initialHeight: latestHeight?.height.toString() || '',
        heightUnit: latestHeight?.unit || 'inches',
        heightMeasurementType: latestHeight?.measurementType || 'shoulder',
        medicalNotes: animal.medicalNotes || '',
        specialNeeds: animal.specialNeeds || '',
        microchipId: animal.microchipId || '',
        registrationNumber: animal.registrationNumber || '',
        ownerName: animal.ownerInfo?.name || 'Pet Owner',
        ownerEmail: animal.ownerInfo?.email || '',
        ownerPhone: animal.ownerInfo?.phone || '',
        ownerAddress: animal.ownerInfo?.address || '',
      })
      
      // Set existing profile picture for preview
      if (animal.profilePicture) {
        setProfilePicturePreview(animal.profilePicture)
      }
    }
  }, [isEdit, animal])

  // Debug logging
  useEffect(() => {
    debugLog.info('📋 AnimalForm component mounted', { 
      isEdit, 
      hasAnimal: !!animal,
      animalId: animal?.id,
      userUid: user?.uid,
      availableSpeciesCount: availableSpecies.length
    })
  }, [])

  // Set default species from available species when component loads
  useEffect(() => {
    if (availableSpecies.length > 0 && !isEdit && formData.species === 'dog') {
      // Convert the first available species to lowercase to match AnimalSpecies type
      const defaultSpecies = availableSpecies[0].toLowerCase()
      setFormData(prev => ({ ...prev, species: defaultSpecies as AnimalSpecies }))
      debugLog.info('🐕 Default species set', { defaultSpecies })
    }
  }, [availableSpecies, isEdit, formData.species])

  const handleSpeciesChange = (species: AnimalSpecies) => {
    const sexOptions = getSexOptions(species)
    const currentSexStillValid = sexOptions.some(option => option.value === formData.sex)
    
    setFormData(prev => ({
      ...prev,
      species,
      heightUnit: getDefaultHeightUnit(species),
      weightUnit: getDefaultWeightUnit(species),
      // Reset sex to 'unknown' if current sex option doesn't exist for new species
      sex: currentSexStillValid ? prev.sex : 'unknown',
    }))
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (formData.deathDate && formData.dateOfBirth && formData.deathDate <= formData.dateOfBirth) {
      newErrors.deathDate = 'Death date must be after birth date'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    debugLog.info('🚀 Form submission started', { 
      isEdit, 
      animalName: formData.name,
      hasProfilePicture: !!profilePicture 
    })
    
    if (!validateForm()) {
      debugLog.error('❌ Form validation failed', errors)
      return
    }
    debugLog.success('✅ Form validation passed')

    if (!user) {
      debugLog.error('❌ User not authenticated')
      setErrors({ submit: 'You must be logged in to add an animal' })
      return
    }
    debugLog.info('👤 User authenticated', { uid: user.uid, email: user.email })

    setIsSubmitting(true)

    try {
      debugLog.info('🔑 Getting user ID token...')
      // Get the user's ID token
      const idToken = await user.getIdToken()
      debugLog.success('✅ ID token obtained', { tokenLength: idToken.length })
      
      const url = isEdit && animal ? `/api/animals/${animal.id}` : '/api/animals'
      const method = isEdit ? 'PUT' : 'POST'
      debugLog.info(`📡 Preparing ${method} request to ${url}`)
      
      // Use FormData for file upload
      const formDataToSubmit = new FormData()
      
      // Add all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== '') {
          formDataToSubmit.append(key, value)
        }
      })
      debugLog.info('📝 Form data prepared', { 
        fields: Object.keys(formData).filter(key => formData[key as keyof AnimalFormData] !== ''),
        totalFields: Object.keys(formData).length
      })
      
      // Add profile picture if selected
      if (profilePicture) {
        formDataToSubmit.append('profilePicture', profilePicture)
        debugLog.info('📷 Profile picture added', { 
          fileName: profilePicture.name,
          fileSize: profilePicture.size,
          fileType: profilePicture.type
        })
      }
      
      debugLog.info('🌐 Sending API request...')
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${idToken}`
        },
        body: formDataToSubmit, // Don't set Content-Type header, let browser set it with boundary
      })

      debugLog.info('📨 API response received', { 
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries())
      })

      if (response.ok) {
        const resultAnimal = await response.json()
        debugLog.success('🎉 Animal created successfully!', { 
          animalId: resultAnimal.id,
          animalName: resultAnimal.name
        })
        router.push(`/animals/${resultAnimal.id}`)
      } else {
        const errorText = await response.text()
        let errorData
        try {
          errorData = JSON.parse(errorText)
        } catch {
          errorData = { error: errorText }
        }
        
        debugLog.error('❌ API Error Response', { 
          status: response.status,
          statusText: response.statusText,
          errorData,
          errorText
        })
        
        setErrors({ submit: errorData.error || `Failed to ${isEdit ? 'update' : 'add'} animal` })
      }
    } catch (error) {
      debugLog.error('💥 Network/Fetch Error', { 
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        errorStack: error instanceof Error ? error.stack : undefined,
        error
      })
      console.error('Error submitting form:', error)
      setErrors({ submit: 'Network error. Please try again.' })
    }

    setIsSubmitting(false)
    debugLog.info('🏁 Form submission completed')
  }

  const handleInputChange = (field: keyof AnimalFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, profilePicture: 'Please select an image file' }))
        return
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, profilePicture: 'Image must be less than 5MB' }))
        return
      }
      
      setProfilePicture(file)
      setErrors(prev => ({ ...prev, profilePicture: '' }))
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfilePicturePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveProfilePicture = () => {
    setProfilePicture(null)
    setProfilePicturePreview('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <div>
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg">
            <Heart className="h-5 w-5 text-primary-600" />
          </div>
          <h2 className="text-2xl font-semibold text-earth-900">Basic Information</h2>
        </div>
        {/* Profile Picture Upload */}
        <div className="mb-8">
          <label className="form-label">Profile Picture</label>
          <div className="flex items-start space-x-6">
            {/* Preview */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-xl overflow-hidden border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center relative">
                {profilePicturePreview ? (
                  <>
                    <Image
                      src={profilePicturePreview}
                      alt="Profile preview"
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveProfilePicture}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </>
                ) : (
                  <div className="text-center">
                    <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No image</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Upload Controls */}
            <div className="flex-1">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleProfilePictureChange}
                className="hidden"
                id="profilePicture"
              />
              <label
                htmlFor="profilePicture"
                className="cursor-pointer inline-flex items-center space-x-2 bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Camera className="h-4 w-4" />
                <span>Choose Image</span>
              </label>
              <p className="text-sm text-gray-500 mt-2">
                Upload a profile picture for your pet. Supports JPG, PNG, GIF up to 5MB.
              </p>
              {errors.profilePicture && (
                <p className="text-red-500 text-sm mt-1">{errors.profilePicture}</p>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="form-label">
              Animal Name *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`form-input ${errors.name ? 'border-red-500' : ''}`}
              placeholder="Enter animal's name"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="species" className="form-label">
              Species *
            </label>
            <select
              id="species"
              value={formData.species}
              onChange={(e) => handleSpeciesChange(e.target.value as AnimalSpecies)}
              className="form-input"
            >
              {availableSpecies.map(species => {
                const speciesValue = species.toLowerCase()
                return (
                  <option key={speciesValue} value={speciesValue}>
                    {species}
                  </option>
                )
              })}
            </select>
          </div>

          <div>
            <label htmlFor="breed" className="form-label">
              Breed
            </label>
            <input
              type="text"
              id="breed"
              value={formData.breed}
              onChange={(e) => handleInputChange('breed', e.target.value)}
              className="form-input"
              placeholder="Enter breed (optional)"
            />
          </div>

          <div>
            <label htmlFor="sex" className="form-label">
              Sex
            </label>
            <select
              id="sex"
              value={formData.sex}
              onChange={(e) => handleInputChange('sex', e.target.value)}
              className="form-input"
            >
              {getSexOptions(formData.species).map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="color" className="form-label">
              Color/Coat
            </label>
            <select
              id="color"
              value={formData.color}
              onChange={(e) => handleInputChange('color', e.target.value)}
              className="form-input"
            >
              <option value="">Select a color...</option>
              {availableColors.map(color => (
                <option key={color} value={color}>
                  {color}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="markings" className="form-label">
              Markings
            </label>
            <input
              type="text"
              id="markings"
              value={formData.markings}
              onChange={(e) => handleInputChange('markings', e.target.value)}
              className="form-input"
              placeholder="Distinctive markings or features"
            />
          </div>
        </div>
      </div>

      {/* Dates */}
      <div>
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-secondary-100 to-secondary-200 rounded-lg">
            <Calendar className="h-5 w-5 text-secondary-600" />
          </div>
          <h2 className="text-2xl font-semibold text-earth-900">Important Dates</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="dateOfBirth" className="form-label">
              Date of Birth
            </label>
            <input
              type="date"
              id="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
              className={`form-input ${errors.dateOfBirth ? 'border-red-500' : ''}`}
            />
            {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>}
          </div>

          <div>
            <label htmlFor="deathDate" className="form-label">
              Date of Death (if applicable)
            </label>
            <input
              type="date"
              id="deathDate"
              value={formData.deathDate}
              onChange={(e) => handleInputChange('deathDate', e.target.value)}
              className={`form-input ${errors.deathDate ? 'border-red-500' : ''}`}
            />
            {errors.deathDate && <p className="text-red-500 text-sm mt-1">{errors.deathDate}</p>}
          </div>
        </div>
      </div>

      {/* Initial Measurements */}
      <div>
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-forest-100 to-forest-200 rounded-lg">
            <Scale className="h-5 w-5 text-forest-600" />
          </div>
          <h2 className="text-2xl font-semibold text-earth-900">Initial Measurements</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="form-label">Initial Weight</label>
            <div className="flex space-x-2">
              <input
                type="number"
                step="0.1"
                value={formData.initialWeight}
                onChange={(e) => handleInputChange('initialWeight', e.target.value)}
                className="form-input flex-1"
                placeholder="0.0"
              />
              <select
                value={formData.weightUnit}
                onChange={(e) => handleInputChange('weightUnit', e.target.value as 'lbs' | 'kg')}
                className="form-input w-20"
              >
                {measurementUnits.weight.map(unit => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="form-label">Initial Height</label>
            <div className="flex space-x-2">
              <input
                type="number"
                step="0.1"
                value={formData.initialHeight}
                onChange={(e) => handleInputChange('initialHeight', e.target.value)}
                className="form-input flex-1"
                placeholder="0.0"
              />
              <select
                value={formData.heightUnit}
                onChange={(e) => handleInputChange('heightUnit', e.target.value as 'inches' | 'cm' | 'hands')}
                className="form-input w-20"
              >
                {measurementUnits.height.map(unit => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="md:col-span-2">
            <label htmlFor="heightMeasurementType" className="form-label">
              Height Measurement Type
            </label>
            <select
              id="heightMeasurementType"
              value={formData.heightMeasurementType}
              onChange={(e) => handleInputChange('heightMeasurementType', e.target.value as 'shoulder' | 'withers' | 'total')}
              className="form-input"
            >
              <option value="shoulder">Shoulder Height</option>
              <option value="withers">Withers Height</option>
              <option value="total">Total Height</option>
            </select>
          </div>
        </div>
      </div>

      {/* Medical Information */}
      <div>
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-sage-100 to-sage-200 rounded-lg">
            <Stethoscope className="h-5 w-5 text-sage-600" />
          </div>
          <h2 className="text-2xl font-semibold text-earth-900">Medical & Identification</h2>
        </div>
        <div className="space-y-6">
          <div>
            <label htmlFor="medicalNotes" className="form-label">
              Medical Notes
            </label>
            <textarea
              id="medicalNotes"
              rows={3}
              value={formData.medicalNotes}
              onChange={(e) => handleInputChange('medicalNotes', e.target.value)}
              className="form-input"
              placeholder="Any medical conditions, allergies, or important health information..."
            />
          </div>

          <div>
            <label htmlFor="specialNeeds" className="form-label">
              Special Needs
            </label>
            <textarea
              id="specialNeeds"
              rows={3}
              value={formData.specialNeeds}
              onChange={(e) => handleInputChange('specialNeeds', e.target.value)}
              className="form-input"
              placeholder="Special care requirements, dietary needs, etc..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="microchipId" className="form-label">
                Microchip ID
              </label>
              <input
                type="text"
                id="microchipId"
                value={formData.microchipId}
                onChange={(e) => handleInputChange('microchipId', e.target.value)}
                className="form-input"
                placeholder="15-digit microchip number"
              />
            </div>

            <div>
              <label htmlFor="registrationNumber" className="form-label">
                Registration Number
              </label>
              <input
                type="text"
                id="registrationNumber"
                value={formData.registrationNumber}
                onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
                className="form-input"
                placeholder="AKC, breed registry, etc."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={() => router.push(isEdit && animal ? `/animals/${animal.id}` : '/')}
          className="btn-secondary"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn-primary px-8"
          disabled={isSubmitting}
        >
          {isSubmitting 
            ? (isEdit ? 'Updating Pet...' : 'Adding Pet...') 
            : (isEdit ? 'Update Pet' : 'Add Pet')
          }
        </button>
      </div>

      {errors.submit && (
        <div className="text-red-500 text-sm text-center mt-4">
          {errors.submit}
        </div>
      )}
    </form>
  )
} 