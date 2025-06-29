'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Heart, Grid, List, Filter, Plus, Users, TrendingUp, Eye, EyeOff } from 'lucide-react'
import AnimalGrid from '@/components/AnimalGrid'
import { Animal } from '@/types/animal'
import { getAnimals } from '@/lib/firestore-data'
import { getSpeciesDisplayName } from '@/lib/utils'
import { useSettings } from '@/lib/settings-context'
import { useAuth } from '@/lib/auth-context'

export default function AnimalsPage() {
  const { settings } = useSettings()
  const { user } = useAuth()
  const [allAnimals, setAllAnimals] = useState<Animal[]>([])
  const [animals, setAnimals] = useState<Animal[]>([])
  const [filteredAnimals, setFilteredAnimals] = useState<Animal[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [speciesFilter, setSpeciesFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState(() => 
    settings.display.showDeceased ? '' : 'alive'
  )
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [loading, setLoading] = useState(true)

  // Fetch animals on component mount
  useEffect(() => {
    async function fetchAnimals() {
      if (!user) {
        console.log('🔍 Animals Page: No user, skipping fetch')
        setLoading(false)
        return
      }

      try {
        console.log('🔍 Animals Page: Starting to fetch animals for user:', user.uid)
        const data = await getAnimals()
        console.log('✅ Animals Page: Fetched animals:', data.length, 'animals', data)
        setAllAnimals(data)
        
        const filteredData = settings.display.showDeceased 
          ? data 
          : data.filter((animal: Animal) => !animal.deathDate)
        setAnimals(filteredData)
        setFilteredAnimals(filteredData)
      } catch (error) {
        console.error('❌ Animals Page: Error fetching animals:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchAnimals()
  }, [settings.display.showDeceased, user])

  // Get unique species from all animals
  const availableSpecies = Array.from(new Set(allAnimals.map(animal => animal.species))).sort()

  // Update base animals when status filter changes
  useEffect(() => {
    let baseAnimals = [...allAnimals]
    
    if (statusFilter === 'alive') {
      baseAnimals = baseAnimals.filter(animal => !animal.deathDate)
    } else if (statusFilter === 'deceased') {
      baseAnimals = baseAnimals.filter(animal => !!animal.deathDate)
    }
    
    setAnimals(baseAnimals)
  }, [allAnimals, statusFilter])

  // Filter animals based on search term and species filter
  useEffect(() => {
    let filtered = [...animals]

    if (searchTerm) {
      filtered = filtered.filter(animal =>
        animal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        animal.breed?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        animal.species.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (speciesFilter) {
      filtered = filtered.filter(animal => animal.species === speciesFilter)
    }

    setFilteredAnimals(filtered)
  }, [animals, searchTerm, speciesFilter])

  const clearFilters = () => {
    setSearchTerm('')
    setSpeciesFilter('')
    setStatusFilter(settings.display.showDeceased ? '' : 'alive')
  }

  const hasActiveFilters = searchTerm || speciesFilter || (statusFilter !== (settings.display.showDeceased ? '' : 'alive'))

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-32 bg-gradient-to-r from-gray-200 to-gray-300 rounded-3xl"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="h-64 bg-gray-200 rounded-xl"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-forest-50 via-primary-50 to-sage-50 rounded-3xl p-8 border border-white/50 shadow-nature">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary-200/30 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-sage-200/20 to-transparent rounded-full translate-y-20 -translate-x-20"></div>
        
        <div className="relative">
          <div className="flex items-center justify-between flex-wrap gap-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-primary-500 to-forest-600 rounded-2xl shadow-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-earth-900 to-forest-800 bg-clip-text text-transparent">
                  Your Pet Family
                </h1>
                <p className="text-earth-600 text-lg mt-1">
                  {allAnimals.length === 0 
                    ? "No pets registered yet" 
                    : `Managing ${allAnimals.length} beloved ${allAnimals.length === 1 ? 'companion' : 'companions'}`
                  }
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Link href="/add-animal" className="btn-primary flex items-center space-x-2">
                <Plus className="h-5 w-5" />
                <span>Add Pet</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg">
              <Search className="h-5 w-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-earth-900">Find Your Pets</h2>
          </div>
          
          {/* View Mode Toggle */}
          <div className="flex items-center space-x-2 bg-sage-50 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-all duration-200 ${
                viewMode === 'grid'
                  ? 'bg-white shadow-sm text-primary-600'
                  : 'text-earth-500 hover:text-earth-700'
              }`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-all duration-200 ${
                viewMode === 'list'
                  ? 'bg-white shadow-sm text-primary-600'
                  : 'text-earth-500 hover:text-earth-700'
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-earth-400" />
            <input
              type="text"
              placeholder="Search by name, breed, or species..."
              className="form-input pl-12 text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Filter Row */}
          <div className="flex flex-col sm:flex-row gap-4">
            <select 
              className="form-input sm:w-48 text-base"
              value={speciesFilter}
              onChange={(e) => setSpeciesFilter(e.target.value)}
            >
              <option value="">All Species</option>
              {availableSpecies.map(species => (
                <option key={species} value={species}>
                  {getSpeciesDisplayName(species)}
                </option>
              ))}
            </select>
            
            <select 
              className="form-input sm:w-48 text-base"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="alive">Alive</option>
              <option value="deceased">Deceased</option>
            </select>
            
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="btn-secondary flex items-center space-x-2 whitespace-nowrap"
              >
                <Filter className="h-4 w-4" />
                <span>Clear Filters</span>
              </button>
            )}
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-sage-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-green-100 to-green-200 rounded-lg">
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
            <p className="text-earth-700 font-medium">
              {filteredAnimals.length === animals.length ? (
                <>Showing all {animals.length} {animals.length === 1 ? 'pet' : 'pets'}</>
              ) : (
                <>Found {filteredAnimals.length} of {animals.length} {animals.length === 1 ? 'pet' : 'pets'}</>
              )}
            </p>
          </div>
          
          {hasActiveFilters && (
            <div className="flex items-center space-x-2 text-sm text-earth-500">
              <Filter className="h-4 w-4" />
              <span>Filters active</span>
            </div>
          )}
        </div>
      </div>

      {/* Animals Grid/List */}
      {allAnimals.length === 0 ? (
        <div className="card text-center py-16">
          <div className="flex justify-center space-x-4 mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-primary-200 to-primary-300 rounded-3xl flex items-center justify-center shadow-lg">
              <Heart className="h-12 w-12 text-primary-600" />
            </div>
          </div>
          <h3 className="text-3xl font-bold bg-gradient-to-r from-earth-900 to-forest-800 bg-clip-text text-transparent mb-4">
            No Pets Yet
          </h3>
          <p className="text-earth-600 text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            Start building your pet family by adding your first beloved companion.
          </p>
          <Link href="/add-animal" className="inline-flex items-center space-x-3 bg-gradient-to-r from-primary-600 via-primary-500 to-forest-600 text-white px-10 py-5 rounded-2xl hover:from-primary-700 hover:via-primary-600 hover:to-forest-700 transform hover:scale-105 transition-all duration-300 font-semibold shadow-nature text-lg">
            <Plus className="h-6 w-6" />
            <span>Add Your First Pet</span>
          </Link>
        </div>
      ) : filteredAnimals.length === 0 ? (
        <div className="card text-center py-16">
          <div className="flex justify-center space-x-2 mb-6">
            <div className="p-4 bg-secondary-100 rounded-2xl">
              <Search className="h-8 w-8 text-secondary-600" />
            </div>
          </div>
          <h3 className="text-2xl font-semibold text-earth-900 mb-3">No pets found</h3>
          <p className="text-earth-600 mb-8 max-w-md mx-auto">
            Try adjusting your search terms or filters to find your pets.
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="btn-secondary flex items-center space-x-2 mx-auto"
            >
              <Filter className="h-4 w-4" />
              <span>Clear Filters</span>
            </button>
          )}
        </div>
      ) : (
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-forest-100 to-forest-200 rounded-lg">
                <Heart className="h-5 w-5 text-forest-600" />
              </div>
              <h2 className="text-xl font-semibold text-earth-900">
                {viewMode === 'grid' ? 'Pet Gallery' : 'Pet Directory'}
              </h2>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-earth-600">
              <Eye className="h-4 w-4" />
              <span>{filteredAnimals.length} {filteredAnimals.length === 1 ? 'pet' : 'pets'}</span>
            </div>
          </div>
          
          <AnimalGrid animals={filteredAnimals} viewMode={viewMode} />
        </div>
      )}
    </div>
  )
} 