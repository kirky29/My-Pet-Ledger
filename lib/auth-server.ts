import { NextRequest } from 'next/server'
import { adminAuth } from './firebase-admin'

export async function verifyAuthToken(request: NextRequest): Promise<string | null> {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return null
    }

    const token = authHeader.split('Bearer ')[1]
    const decodedToken = await adminAuth.verifyIdToken(token)
    return decodedToken.uid
  } catch (error) {
    console.error('Error verifying auth token:', error)
    return null
  }
}

export async function requireAuth(request: NextRequest): Promise<string> {
  const userId = await verifyAuthToken(request)
  if (!userId) {
    throw new Error('Authentication required')
  }
  return userId
} 