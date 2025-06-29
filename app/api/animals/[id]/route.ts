import { NextRequest, NextResponse } from 'next/server'
import { updateAnimal } from '@/lib/firestore-data'
import { AnimalFormData } from '@/types/animal'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { v4 as uuidv4 } from 'uuid'

// Conditional imports based on environment
let getAnimalByIdFunc: any, requireAuthFunc: any

if (process.env.NODE_ENV === 'development') {
  console.log('Loading development modules for [id] route...')
  const { getAnimalByIdDev } = require('@/lib/firestore-data-dev')
  const { requireAuthDev } = require('@/lib/auth-server-dev')
  getAnimalByIdFunc = getAnimalByIdDev
  requireAuthFunc = requireAuthDev
} else {
  console.log('Loading production modules for [id] route...')
  const { getAnimalByIdServer } = require('@/lib/firestore-data-server')
  const { requireAuth } = require('@/lib/auth-server')
  getAnimalByIdFunc = getAnimalByIdServer
  requireAuthFunc = requireAuth
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await requireAuthFunc(request)
    const animal = await getAnimalByIdFunc(params.id, userId)
    
    if (!animal) {
      return NextResponse.json(
        { error: 'Animal not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(animal)
  } catch (error) {
    console.error('Error fetching animal:', error)
    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to fetch animal' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await requireAuthFunc(request)
    const data = await request.formData()
    
    // Extract form fields
    const formData: AnimalFormData = {
      name: data.get('name') as string,
      species: data.get('species') as any,
      breed: data.get('breed') as string,
      dateOfBirth: data.get('dateOfBirth') as string,
      deathDate: data.get('deathDate') as string,
      sex: data.get('sex') as any,
      color: data.get('color') as string,
      markings: data.get('markings') as string,
      initialWeight: data.get('initialWeight') as string,
      weightUnit: data.get('weightUnit') as any,
      initialHeight: data.get('initialHeight') as string,
      heightUnit: data.get('heightUnit') as any,
      heightMeasurementType: data.get('heightMeasurementType') as any,
      medicalNotes: data.get('medicalNotes') as string,
      specialNeeds: data.get('specialNeeds') as string,
      microchipId: data.get('microchipId') as string,
      registrationNumber: data.get('registrationNumber') as string,
      ownerName: data.get('ownerName') as string,
      ownerEmail: data.get('ownerEmail') as string,
      ownerPhone: data.get('ownerPhone') as string,
      ownerAddress: data.get('ownerAddress') as string,
    }
    
    // Basic validation
    if (!formData.name) {
      return NextResponse.json(
        { error: 'Missing required field: name' },
        { status: 400 }
      )
    }

    // Check if animal exists
    const existingAnimal = await getAnimalByIdFunc(params.id, userId)
    if (!existingAnimal) {
      return NextResponse.json(
        { error: 'Animal not found' },
        { status: 404 }
      )
    }

    // Handle profile picture upload
    let profilePictureUrl = existingAnimal.profilePicture // Keep existing if no new upload
    const profilePictureFile = data.get('profilePicture') as File
    
    if (profilePictureFile && profilePictureFile.size > 0) {
      // Validate file type
      if (!profilePictureFile.type.startsWith('image/')) {
        return NextResponse.json(
          { error: 'Profile picture must be an image' },
          { status: 400 }
        )
      }

      // Validate file size (5MB limit)
      if (profilePictureFile.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { error: 'Profile picture must be less than 5MB' },
          { status: 400 }
        )
      }

      const bytes = await profilePictureFile.arrayBuffer()
      const buffer = Buffer.from(bytes)

      // Generate unique filename
      const fileExtension = profilePictureFile.name.split('.').pop()
      const fileName = `${uuidv4()}.${fileExtension}`
      const filePath = join(process.cwd(), 'public/uploads', fileName)

      // Write the file
      await writeFile(filePath, buffer)
      profilePictureUrl = `/uploads/${fileName}`
    }

    // Convert form data to animal updates
    const updates: any = {
      name: formData.name,
      species: formData.species,
      breed: formData.breed || undefined,
      dateOfBirth: formData.dateOfBirth || undefined,
      deathDate: formData.deathDate || undefined,
      sex: formData.sex,
      color: formData.color || undefined,
      markings: formData.markings || undefined,
      medicalNotes: formData.medicalNotes || undefined,
      specialNeeds: formData.specialNeeds || undefined,
      microchipId: formData.microchipId || undefined,
      registrationNumber: formData.registrationNumber || undefined,
      profilePicture: profilePictureUrl,
      ownerInfo: {
        name: formData.ownerName,
        email: formData.ownerEmail || undefined,
        phone: formData.ownerPhone || undefined,
        address: formData.ownerAddress || undefined,
      },
    }

    // Update weight if provided
    if (formData.initialWeight) {
      const newWeightRecord = {
        date: new Date().toISOString(),
        weight: parseFloat(formData.initialWeight),
        unit: formData.weightUnit,
        notes: 'Updated weight record'
      }
      updates.weight = [...existingAnimal.weight, newWeightRecord]
    }

    // Update height if provided
    if (formData.initialHeight) {
      const newHeightRecord = {
        date: new Date().toISOString(),
        height: parseFloat(formData.initialHeight),
        unit: formData.heightUnit,
        measurementType: formData.heightMeasurementType,
        notes: 'Updated height record'
      }
      updates.height = [...existingAnimal.height, newHeightRecord]
    }

    const updatedAnimal = await updateAnimal(params.id, updates)
    
    if (!updatedAnimal) {
      return NextResponse.json(
        { error: 'Failed to update animal' },
        { status: 500 }
      )
    }

    return NextResponse.json(updatedAnimal)
  } catch (error) {
    console.error('Error updating animal:', error)
    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to update animal' },
      { status: 500 }
    )
  }
}

 