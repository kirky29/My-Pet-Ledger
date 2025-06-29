import { differenceInYears, differenceInMonths, differenceInDays, format, parseISO, isValid } from 'date-fns'
import { AnimalSpecies } from '@/types/animal'

export function calculateAge(dateOfBirth: string | undefined, deathDate?: string): number {
  if (!dateOfBirth) return 0
  
  try {
    const birth = parseISO(dateOfBirth)
    if (!isValid(birth)) return 0
    
    const end = deathDate ? parseISO(deathDate) : new Date()
    if (deathDate && !isValid(end)) return 0
    
    return differenceInYears(end, birth)
  } catch {
    return 0
  }
}

export function calculateDetailedAge(dateOfBirth: string | undefined, deathDate?: string): {
  years: number;
  months: number;
  days: number;
} {
  if (!dateOfBirth) return { years: 0, months: 0, days: 0 }
  
  try {
    const birth = parseISO(dateOfBirth)
    if (!isValid(birth)) return { years: 0, months: 0, days: 0 }
    
    const end = deathDate ? parseISO(deathDate) : new Date()
    if (deathDate && !isValid(end)) return { years: 0, months: 0, days: 0 }
    
    const years = differenceInYears(end, birth)
    const months = differenceInMonths(end, birth) % 12
    const days = differenceInDays(end, birth) % 30 // Approximate
    
    return { years, months, days }
  } catch {
    return { years: 0, months: 0, days: 0 }
  }
}

export function formatDate(dateString: string | undefined): string {
  if (!dateString) return 'Unknown'
  
  try {
    const date = parseISO(dateString)
    if (!isValid(date)) return 'Invalid Date'
    return format(date, 'MMM dd, yyyy')
  } catch {
    return 'Invalid Date'
  }
}

export function formatDateTime(dateString: string | undefined): string {
  if (!dateString) return 'Unknown'
  
  try {
    const date = parseISO(dateString)
    if (!isValid(date)) return 'Invalid Date'
    return format(date, 'MMM dd, yyyy HH:mm')
  } catch {
    return 'Invalid Date'
  }
}

export function getSpeciesDisplayName(species: AnimalSpecies): string {
  const displayNames: Record<AnimalSpecies, string> = {
    'horse': 'Horse',
    'dog': 'Dog',
    'cat': 'Cat',
    'pig': 'Pig',
    'goat': 'Goat',
    'llama': 'Llama',
    'alpaca': 'Alpaca',
    'ferret': 'Ferret',
    'parrot': 'Parrot',
    'bird-of-prey': 'Bird of Prey',
    'rabbit': 'Rabbit',
    'sheep': 'Sheep',
    'cow': 'Cow',
    'chicken': 'Chicken',
    'duck': 'Duck',
    'other': 'Other'
  }
  return displayNames[species]
}

export function getSpeciesColor(species: AnimalSpecies): string {
  const colors: Record<AnimalSpecies, string> = {
    'horse': 'bg-amber-100 text-amber-800',
    'dog': 'bg-blue-100 text-blue-800',
    'cat': 'bg-purple-100 text-purple-800',
    'pig': 'bg-pink-100 text-pink-800',
    'goat': 'bg-green-100 text-green-800',
    'llama': 'bg-yellow-100 text-yellow-800',
    'alpaca': 'bg-indigo-100 text-indigo-800',
    'ferret': 'bg-gray-100 text-gray-800',
    'parrot': 'bg-red-100 text-red-800',
    'bird-of-prey': 'bg-orange-100 text-orange-800',
    'rabbit': 'bg-emerald-100 text-emerald-800',
    'sheep': 'bg-slate-100 text-slate-800',
    'cow': 'bg-stone-100 text-stone-800',
    'chicken': 'bg-lime-100 text-lime-800',
    'duck': 'bg-cyan-100 text-cyan-800',
    'other': 'bg-neutral-100 text-neutral-800'
  }
  return colors[species]
}

export function convertWeight(weight: number, fromUnit: 'lbs' | 'kg', toUnit: 'lbs' | 'kg'): number {
  if (fromUnit === toUnit) return weight
  
  if (fromUnit === 'lbs' && toUnit === 'kg') {
    return weight * 0.453592
  }
  
  if (fromUnit === 'kg' && toUnit === 'lbs') {
    return weight * 2.20462
  }
  
  return weight
}

export function convertHeight(height: number, fromUnit: 'inches' | 'cm' | 'hands', toUnit: 'inches' | 'cm' | 'hands'): number {
  if (fromUnit === toUnit) return height
  
  // Convert to inches first
  let inches = height
  if (fromUnit === 'cm') {
    inches = height / 2.54
  } else if (fromUnit === 'hands') {
    inches = height * 4
  }
  
  // Convert from inches to target unit
  if (toUnit === 'cm') {
    return inches * 2.54
  } else if (toUnit === 'hands') {
    return inches / 4
  }
  
  return inches
}

export function getDefaultHeightUnit(species: AnimalSpecies): 'inches' | 'cm' | 'hands' {
  if (species === 'horse') return 'hands'
  return 'inches'
}

export function getDefaultWeightUnit(species: AnimalSpecies): 'lbs' | 'kg' {
  return 'lbs' // Default to pounds, but can be customized per region
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePhoneNumber(phone: string): boolean {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
  return phoneRegex.test(phone.replace(/[^\d\+]/g, ''))
}

export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  }
  return phone
} 