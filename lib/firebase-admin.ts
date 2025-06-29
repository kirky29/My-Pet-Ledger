import { initializeApp, getApps, cert, applicationDefault } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { getAuth } from 'firebase-admin/auth'

// Initialize Firebase Admin SDK if not already initialized
if (!getApps().length) {
  try {
    // Try to use service account credentials first (for production)
    if (process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
      console.log('Initializing Firebase Admin with service account credentials')
      initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID || "my-pet-ledger",
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
        projectId: process.env.FIREBASE_PROJECT_ID || "my-pet-ledger",
      })
    } else {
      // For local development, use application default credentials or minimal config
      console.log('Initializing Firebase Admin with minimal config for development')
      initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID || "my-pet-ledger",
      })
    }
  } catch (error) {
    console.error('Firebase admin initialization error:', error)
    // Final fallback - minimal initialization
    try {
      initializeApp({
        projectId: "my-pet-ledger",
      })
    } catch (fallbackError) {
      console.error('Firebase admin fallback initialization error:', fallbackError)
    }
  }
}

export const adminDb = getFirestore()
export const adminAuth = getAuth() 