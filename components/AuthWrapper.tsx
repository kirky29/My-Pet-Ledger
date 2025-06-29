'use client'

import { useAuth } from '@/lib/auth-context'
import { usePathname } from 'next/navigation'
import ProtectedRoute from './ProtectedRoute'
import Navigation from './Navigation'

interface AuthWrapperProps {
  children: React.ReactNode
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const { user, loading } = useAuth()
  const pathname = usePathname()

  // List of public routes that don't require authentication
  const publicRoutes = [
    '/auth/login',
    '/auth/signup',
    '/auth/reset-password'
  ]

  // Check if current route is public
  const isPublicRoute = publicRoutes.includes(pathname)

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sage-25 via-white to-primary-25">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // If it's a public route, render without navigation
  if (isPublicRoute) {
    return <>{children}</>
  }

  // For protected routes, render with full navigation layout
  return (
    <ProtectedRoute>
      <div className="min-h-screen">
        <Navigation />
        
        {/* Main Content */}
        <main className="lg:ml-72 min-h-screen">
          {/* Mobile top padding */}
          <div className="lg:hidden h-16"></div>
          
          {/* Content wrapper */}
          <div className="relative">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-20 right-10 w-64 h-64 bg-gradient-to-br from-primary-100/30 to-transparent rounded-full blur-3xl"></div>
              <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-tr from-sage-100/20 to-transparent rounded-full blur-3xl"></div>
            </div>
            
            {/* Actual content */}
            <div className="relative z-10 p-6 lg:p-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
} 