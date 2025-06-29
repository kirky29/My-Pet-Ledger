'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Edit, Calendar, Heart, MapPin, Scale, Ruler, Stethoscope, Hash, Award, User } from 'lucide-react'
import { Animal } from '@/types/animal'
import { calculateAge, calculateDetailedAge, formatDate, getSpeciesDisplayName, getSpeciesColor } from '@/lib/utils'
import EventTimeline from '@/components/EventTimeline'
import { useAuth } from '@/lib/auth-context'

interface AnimalProfilePageProps {
  params: {
    id: string
  }
}

export default function AnimalProfilePage({ params }: AnimalProfilePageProps) {
  const { user } = useAuth()
  const [animal, setAnimal] = useState<Animal | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAnimal() {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        const idToken = await user.getIdToken()
        const response = await fetch(`/api/animals/${params.id}`, {
          headers: {
            'Authorization': `Bearer ${idToken}`
          }
        })
        
        if (response.ok) {
          const data = await response.json()
          setAnimal(data)
        } else if (response.status === 404) {
          setAnimal(null)
        }
      } catch (error) {
        console.error('Error fetching animal:', error)
        setAnimal(null)
      } finally {
        setLoading(false)
      }
    }
    fetchAnimal()
  }, [params.id, user])

  const refreshAnimal = async () => {
    if (!user) return

    try {
      const idToken = await user.getIdToken()
      const response = await fetch(`/api/animals/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setAnimal(data)
      }
    } catch (error) {
      console.error('Error refreshing animal:', error)
    }
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="sanctuary-header">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-32 mb-6"></div>
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="w-48 h-48 bg-gray-200 rounded-2xl"></div>
              <div className="flex-1">
                <div className="h-12 bg-gray-200 rounded w-64 mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-20 bg-gray-200 rounded-xl"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!animal) {
    notFound()
  }

  const age = calculateAge(animal.dateOfBirth, animal.deathDate)
  const detailedAge = calculateDetailedAge(animal.dateOfBirth, animal.deathDate)
  const isDeceased = !!animal.deathDate
  const latestWeight = animal.weight[animal.weight.length - 1]
  const latestHeight = animal.height[animal.height.length - 1]

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="sanctuary-header">
        <Link 
          href="/animals" 
          className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6 px-4 py-2 rounded-lg hover:bg-primary-50 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to All Animals
        </Link>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Profile Image */}
          <div className="flex-shrink-0">
            <div className="w-48 h-48 rounded-2xl overflow-hidden shadow-nature">
              {animal.profilePicture ? (
                <Image
                  src={animal.profilePicture}
                  alt={`${animal.name} profile`}
                  width={192}
                  height={192}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-sage-100 to-sage-200 flex items-center justify-center">
                  <Heart className="h-16 w-16 text-sage-400" />
                </div>
              )}
            </div>
          </div>

          {/* Basic Info */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold text-earth-900 mb-2">{animal.name}</h1>
                <div className="flex items-center space-x-3 mb-4">
                  <span className={`species-badge ${getSpeciesColor(animal.species)}`}>
                    {getSpeciesDisplayName(animal.species)}
                  </span>
                  <span className={`species-badge ${isDeceased ? 'status-deceased' : 'status-alive'}`}>
                    {isDeceased ? 'Remembered' : 'Thriving'}
                  </span>
                </div>
              </div>
              <Link
                href={`/animals/${animal.id}/edit`}
                className="btn-primary flex items-center space-x-2"
              >
                <Edit className="h-4 w-4" />
                <span>Edit Profile</span>
              </Link>
            </div>

            {animal.breed && (
              <p className="text-xl text-earth-700 mb-4 font-medium">{animal.breed}</p>
            )}

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-primary-50/50 p-4 rounded-xl">
                <div className="flex items-center space-x-2 mb-2">
                  <Calendar className="h-5 w-5 text-primary-600" />
                  <span className="text-sm font-semibold text-primary-700">Age</span>
                </div>
                <p className="text-lg font-bold text-earth-900">
                  {detailedAge.years}y {detailedAge.months}m
                </p>
              </div>

              <div className="bg-secondary-50/50 p-4 rounded-xl">
                <div className="flex items-center space-x-2 mb-2">
                  <Heart className="h-5 w-5 text-secondary-600" />
                  <span className="text-sm font-semibold text-secondary-700">Sex</span>
                </div>
                <p className="text-lg font-bold text-earth-900 capitalize">{animal.sex}</p>
              </div>

              {animal.color && (
                <div className="bg-sage-50/50 p-4 rounded-xl">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="h-5 w-5 rounded-full bg-sage-600"></div>
                    <span className="text-sm font-semibold text-sage-700">Color</span>
                  </div>
                  <p className="text-lg font-bold text-earth-900">{animal.color}</p>
                </div>
              )}

              <div className="bg-forest-50/50 p-4 rounded-xl">
                <div className="flex items-center space-x-2 mb-2">
                  <MapPin className="h-5 w-5 text-forest-600" />
                  <span className="text-sm font-semibold text-forest-700">Born</span>
                </div>
                <p className="text-sm font-bold text-earth-900">{formatDate(animal.dateOfBirth)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Latest Measurements */}
          {(animal.weight.length > 0 || animal.height.length > 0) && (
            <div className="card">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg">
                  <Scale className="h-5 w-5 text-primary-600" />
                </div>
                <h2 className="text-2xl font-semibold text-earth-900">Current Measurements</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {latestWeight && (
                  <div className="bg-gradient-to-br from-earth-50 to-earth-100 p-6 rounded-xl">
                    <div className="flex items-center space-x-3 mb-4">
                      <Scale className="h-6 w-6 text-earth-600" />
                      <h3 className="text-lg font-semibold text-earth-800">Weight</h3>
                    </div>
                    <p className="text-3xl font-bold text-earth-900 mb-2">
                      {latestWeight.weight} {latestWeight.unit}
                    </p>
                    <p className="text-sm text-earth-600">
                      Last recorded: {formatDate(latestWeight.date)}
                    </p>
                    {latestWeight.notes && (
                      <p className="text-sm text-earth-700 mt-2 italic">"{latestWeight.notes}"</p>
                    )}
                  </div>
                )}

                {latestHeight && (
                  <div className="bg-gradient-to-br from-forest-50 to-forest-100 p-6 rounded-xl">
                    <div className="flex items-center space-x-3 mb-4">
                      <Ruler className="h-6 w-6 text-forest-600" />
                      <h3 className="text-lg font-semibold text-forest-800">Height</h3>
                    </div>
                    <p className="text-3xl font-bold text-forest-900 mb-2">
                      {latestHeight.height} {latestHeight.unit}
                    </p>
                    <p className="text-sm text-forest-600">
                      {latestHeight.measurementType} • {formatDate(latestHeight.date)}
                    </p>
                    {latestHeight.notes && (
                      <p className="text-sm text-forest-700 mt-2 italic">"{latestHeight.notes}"</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Medical Information */}
          {(animal.medicalNotes || animal.specialNeeds || animal.microchipId || animal.registrationNumber) && (
            <div className="card">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-sage-100 to-sage-200 rounded-lg">
                  <Stethoscope className="h-5 w-5 text-sage-600" />
                </div>
                <h2 className="text-2xl font-semibold text-earth-900">Medical & Care Information</h2>
              </div>

              <div className="space-y-6">
                {animal.medicalNotes && (
                  <div>
                    <h3 className="text-lg font-semibold text-earth-800 mb-3">Medical Notes</h3>
                    <div className="bg-sage-50 p-4 rounded-lg border border-sage-200">
                      <p className="text-earth-700">{animal.medicalNotes}</p>
                    </div>
                  </div>
                )}

                {animal.specialNeeds && (
                  <div>
                    <h3 className="text-lg font-semibold text-earth-800 mb-3">Special Care Needs</h3>
                    <div className="bg-secondary-50 p-4 rounded-lg border border-secondary-200">
                      <p className="text-earth-700">{animal.specialNeeds}</p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {animal.microchipId && (
                    <div className="bg-primary-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Hash className="h-4 w-4 text-primary-600" />
                        <span className="text-sm font-semibold text-primary-700">Microchip ID</span>
                      </div>
                      <p className="font-mono text-earth-900">{animal.microchipId}</p>
                    </div>
                  )}

                  {animal.registrationNumber && (
                    <div className="bg-forest-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Award className="h-4 w-4 text-forest-600" />
                        <span className="text-sm font-semibold text-forest-700">Registration</span>
                      </div>
                      <p className="font-mono text-earth-900">{animal.registrationNumber}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Additional Details */}
          {animal.markings && (
            <div className="card">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-secondary-100 to-secondary-200 rounded-lg">
                  <Heart className="h-5 w-5 text-secondary-600" />
                </div>
                <h2 className="text-2xl font-semibold text-earth-900">Distinctive Features</h2>
              </div>
              <div className="bg-gradient-to-br from-secondary-50 to-secondary-100 p-4 rounded-lg">
                <p className="text-earth-700">{animal.markings}</p>
              </div>
            </div>
          )}

          {/* Event Timeline */}
          <div className="card">
            <EventTimeline
              events={animal.events || []}
              animalId={animal.id}
              onEventAdded={refreshAnimal}
              onEventUpdated={refreshAnimal}
              onEventDeleted={refreshAnimal}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Owner Information */}
          {animal.ownerInfo && (
            <div className="card">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-earth-100 to-earth-200 rounded-lg">
                  <User className="h-5 w-5 text-earth-600" />
                </div>
                <h3 className="text-lg font-semibold text-earth-900">Guardian</h3>
              </div>
              
              <div className="space-y-3">
                <div>
                  <p className="text-lg font-semibold text-earth-900">{animal.ownerInfo.name}</p>
                </div>
                
                {animal.ownerInfo.email && (
                  <div>
                    <p className="text-sm text-earth-600">Email</p>
                    <p className="text-earth-800">{animal.ownerInfo.email}</p>
                  </div>
                )}
                
                {animal.ownerInfo.phone && (
                  <div>
                    <p className="text-sm text-earth-600">Phone</p>
                    <p className="text-earth-800">{animal.ownerInfo.phone}</p>
                  </div>
                )}
                
                {animal.ownerInfo.address && (
                  <div>
                    <p className="text-sm text-earth-600">Address</p>
                    <p className="text-earth-800">{animal.ownerInfo.address}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Death Information */}
          {animal.deathDate && (
            <div className="card border-earth-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-earth-100 to-earth-200 rounded-lg">
                  <Heart className="h-5 w-5 text-earth-600" />
                </div>
                <h3 className="text-lg font-semibold text-earth-900">In Loving Memory</h3>
              </div>
              <div className="text-center">
                <p className="text-earth-700 mb-2">Passed away on</p>
                <p className="text-lg font-semibold text-earth-900">{formatDate(animal.deathDate)}</p>
                <p className="text-sm text-earth-600 mt-2">
                  Lived for {age} {age === 1 ? 'year' : 'years'}
                </p>
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="card">
            <h3 className="text-lg font-semibold text-earth-900 mb-4">Profile Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-earth-600">Added to sanctuary</span>
                <span className="text-earth-900 font-medium">{formatDate(animal.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-earth-600">Last updated</span>
                <span className="text-earth-900 font-medium">{formatDate(animal.updatedAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-earth-600">Weight records</span>
                <span className="text-earth-900 font-medium">{animal.weight.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-earth-600">Height records</span>
                <span className="text-earth-900 font-medium">{animal.height.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 