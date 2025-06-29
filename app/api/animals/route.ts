import { NextRequest, NextResponse } from 'next/server'
import { addAnimal, getAnimals } from '@/lib/firestore-data'
import { AnimalFormData } from '@/types/animal'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { v4 as uuidv4 } from 'uuid'

export async function GET(request: NextRequest) {
  try {
    const animals = await getAnimals()
    return NextResponse.json(animals)
  } catch (error) {
    console.error('Error fetching animals:', error)
    return NextResponse.json(
      { error: 'Failed to fetch animals' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
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

    // Handle profile picture upload
    let profilePictureUrl = ''
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

    const animal = await addAnimal(formData, profilePictureUrl)
    
    return NextResponse.json(animal, { status: 201 })
  } catch (error) {
    console.error('Error creating animal:', error)
    return NextResponse.json(
      { error: 'Failed to create animal' },
      { status: 500 }
    )
  }
} 