import { NextRequest } from 'next/server'

export async function verifyAuthTokenDev(request: NextRequest): Promise<string | null> {
  console.log('=== verifyAuthTokenDev - Starting (Development Mode) ===')
  
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
    
    try {
      // Decode the JWT token to get the user ID without verification
      const base64Payload = token.split('.')[1]
      console.log('Token payload section length:', base64Payload?.length)
      
      const payload = JSON.parse(Buffer.from(base64Payload, 'base64').toString())
      console.log('Decoded payload:', JSON.stringify(payload, null, 2))
      
      const userId = payload.user_id || payload.sub || payload.uid || 'dev-user'
      console.log('Development mode: extracted user ID:', userId)
      return userId
    } catch (parseError) {
      console.error('Error parsing token in development:', parseError)
      console.log('Using fallback dev-user ID')
      return 'dev-user' // Fallback user ID for development
    }
  } catch (error) {
    console.error('=== ERROR in verifyAuthTokenDev ===')
    console.error('Error verifying auth token:', error)
    return 'dev-user' // Always return a user ID in development
  }
}

export async function requireAuthDev(request: NextRequest): Promise<string> {
  console.log('=== requireAuthDev - Starting (Development Mode) ===')
  const userId = await verifyAuthTokenDev(request)
  console.log('verifyAuthTokenDev returned:', userId)
  
  if (!userId) {
    console.log('No userId returned - using fallback dev-user')
    return 'dev-user'
  }
  
  console.log('Authentication successful, returning userId:', userId)
  return userId
} 