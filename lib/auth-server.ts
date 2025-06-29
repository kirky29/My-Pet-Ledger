import { NextRequest } from 'next/server'

export async function verifyAuthToken(request: NextRequest): Promise<string | null> {
  console.log('=== verifyAuthToken - Starting ===')
  try {
    const authHeader = request.headers.get('authorization')
    console.log('Auth header present:', !!authHeader)
    console.log('Auth header starts with Bearer:', authHeader?.startsWith('Bearer '))
    
    if (!authHeader?.startsWith('Bearer ')) {
      console.log('No valid auth header found')
      return null
    }

    const token = authHeader.split('Bearer ')[1]
    console.log('Token extracted, length:', token?.length)
    console.log('NODE_ENV:', process.env.NODE_ENV)
    
    // In development mode, skip actual token verification and extract user ID from token
    if (process.env.NODE_ENV === 'development') {
      console.log('Development mode: skipping token verification')
      try {
        // Decode the JWT token to get the user ID without verification
        const base64Payload = token.split('.')[1]
        console.log('Token payload section length:', base64Payload?.length)
        
        const payload = JSON.parse(Buffer.from(base64Payload, 'base64').toString())
        console.log('Decoded payload:', JSON.stringify(payload, null, 2))
        
        const userId = payload.user_id || payload.sub || 'dev-user'
        console.log('Development mode: extracted user ID:', userId)
        return userId
      } catch (parseError) {
        console.error('Error parsing token in development:', parseError)
        console.log('Using fallback dev-user ID')
        return 'dev-user' // Fallback user ID for development
      }
    }
    
    // In production, verify the token properly
    console.log('Production mode: verifying token with Firebase Admin')
    // Dynamically import Firebase Admin only in production
    const { adminAuth } = await import('./firebase-admin')
    const decodedToken = await adminAuth.verifyIdToken(token)
    console.log('Token verified successfully, uid:', decodedToken.uid)
    return decodedToken.uid
  } catch (error) {
    console.error('=== ERROR in verifyAuthToken ===')
    console.error('Error verifying auth token:', error)
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    return null
  }
}

export async function requireAuth(request: NextRequest): Promise<string> {
  console.log('=== requireAuth - Starting ===')
  const userId = await verifyAuthToken(request)
  console.log('verifyAuthToken returned:', userId)
  
  if (!userId) {
    console.log('No userId returned - throwing Authentication required error')
    throw new Error('Authentication required')
  }
  
  console.log('Authentication successful, returning userId:', userId)
  return userId
} 