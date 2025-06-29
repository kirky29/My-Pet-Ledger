import { NextRequest } from 'next/server'
import { adminAuth } from './firebase-admin'

export async function verifyAuthToken(request: NextRequest): Promise<string | null> {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return null
    }

    const token = authHeader.split('Bearer ')[1]
    
    // In development mode, skip actual token verification and extract user ID from token
    if (process.env.NODE_ENV === 'development') {
      console.log('Development mode: skipping token verification')
      try {
        // Decode the JWT token to get the user ID without verification
        const base64Payload = token.split('.')[1]
        const payload = JSON.parse(Buffer.from(base64Payload, 'base64').toString())
        console.log('Development mode: extracted user ID:', payload.user_id || payload.sub)
        return payload.user_id || payload.sub || 'dev-user'
      } catch (parseError) {
        console.error('Error parsing token in development:', parseError)
        return 'dev-user' // Fallback user ID for development
      }
    }
    
    // In production, verify the token properly
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