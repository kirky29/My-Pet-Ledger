import { Animal, AnimalFormData } from '@/types/animal'
import { v4 as uuidv4 } from 'uuid'

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

// Add new animal (server-side version)
export async function addAnimalServer(formData: AnimalFormData, profilePictureUrl: string | undefined, userId: string): Promise<Animal> {
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
    
    // Dynamically import Firebase Admin modules
    const { adminDb } = await import('./firebase-admin')
    const { FieldValue } = await import('firebase-admin/firestore')
    
    const docRef = adminDb.collection('animals').doc(animalId)
    await docRef.set({
      ...cleanedAnimal,
      userId: userId,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    })
    
    console.log('Successfully added animal:', animalId)
    return animal
  } catch (error) {
    console.error('Error adding animal:', error)
    if (error instanceof Error) {
      console.error('Error details:', error.message)
      console.error('Error stack:', error.stack)
    }
    throw error
  }
}

// Get all animals for a user (server-side version)
export async function getAnimalsServer(userId: string): Promise<Animal[]> {
  try {
    // Dynamically import Firebase Admin modules
    const { adminDb } = await import('./firebase-admin')
    
    const animalsRef = adminDb.collection('animals')
    const querySnapshot = await animalsRef
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get()
    
    const animals: Animal[] = []
    querySnapshot.forEach((doc: any) => {
      const data = doc.data()
      animals.push({
        ...data,
        id: doc.id,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt,
        events: data.events || []
      } as Animal)
    })
    
    return animals
  } catch (error) {
    console.error('Error getting animals:', error)
    return []
  }
}

// Get animal by ID (server-side version)
export async function getAnimalByIdServer(id: string, userId: string): Promise<Animal | null> {
  try {
    // Dynamically import Firebase Admin modules
    const { adminDb } = await import('./firebase-admin')
    
    const docRef = adminDb.collection('animals').doc(id)
    const docSnap = await docRef.get()
    
    if (docSnap.exists) {
      const data = docSnap.data()
      
      // Check if the animal belongs to the current user
      if (data?.userId !== userId) {
        return null
      }
      
      return {
        ...data,
        id: docSnap.id,
        createdAt: data?.createdAt?.toDate?.()?.toISOString() || data?.createdAt,
        updatedAt: data?.updatedAt?.toDate?.()?.toISOString() || data?.updatedAt,
        events: data?.events || []
      } as Animal
    }
    return null
  } catch (error) {
    console.error('Error getting animal by ID:', error)
    return null
  }
} 