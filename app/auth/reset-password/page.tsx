'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { Mail, ArrowLeft, Heart, CheckCircle } from 'lucide-react'

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  
  const { resetPassword } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await resetPassword(email)
      setSuccess(true)
    } catch (error: any) {
      console.error('Reset password error:', error)
      
      // Handle specific Firebase auth errors
      switch (error.code) {
        case 'auth/user-not-found':
          setError('No account found with this email address.')
          break
        case 'auth/invalid-email':
          setError('Please enter a valid email address.')
          break
        default:
          setError('Failed to send reset email. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex">
        {/* Left side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-500 via-primary-600 to-forest-700 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0">
            <div className="absolute top-20 right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 left-20 w-64 h-64 bg-white/5 rounded-full blur-2xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-white/5 rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative z-10 flex flex-col justify-center px-12 py-12 text-white">
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                  <Heart className="h-12 w-12 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold">Pet Ledger</h1>
                  <p className="text-xl opacity-90">Animal Management</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <h2 className="text-3xl font-bold leading-tight">
                Check your email for the reset link
              </h2>
              <p className="text-lg opacity-90 leading-relaxed">
                We've sent a password reset link to your email address. Click the link to create a new password and regain access to your pet records.
              </p>
              
              <div className="grid grid-cols-1 gap-4 mt-8">
                <div className="flex items-center space-x-3 p-3 bg-white/10 backdrop-blur-sm rounded-lg">
                  <CheckCircle className="h-5 w-5 text-white" />
                  <span>Secure reset process</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-white/10 backdrop-blur-sm rounded-lg">
                  <CheckCircle className="h-5 w-5 text-white" />
                  <span>Link expires in 1 hour</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-white/10 backdrop-blur-sm rounded-lg">
                  <CheckCircle className="h-5 w-5 text-white" />
                  <span>Check spam folder</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Success Message */}
        <div className="w-full lg:w-1/2 flex items-center justify-center bg-gradient-to-br from-sage-25 via-white to-primary-25 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          {/* Background decoration for mobile */}
          <div className="lg:hidden absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-10 right-10 w-32 h-32 bg-gradient-to-br from-primary-100/30 to-transparent rounded-full blur-2xl"></div>
            <div className="absolute bottom-20 left-10 w-48 h-48 bg-gradient-to-tr from-sage-100/20 to-transparent rounded-full blur-2xl"></div>
          </div>

          <div className="relative max-w-md w-full space-y-8">
            {/* Mobile logo for small screens */}
            <div className="lg:hidden text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl shadow-lg">
                  <Heart className="h-8 w-8 text-white" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Pet Ledger</h1>
              <p className="text-gray-600">Animal Management</p>
            </div>

            {/* Success Message */}
            <div className="text-center">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-2xl shadow-lg">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Check your email
              </h2>
              <p className="text-gray-600 mb-8">
                We've sent a password reset link to <strong>{email}</strong>
              </p>
              
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20">
                <p className="text-sm text-gray-600 mb-4">
                  Didn't receive the email? Check your spam folder or try again.
                </p>
                <Link
                  href="/auth/login"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-500 via-primary-600 to-forest-700 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-64 h-64 bg-white/5 rounded-full blur-2xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-white/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 flex flex-col justify-center px-12 py-12 text-white">
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                <Heart className="h-12 w-12 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">Pet Ledger</h1>
                <p className="text-xl opacity-90">Animal Management</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <h2 className="text-3xl font-bold leading-tight">
              Forgot your password? No worries!
            </h2>
            <p className="text-lg opacity-90 leading-relaxed">
              Enter your email address and we'll send you a secure link to reset your password and get back to caring for your pets.
            </p>
            
            <div className="grid grid-cols-1 gap-4 mt-8">
              <div className="flex items-center space-x-3 p-3 bg-white/10 backdrop-blur-sm rounded-lg">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>Secure reset process</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-white/10 backdrop-blur-sm rounded-lg">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>Quick email delivery</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-white/10 backdrop-blur-sm rounded-lg">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>Your data stays safe</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Reset Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gradient-to-br from-sage-25 via-white to-primary-25 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background decoration for mobile */}
        <div className="lg:hidden absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 right-10 w-32 h-32 bg-gradient-to-br from-primary-100/30 to-transparent rounded-full blur-2xl"></div>
          <div className="absolute bottom-20 left-10 w-48 h-48 bg-gradient-to-tr from-sage-100/20 to-transparent rounded-full blur-2xl"></div>
        </div>

        <div className="relative max-w-md w-full space-y-8">
          {/* Mobile logo for small screens */}
          <div className="lg:hidden text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl shadow-lg">
                <Heart className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Pet Ledger</h1>
            <p className="text-gray-600">Animal Management</p>
          </div>

          {/* Header */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Reset your password
            </h2>
            <p className="text-gray-600">
              Enter your email and we'll send you a reset link
            </p>
          </div>

          {/* Reset Form */}
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-colors"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    Send reset link
                  </div>
                )}
              </button>
            </form>

            {/* Back to login */}
            <div className="mt-6 text-center">
              <Link
                href="/auth/login"
                className="inline-flex items-center text-sm text-primary-600 hover:text-primary-500 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 