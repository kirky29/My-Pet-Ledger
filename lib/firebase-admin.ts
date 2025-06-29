import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { getAuth } from 'firebase-admin/auth'

// Initialize Firebase Admin SDK if not already initialized
if (!getApps().length) {
  try {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID || "my-pet-ledger",
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
      projectId: process.env.FIREBASE_PROJECT_ID || "my-pet-ledger",
    })
  } catch (error) {
    console.error('Firebase admin initialization error:', error)
    // Fallback initialization for development
    initializeApp({
      projectId: process.env.FIREBASE_PROJECT_ID || "my-pet-ledger",
    })
  }
}

export const adminDb = getFirestore()
export const adminAuth = getAuth() 