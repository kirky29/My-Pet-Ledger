'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Calendar, MapPin, Heart, Grid, List, Clock, Award } from 'lucide-react'
import { Animal } from '@/types/animal'
import { calculateAge, formatDate, getSpeciesDisplayName, getSpeciesColor } from '@/lib/utils'
import { useSettings } from '@/lib/settings-context'

interface AnimalGridProps {
  animals: Animal[]
  viewMode?: 'grid' | 'list'
}

export default function AnimalGrid({ animals, viewMode }: AnimalGridProps) {
  const { settings } = useSettings()
  const currentViewMode = viewMode || settings.display.defaultView

  if (currentViewMode === 'list') {
    return (
      <div className="space-y-4">
        {animals.map((animal) => (
          <AnimalListItem key={animal.id} animal={animal} />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {animals.map((animal) => (
        <AnimalCard key={animal.id} animal={animal} />
      ))}
    </div>
  )
}

function AnimalCard({ animal }: { animal: Animal }) {
  const age = calculateAge(animal.dateOfBirth, animal.deathDate)
  const latestWeight = animal.weight[animal.weight.length - 1]
  const speciesColor = getSpeciesColor(animal.species)
  
  return (
    <Link href={`/animals/${animal.id}`} className="group block">
      <div className="animal-card group-hover:border-primary-200">
        {/* Pet Image */}
        <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
          {animal.profilePicture ? (
            <Image
              src={animal.profilePicture}
              alt={animal.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Heart className="h-16 w-16 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 text-sm font-medium">No Photo</p>
              </div>
            </div>
          )}
          
          {/* Status overlay */}
          {animal.deathDate && (
            <div className="absolute top-3 right-3 bg-gray-800/80 text-white px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
              Remembered
            </div>
          )}
          
          {/* Species badge */}
          <div className="absolute top-3 left-3">
            <div className={`px-3 py-1 rounded-full text-xs font-semibold text-white shadow-lg ${speciesColor}`}>
              {getSpeciesDisplayName(animal.species)}
            </div>
          </div>
        </div>

        {/* Pet Details */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-earth-900 group-hover:text-primary-700 transition-colors">
                {animal.name}
              </h3>
              {animal.breed && (
                <p className="text-earth-600 font-medium">{animal.breed}</p>
              )}
            </div>
            
            {age > 0 && (
              <div className="flex items-center space-x-1 text-earth-500">
                <Clock className="h-4 w-4" />
                <span className="text-sm font-medium">{age}y</span>
              </div>
            )}
          </div>

          {/* Pet Stats */}
          <div className="space-y-3">
            {animal.dateOfBirth && (
              <div className="flex items-center space-x-2 text-earth-600">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">Born {formatDate(animal.dateOfBirth)}</span>
              </div>
            )}
            
            {latestWeight && (
              <div className="flex items-center space-x-2 text-earth-600">
                <Award className="h-4 w-4" />
                <span className="text-sm">
                  {latestWeight.weight} {latestWeight.unit}
                </span>
              </div>
            )}
            
            {animal.color && (
              <div className="flex items-center space-x-2 text-earth-600">
                <div className="w-4 h-4 rounded-full border border-gray-300 bg-white flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                </div>
                <span className="text-sm capitalize">{animal.color}</span>
              </div>
            )}
          </div>

          {/* Action indicator */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-sage-100">
            <span className="text-sm text-earth-500">View Profile</span>
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center group-hover:bg-primary-200 transition-colors">
              <Heart className="h-4 w-4 text-primary-600" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

function AnimalListItem({ animal }: { animal: Animal }) {
  const age = calculateAge(animal.dateOfBirth, animal.deathDate)
  const latestWeight = animal.weight[animal.weight.length - 1]
  const speciesColor = getSpeciesColor(animal.species)
  
  return (
    <Link href={`/animals/${animal.id}`} className="group block">
      <div className="card hover:border-primary-200 transition-all duration-200">
        <div className="flex items-center space-x-6">
          {/* Pet Image */}
          <div className="relative w-20 h-20 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden flex-shrink-0">
            {animal.profilePicture ? (
              <Image
                src={animal.profilePicture}
                alt={animal.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Heart className="h-8 w-8 text-gray-400" />
              </div>
            )}
          </div>

          {/* Pet Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-bold text-earth-900 group-hover:text-primary-700 transition-colors truncate">
                    {animal.name}
                  </h3>
                  <div className={`px-2 py-1 rounded-md text-xs font-semibold text-white ${speciesColor}`}>
                    {getSpeciesDisplayName(animal.species)}
                  </div>
                  {animal.deathDate && (
                    <div className="bg-gray-200 text-gray-700 px-2 py-1 rounded-md text-xs font-medium">
                      Remembered
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-earth-600">
                  {animal.breed && (
                    <span className="font-medium">{animal.breed}</span>
                  )}
                  {age > 0 && (
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{age} years old</span>
                    </div>
                  )}
                  {latestWeight && (
                    <div className="flex items-center space-x-1">
                      <Award className="h-3 w-3" />
                      <span>{latestWeight.weight} {latestWeight.unit}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <span className="text-sm text-earth-500">View Profile</span>
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                  <Heart className="h-4 w-4 text-primary-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
} 