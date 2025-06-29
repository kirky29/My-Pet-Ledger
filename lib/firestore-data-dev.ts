import { Animal, AnimalFormData } from '@/types/animal'
import { v4 as uuidv4 } from 'uuid'
import fs from 'fs/promises'
import path from 'path'

// Simple file-based storage for development
const DEV_DATA_FILE = path.join(process.cwd(), 'dev-animals.json')

// Helper function to read dev data
async function readDevData(): Promise<{ [userId: string]: Animal[] }> {
  try {
    const data = await fs.readFile(DEV_DATA_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.log('No dev data file found, starting with empty data')
    return {}
  }
}

// Helper function to write dev data
async function writeDevData(data: { [userId: string]: Animal[] }): Promise<void> {
  try {
    await fs.writeFile(DEV_DATA_FILE, JSON.stringify(data, null, 2))
    console.log('Dev data written successfully')
  } catch (error) {
    console.error('Error writing dev data:', error)
  }
}

// Add new animal (development version)
export async function addAnimalDev(formData: AnimalFormData, profilePictureUrl: string | undefined, userId: string): Promise<Animal> {
  console.log('=== addAnimalDev - Starting ===')
  console.log('UserId:', userId)
  console.log('FormData name:', formData.name)
  
  const now = new Date().toISOString()
  const animalId = uuidv4()
  
  const animal: Animal = {
    id: animalId,
    name: formData.name,
    species: formData.species,
    breed: formData.breed || undefined,
    dateOfBirth: formData.dateOfBirth,
    deathDate: formData.deathDate || undefined,
    sex: formData.sex,
    color: formData.color || undefined,
    markings: formData.markings || undefined,
    profilePicture: profilePictureUrl || undefined,
    weight: formData.initialWeight ? [{
      date: now,
      weight: parseFloat(formData.initialWeight),
      unit: formData.weightUnit,
      notes: 'Initial weight record'
    }] : [],
    height: formData.initialHeight ? [{
      date: now,
      height: parseFloat(formData.initialHeight),
      unit: formData.heightUnit,
      measurementType: formData.heightMeasurementType,
      notes: 'Initial height record'
    }] : [],
    events: [],
    medicalNotes: formData.medicalNotes || undefined,
    specialNeeds: formData.specialNeeds || undefined,
    microchipId: formData.microchipId || undefined,
    registrationNumber: formData.registrationNumber || undefined,
    ownerInfo: {
      name: formData.ownerName,
      email: formData.ownerEmail || undefined,
      phone: formData.ownerPhone || undefined,
      address: formData.ownerAddress || undefined,
    },
    createdAt: now,
    updatedAt: now,
  }

  try {
    console.log('Reading existing dev data...')
    const allData = await readDevData()
    
    if (!allData[userId]) {
      allData[userId] = []
    }
    
    allData[userId].push(animal)
    
    console.log('Writing updated dev data...')
    await writeDevData(allData)
    
    console.log('Successfully added animal:', animalId)
    return animal
  } catch (error) {
    console.error('Error adding animal in dev mode:', error)
    if (error instanceof Error) {
      console.error('Error details:', error.message)
      console.error('Error stack:', error.stack)
    }
    throw error
  }
}

// Get all animals for a user (development version)
export async function getAnimalsDev(userId: string): Promise<Animal[]> {
  console.log('=== getAnimalsDev - Starting ===')
  console.log('UserId:', userId)
  
  try {
    const allData = await readDevData()
    const userAnimals = allData[userId] || []
    console.log('Found animals for user:', userAnimals.length)
    return userAnimals
  } catch (error) {
    console.error('Error getting animals in dev mode:', error)
    return []
  }
}

// Get animal by ID (development version)
export async function getAnimalByIdDev(id: string, userId: string): Promise<Animal | null> {
  console.log('=== getAnimalByIdDev - Starting ===')
  console.log('AnimalId:', id, 'UserId:', userId)
  
  try {
    const allData = await readDevData()
    const userAnimals = allData[userId] || []
    const animal = userAnimals.find(a => a.id === id)
    console.log('Found animal:', !!animal)
    return animal || null
  } catch (error) {
    console.error('Error getting animal by ID in dev mode:', error)
    return null
  }
} 