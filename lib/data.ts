import { Animal, AnimalFormData, EventEntry, EventType } from '@/types/animal'
import { AppSettings, defaultSettings } from '@/types/settings'
import { promises as fs } from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

const DATA_DIR = path.join(process.cwd(), 'data')
const ANIMALS_FILE = path.join(DATA_DIR, 'animals.json')
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json')

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR)
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true })
  }
}

// Get all animals
export async function getAnimals(): Promise<Animal[]> {
  try {
    await ensureDataDir()
    const data = await fs.readFile(ANIMALS_FILE, 'utf-8')
    const animals = JSON.parse(data)
    
    // Ensure all animals have an events array (for backwards compatibility)
    return animals.map((animal: Animal) => ({
      ...animal,
      events: animal.events || []
    }))
  } catch (error) {
    // If file doesn't exist, return empty array
    return []
  }
}

// Get animal by ID
export async function getAnimalById(id: string): Promise<Animal | null> {
  const animals = await getAnimals()
  return animals.find(animal => animal.id === id) || null
}

// Save all animals
async function saveAnimals(animals: Animal[]): Promise<void> {
  await ensureDataDir()
  await fs.writeFile(ANIMALS_FILE, JSON.stringify(animals, null, 2))
}

// Add new animal
export async function addAnimal(formData: AnimalFormData, profilePictureUrl?: string): Promise<Animal> {
  const animals = await getAnimals()
  
  const now = new Date().toISOString()
  const animal: Animal = {
    id: uuidv4(),
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
    events: [], // Initialize empty events array
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

  animals.push(animal)
  await saveAnimals(animals)
  
  return animal
}

// Update animal
export async function updateAnimal(id: string, updates: Partial<Animal>): Promise<Animal | null> {
  const animals = await getAnimals()
  const index = animals.findIndex(animal => animal.id === id)
  
  if (index === -1) {
    return null
  }

  animals[index] = {
    ...animals[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  }

  await saveAnimals(animals)
  return animals[index]
}

// Delete animal
export async function deleteAnimal(id: string): Promise<boolean> {
  const animals = await getAnimals()
  const index = animals.findIndex(animal => animal.id === id)
  
  if (index === -1) {
    return false
  }

  animals.splice(index, 1)
  await saveAnimals(animals)
  return true
}

// Add weight record
export async function addWeightRecord(id: string, weight: number, unit: 'lbs' | 'kg', notes?: string): Promise<Animal | null> {
  const animal = await getAnimalById(id)
  if (!animal) return null

  const weightRecord = {
    date: new Date().toISOString(),
    weight,
    unit,
    notes,
  }

  animal.weight.push(weightRecord)
  return await updateAnimal(id, { weight: animal.weight })
}

// Add height record
export async function addHeightRecord(
  id: string, 
  height: number, 
  unit: 'inches' | 'cm' | 'hands',
  measurementType: 'shoulder' | 'withers' | 'total',
  notes?: string
): Promise<Animal | null> {
  const animal = await getAnimalById(id)
  if (!animal) return null

  const heightRecord = {
    date: new Date().toISOString(),
    height,
    unit,
    measurementType,
    notes,
  }

  animal.height.push(heightRecord)
  return await updateAnimal(id, { height: animal.height })
}

// Add event entry
export async function addEventEntry(
  animalId: string,
  eventData: {
    type: EventType;
    title: string;
    description?: string;
    notes?: string;
    date: string;
    veterinarian?: string;
    cost?: number;
    attachments?: string[];
  }
): Promise<Animal | null> {
  const animal = await getAnimalById(animalId)
  if (!animal) return null

  const now = new Date().toISOString()
  const event: EventEntry = {
    id: uuidv4(),
    date: eventData.date,
    type: eventData.type,
    title: eventData.title.trim(),
    description: eventData.description?.trim(),
    notes: eventData.notes?.trim(),
    veterinarian: eventData.veterinarian?.trim(),
    cost: eventData.cost,
    attachments: eventData.attachments || [],
    createdAt: now,
    updatedAt: now,
  }

  if (!animal.events) {
    animal.events = []
  }
  animal.events.push(event)
  animal.events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return await updateAnimal(animalId, { events: animal.events })
}

// Update event entry
export async function updateEventEntry(
  animalId: string,
  eventId: string,
  updates: Partial<EventEntry>
): Promise<Animal | null> {
  const animal = await getAnimalById(animalId)
  if (!animal || !animal.events) return null

  const eventIndex = animal.events.findIndex(event => event.id === eventId)
  if (eventIndex === -1) return null

  animal.events[eventIndex] = {
    ...animal.events[eventIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
  }

  animal.events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return await updateAnimal(animalId, { events: animal.events })
}

// Delete event entry
export async function deleteEventEntry(animalId: string, eventId: string): Promise<Animal | null> {
  const animal = await getAnimalById(animalId)
  if (!animal || !animal.events) return null

  const eventIndex = animal.events.findIndex(event => event.id === eventId)
  if (eventIndex === -1) return null

  animal.events.splice(eventIndex, 1)

  return await updateAnimal(animalId, { events: animal.events })
}

// Settings management functions

// Get app settings
export async function getSettings(): Promise<AppSettings> {
  try {
    await ensureDataDir()
    const data = await fs.readFile(SETTINGS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    // If file doesn't exist, return default settings
    return defaultSettings
  }
}

// Update app settings
export async function updateSettings(updates: Partial<AppSettings>): Promise<AppSettings> {
  const currentSettings = await getSettings()
  
  const updatedSettings: AppSettings = {
    ...currentSettings,
    ...updates,
    updatedAt: new Date().toISOString()
  }

  await ensureDataDir()
  await fs.writeFile(SETTINGS_FILE, JSON.stringify(updatedSettings, null, 2))
  
  return updatedSettings
}

// Reset settings to defaults
export async function resetSettings(): Promise<AppSettings> {
  const newSettings = {
    ...defaultSettings,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  await ensureDataDir()
  await fs.writeFile(SETTINGS_FILE, JSON.stringify(newSettings, null, 2))
  
  return newSettings
} 