import { Animal, AnimalFormData, EventEntry, EventType } from '@/types/animal'
import { AppSettings, defaultSettings } from '@/types/settings'
import { db, auth } from './firebase'
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  where,
  serverTimestamp,
  Timestamp,
  setDoc
} from 'firebase/firestore'
import { v4 as uuidv4 } from 'uuid'

// Collection references
const ANIMALS_COLLECTION = 'animals'
const SETTINGS_COLLECTION = 'settings'

// Helper function to get current user ID
function getCurrentUserId(): string {
  if (!auth.currentUser) {
    throw new Error('User must be authenticated')
  }
  return auth.currentUser.uid
}

// Helper function to get settings document ID for current user
function getSettingsDocId(): string {
  return `user-settings-${getCurrentUserId()}`
}

// Helper function to convert Firestore timestamp to ISO string
function timestampToISO(timestamp: any): string {
  if (timestamp && timestamp.toDate) {
    return timestamp.toDate().toISOString()
  }
  if (timestamp instanceof Date) {
    return timestamp.toISOString()
  }
  return timestamp || new Date().toISOString()
}

// Helper function to clean data for Firestore (remove undefined values)
function cleanForFirestore(obj: any): any {
  if (obj === null || obj === undefined) return null
  if (Array.isArray(obj)) return obj.map(cleanForFirestore)
  if (typeof obj === 'object') {
    const cleaned: any = {}
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined) {
        cleaned[key] = cleanForFirestore(value)
      }
    }
    return cleaned
  }
  return obj
}

// Get all animals
export async function getAnimals(): Promise<Animal[]> {
  try {
    const userId = getCurrentUserId()
    const animalsRef = collection(db, ANIMALS_COLLECTION)
    const q = query(animalsRef, where('userId', '==', userId), orderBy('createdAt', 'desc'))
    const querySnapshot = await getDocs(q)
    
    const animals: Animal[] = []
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      animals.push({
        ...data,
        id: doc.id,
        createdAt: timestampToISO(data.createdAt),
        updatedAt: timestampToISO(data.updatedAt),
        events: data.events || []
      } as Animal)
    })
    
    return animals
  } catch (error) {
    console.error('Error getting animals:', error)
    return []
  }
}

// Get animal by ID
export async function getAnimalById(id: string): Promise<Animal | null> {
  try {
    const userId = getCurrentUserId()
    const docRef = doc(db, ANIMALS_COLLECTION, id)
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      const data = docSnap.data()
      
      // Check if the animal belongs to the current user
      if (data.userId !== userId) {
        return null
      }
      
      return {
        ...data,
        id: docSnap.id,
        createdAt: timestampToISO(data.createdAt),
        updatedAt: timestampToISO(data.updatedAt),
        events: data.events || []
      } as Animal
    }
    return null
  } catch (error) {
    console.error('Error getting animal by ID:', error)
    return null
  }
}

// Add new animal
export async function addAnimal(formData: AnimalFormData, profilePictureUrl?: string): Promise<Animal> {
  const userId = getCurrentUserId()
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
    const cleanedAnimal = cleanForFirestore(animal)
    const docRef = doc(db, ANIMALS_COLLECTION, animalId)
    await setDoc(docRef, {
      ...cleanedAnimal,
      userId: userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
    
    return animal
  } catch (error) {
    console.error('Error adding animal:', error)
    throw error
  }
}

// Update animal
export async function updateAnimal(id: string, updates: Partial<Animal>): Promise<Animal | null> {
  try {
    const docRef = doc(db, ANIMALS_COLLECTION, id)
    const cleanedUpdates = cleanForFirestore(updates)
    
    await updateDoc(docRef, {
      ...cleanedUpdates,
      updatedAt: serverTimestamp()
    })

    // Return the updated animal
    return await getAnimalById(id)
  } catch (error) {
    console.error('Error updating animal:', error)
    return null
  }
}

// Delete animal
export async function deleteAnimal(id: string): Promise<boolean> {
  try {
    const docRef = doc(db, ANIMALS_COLLECTION, id)
    await deleteDoc(docRef)
    return true
  } catch (error) {
    console.error('Error deleting animal:', error)
    return false
  }
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
    const docRef = doc(db, SETTINGS_COLLECTION, getSettingsDocId())
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      const data = docSnap.data()
      return {
        ...data,
        createdAt: timestampToISO(data.createdAt),
        updatedAt: timestampToISO(data.updatedAt)
      } as AppSettings
    } else {
      // If settings don't exist, create default settings
      const newSettings = {
        ...defaultSettings,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      await setDoc(docRef, {
        ...cleanForFirestore(newSettings),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      return newSettings
    }
  } catch (error) {
    console.error('Error getting settings:', error)
    return defaultSettings
  }
}

// Update app settings
export async function updateSettings(updates: Partial<AppSettings>): Promise<AppSettings> {
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, getSettingsDocId())
    const cleanedUpdates = cleanForFirestore(updates)
    
    await updateDoc(docRef, {
      ...cleanedUpdates,
      updatedAt: serverTimestamp()
    })

    // Return the updated settings
    return await getSettings()
  } catch (error) {
    console.error('Error updating settings:', error)
    throw error
  }
}

// Reset settings to defaults
export async function resetSettings(): Promise<AppSettings> {
  try {
    const newSettings = {
      ...defaultSettings,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const docRef = doc(db, SETTINGS_COLLECTION, getSettingsDocId())
    await setDoc(docRef, {
      ...cleanForFirestore(newSettings),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })

    return newSettings
  } catch (error) {
    console.error('Error resetting settings:', error)
    throw error
  }
} 