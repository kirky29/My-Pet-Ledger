'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Plus, 
  Heart, 
  Calendar, 
  Leaf, 
  TreePine, 
  Bird, 
  Search, 
  TrendingUp,
  Users,
  Activity,
  Award,
  Clock,
  MapPin,
  Stethoscope,
  PawPrint,
  ArrowRight,
  Zap,
  DollarSign
} from 'lucide-react'
import AnimalGrid from '@/components/AnimalGrid'
import { Animal } from '@/types/animal'
import { getSpeciesDisplayName, calculateAge } from '@/lib/utils'
import { useSettings, useCurrency } from '@/lib/settings-context'
import { useAuth } from '@/lib/auth-context'

export default function HomePage() {
  const { settings } = useSettings()
  const { currency, formatCurrency } = useCurrency()
  const { user } = useAuth()
  const [allAnimals, setAllAnimals] = useState<Animal[]>([])
  const [animals, setAnimals] = useState<Animal[]>([])
  const [filteredAnimals, setFilteredAnimals] = useState<Animal[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [speciesFilter, setSpeciesFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState(() => 
    settings.display.showDeceased ? '' : 'alive'
  )
  const [loading, setLoading] = useState(true)

  // Fetch animals on component mount
  useEffect(() => {
    async function fetchAnimals() {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        const idToken = await user.getIdToken()
        const response = await fetch('/api/animals', {
          headers: {
            'Authorization': `Bearer ${idToken}`
          }
        })
        
        if (response.ok) {
          const data = await response.json()
          setAllAnimals(data)
          
          const filteredData = settings.display.showDeceased 
            ? data 
            : data.filter((animal: Animal) => !animal.deathDate)
          setAnimals(filteredData)
          setFilteredAnimals(filteredData)
        } else {
          console.error('Failed to fetch animals:', response.status)
        }
      } catch (error) {
        console.error('Error fetching animals:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchAnimals()
  }, [settings.display.showDeceased, user])

  // Get unique species from current animals
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

  // Calculate comprehensive stats
  const aliveAnimals = allAnimals.filter(animal => !animal.deathDate)
  const averageAge = aliveAnimals.length > 0 
    ? Math.round(aliveAnimals.reduce((sum, animal) => sum + calculateAge(animal.dateOfBirth), 0) / aliveAnimals.length)
    : 0

  // Calculate total medical expenses from all events
  const totalMedicalExpenses = allAnimals.reduce((total, animal) => {
    if (animal.events) {
      return total + animal.events.reduce((animalTotal, event) => {
        return animalTotal + (event.cost || 0)
      }, 0)
    }
    return total
  }, 0)

  const recentlyAdded = allAnimals
    .sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime())
    .slice(0, 3)

  const upcomingBirthdays = aliveAnimals
    .filter(animal => animal.dateOfBirth)
    .map(animal => ({
      ...animal,
      nextBirthday: getNextBirthday(animal.dateOfBirth!)
    }))
    .sort((a, b) => a.nextBirthday.getTime() - b.nextBirthday.getTime())
    .slice(0, 3)

  const speciesCount = filteredAnimals.reduce((acc, animal) => {
    acc[animal.species] = (acc[animal.species] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const topSpecies = Object.entries(speciesCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-32 bg-gradient-to-r from-gray-200 to-gray-300 rounded-3xl"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => (
            <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-forest-50 via-primary-50 to-sage-50 rounded-3xl p-8 border border-white/50 shadow-nature">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary-200/30 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-sage-200/20 to-transparent rounded-full translate-y-20 -translate-x-20"></div>
        
        <div className="relative">
          <div className="flex items-center justify-between flex-wrap gap-6">
            <div className="flex items-center space-x-4">
              <div className="flex space-x-2">
                <div className="p-3 bg-gradient-to-br from-primary-500 to-forest-600 rounded-2xl shadow-lg">
                  <TreePine className="h-6 w-6 text-white" />
                </div>
                <div className="p-3 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-2xl shadow-lg">
                  <Leaf className="h-6 w-6 text-white" />
                </div>
                <div className="p-3 bg-gradient-to-br from-sage-500 to-sage-600 rounded-2xl shadow-lg">
                  <Bird className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-earth-900 to-forest-800 bg-clip-text text-transparent">
                  Welcome back!
                </h1>
                <p className="text-earth-600 text-lg mt-1">
                  {allAnimals.length === 0 
                    ? "Ready to start your pet management journey?" 
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
              <Link href="/animals" className="btn-secondary flex items-center space-x-2">
                <PawPrint className="h-5 w-5" />
                <span>View All</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stats-card bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-600 font-semibold text-sm uppercase tracking-wide">Total Pets</p>
              <p className="text-3xl font-bold text-primary-800 mt-1">{allAnimals.length}</p>
            </div>
            <div className="p-3 bg-primary-500 rounded-xl">
              <Heart className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="stats-card bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 font-semibold text-sm uppercase tracking-wide">Healthy & Active</p>
              <p className="text-3xl font-bold text-green-800 mt-1">{aliveAnimals.length}</p>
            </div>
            <div className="p-3 bg-green-500 rounded-xl">
              <Activity className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="stats-card bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-600 font-semibold text-sm uppercase tracking-wide">Average Age</p>
              <p className="text-3xl font-bold text-amber-800 mt-1">{averageAge} yrs</p>
            </div>
            <div className="p-3 bg-amber-500 rounded-xl">
              <Clock className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        {totalMedicalExpenses > 0 ? (
          <div className="stats-card bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-600 font-semibold text-sm uppercase tracking-wide">Health Expenses</p>
                <p className="text-3xl font-bold text-red-800 mt-1">{formatCurrency(totalMedicalExpenses)}</p>
              </div>
              <div className="p-3 bg-red-500 rounded-xl">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ) : (
          <div className="stats-card bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 font-semibold text-sm uppercase tracking-wide">Species</p>
                <p className="text-3xl font-bold text-purple-800 mt-1">{availableSpecies.length}</p>
              </div>
              <div className="p-3 bg-purple-500 rounded-xl">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions & Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-earth-900">Recent Additions</h2>
              </div>
              <Link href="/animals" className="text-primary-600 hover:text-primary-700 font-medium flex items-center space-x-1">
                <span>View All</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {recentlyAdded.length === 0 ? (
              <div className="text-center py-8">
                <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No pets added yet</p>
                <Link href="/add-animal" className="text-primary-600 hover:text-primary-700 font-medium">
                  Add your first pet →
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentlyAdded.map((animal) => (
                  <Link
                    key={animal.id}
                    href={`/animals/${animal.id}`}
                    className="flex items-center space-x-4 p-4 rounded-xl hover:bg-sage-50 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <Heart className="h-6 w-6 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-earth-900">{animal.name}</h3>
                      <p className="text-sm text-earth-600">
                        {getSpeciesDisplayName(animal.species)} • {calculateAge(animal.dateOfBirth)} years old
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-earth-500">Recently added</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          {/* Upcoming Birthdays */}
          <div className="card">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-gradient-to-br from-pink-100 to-pink-200 rounded-lg">
                <Calendar className="h-5 w-5 text-pink-600" />
              </div>
              <h3 className="text-lg font-semibold text-earth-900">Upcoming Birthdays</h3>
            </div>

            {upcomingBirthdays.length === 0 ? (
              <p className="text-earth-500 text-sm text-center py-4">No upcoming birthdays</p>
            ) : (
              <div className="space-y-3">
                {upcomingBirthdays.map((animal) => (
                  <div key={animal.id} className="flex items-center space-x-3 p-3 bg-sage-25 rounded-lg">
                    <div className="w-8 h-8 rounded-lg bg-pink-100 flex items-center justify-center">
                      <Heart className="h-4 w-4 text-pink-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-earth-900 text-sm">{animal.name}</p>
                      <p className="text-xs text-earth-600">
                        {formatBirthdayDate(animal.nextBirthday)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="card">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg">
                <Zap className="h-5 w-5 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-earth-900">Quick Actions</h3>
            </div>

            <div className="space-y-2">
              <Link href="/add-animal" className="flex items-center space-x-3 p-3 hover:bg-sage-50 rounded-lg transition-colors">
                <Plus className="h-5 w-5 text-primary-600" />
                <span className="text-earth-700 font-medium">Add New Pet</span>
              </Link>
              
              <Link href="/settings" className="flex items-center space-x-3 p-3 hover:bg-sage-50 rounded-lg transition-colors">
                <MapPin className="h-5 w-5 text-sage-600" />
                <span className="text-earth-700 font-medium">App Settings</span>
              </Link>

              <div className="flex items-center space-x-3 p-3 text-earth-400 cursor-not-allowed">
                <Stethoscope className="h-5 w-5" />
                <span className="font-medium">Health Checkup</span>
                <span className="text-xs ml-auto">Soon</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Pet Grid Section */}
      {allAnimals.length > 0 && (
        <div className="card">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-xl shadow-lg">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-earth-900">Your Pet Family</h2>
                <p className="text-earth-600">
                  {filteredAnimals.length === animals.length ? (
                    `${animals.length} beloved ${animals.length === 1 ? 'companion' : 'companions'}`
                  ) : (
                    `${filteredAnimals.length} of ${animals.length} pets`
                  )}
                </p>
              </div>
            </div>
            <Link 
              href="/animals" 
              className="group text-primary-600 hover:text-primary-700 font-semibold flex items-center space-x-2 px-6 py-3 rounded-xl hover:bg-primary-50 transition-all duration-200 border border-primary-200/50"
            >
              <span>View All Pets</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-earth-400" />
              <input
                type="text"
                placeholder="Search pets..."
                className="form-input pl-12"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <AnimalGrid animals={filteredAnimals.slice(0, 6)} />
        </div>
      )}

      {/* Empty State */}
      {allAnimals.length === 0 && (
        <div className="card text-center py-16">
          <div className="flex justify-center space-x-4 mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-primary-200 to-primary-300 rounded-3xl flex items-center justify-center shadow-lg">
              <Heart className="h-12 w-12 text-primary-600" />
            </div>
            <div className="w-24 h-24 bg-gradient-to-br from-secondary-200 to-secondary-300 rounded-3xl flex items-center justify-center shadow-lg">
              <Leaf className="h-12 w-12 text-secondary-600" />
            </div>
            <div className="w-24 h-24 bg-gradient-to-br from-sage-200 to-sage-300 rounded-3xl flex items-center justify-center shadow-lg">
              <Bird className="h-12 w-12 text-sage-700" />
            </div>
          </div>
          <h3 className="text-3xl font-bold bg-gradient-to-r from-earth-900 to-forest-800 bg-clip-text text-transparent mb-4">
            Welcome to My Pet Ledger
          </h3>
          <p className="text-earth-600 text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            Every animal deserves a loving home and comprehensive care. Begin your journey by adding your first beloved companion.
          </p>
          <Link href="/add-animal" className="inline-flex items-center space-x-3 bg-gradient-to-r from-primary-600 via-primary-500 to-forest-600 text-white px-10 py-5 rounded-2xl hover:from-primary-700 hover:via-primary-600 hover:to-forest-700 transform hover:scale-105 transition-all duration-300 font-semibold shadow-nature text-lg">
            <Plus className="h-6 w-6" />
            <span>Add Your First Pet</span>
          </Link>
        </div>
      )}
    </div>
  )
}

// Helper functions
function getNextBirthday(dateOfBirth: string): Date {
  const birth = new Date(dateOfBirth)
  const now = new Date()
  const thisYear = now.getFullYear()
  
  let birthday = new Date(thisYear, birth.getMonth(), birth.getDate())
  
  if (birthday < now) {
    birthday = new Date(thisYear + 1, birth.getMonth(), birth.getDate())
  }
  
  return birthday
}

function formatBirthdayDate(date: Date): string {
  const now = new Date()
  const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Today!'
  if (diffDays === 1) return 'Tomorrow'
  if (diffDays <= 7) return `In ${diffDays} days`
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
} 