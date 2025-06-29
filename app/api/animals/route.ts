import { NextRequest, NextResponse } from 'next/server'
import { addAnimalServer, getAnimalsServer } from '@/lib/firestore-data-server'
import { requireAuth } from '@/lib/auth-server'
import { AnimalFormData } from '@/types/animal'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { v4 as uuidv4 } from 'uuid'

export async function GET(request: NextRequest) {
  try {
    const userId = await requireAuth(request)
    const animals = await getAnimalsServer(userId)
    return NextResponse.json(animals)
  } catch (error) {
    console.error('Error fetching animals:', error)
    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to fetch animals' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  console.log('=== POST /api/animals - Starting animal creation ===')
  try {
    console.log('1. Attempting to verify authentication...')
    console.log('Request headers:', Object.fromEntries(request.headers.entries()))
    
    // Verify authentication first
    const userId = await requireAuth(request)
    console.log('2. Authentication successful, userId:', userId)
    
    console.log('3. Parsing form data...')
    const data = await request.formData()
    console.log('4. Form data keys:', Array.from(data.keys()))
    
    // Extract form fields
    console.log('5. Extracting form fields...')
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
    console.log('6. Form data extracted:', { name: formData.name, species: formData.species })
    
    // Basic validation
    console.log('7. Validating form data...')
    if (!formData.name) {
      console.log('ERROR: Missing required field: name')
      return NextResponse.json(
        { error: 'Missing required field: name' },
        { status: 400 }
      )
    }
    console.log('8. Validation passed')

    // Handle profile picture upload
    console.log('9. Handling profile picture...')
    let profilePictureUrl = ''
    const profilePictureFile = data.get('profilePicture') as File
    console.log('10. Profile picture file:', profilePictureFile ? `${profilePictureFile.name} (${profilePictureFile.size} bytes)` : 'none')
    
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
    console.log('11. Profile picture handling complete, URL:', profilePictureUrl || 'none')

    console.log('12. Creating animal with addAnimalServer...')
    console.log('    - userId:', userId)
    console.log('    - profilePictureUrl:', profilePictureUrl)
    console.log('    - formData.name:', formData.name)
    
    const animal = await addAnimalServer(formData, profilePictureUrl, userId)
    console.log('13. Animal created successfully:', animal.id)
    
    return NextResponse.json(animal, { status: 201 })
  } catch (error) {
    console.error('=== ERROR in POST /api/animals ===')
    console.error('Error creating animal:', error)
    
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
      
      if (error.message === 'Authentication required') {
        console.error('Authentication failed - returning 401')
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        )
      }
    }
    
    console.error('Unknown error - returning 500')
    console.error('Error type:', typeof error)
    console.error('Error constructor:', error?.constructor?.name)
    
    return NextResponse.json(
      { error: 'Failed to create animal', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 