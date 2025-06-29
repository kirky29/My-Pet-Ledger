'use client'

import { ArrowLeft, Plus, Heart, TreePine, Leaf, Bird } from 'lucide-react'
import Link from 'next/link'
import AnimalForm from '@/components/AnimalForm'

export default function AddAnimalPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-forest-50 via-primary-50 to-sage-50 rounded-3xl p-8 border border-white/50 shadow-nature">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary-200/30 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-sage-200/20 to-transparent rounded-full translate-y-20 -translate-x-20"></div>
        
        <div className="relative">
          <div className="flex items-center justify-between flex-wrap gap-6">
            <div className="flex items-center space-x-4">
              <div className="flex space-x-2">
                <div className="p-3 bg-gradient-to-br from-primary-500 to-forest-600 rounded-2xl shadow-lg">
                  <Plus className="h-6 w-6 text-white" />
                </div>
                <div className="p-3 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-2xl shadow-lg">
                  <Heart className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-earth-900 to-forest-800 bg-clip-text text-transparent">
                  Welcome a New Friend
                </h1>
                <p className="text-earth-600 text-lg mt-1">
                  Every pet deserves a loving home and comprehensive care
                </p>
              </div>
            </div>
            
            <Link 
              href="/animals" 
              className="btn-secondary flex items-center space-x-2"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Pets</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Registration Tips */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center">
          <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl w-fit mx-auto mb-4">
            <TreePine className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-earth-900 mb-2">Complete Profile</h3>
          <p className="text-sm text-earth-600">Add detailed information to create a comprehensive health record for your pet.</p>
        </div>
        
        <div className="card text-center">
          <div className="p-3 bg-gradient-to-br from-green-100 to-green-200 rounded-xl w-fit mx-auto mb-4">
            <Leaf className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-earth-900 mb-2">Track Growth</h3>
          <p className="text-sm text-earth-600">Monitor your pet's weight, height, and health milestones over time.</p>
        </div>
        
        <div className="card text-center">
          <div className="p-3 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl w-fit mx-auto mb-4">
            <Bird className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="font-semibold text-earth-900 mb-2">Lifelong Memories</h3>
          <p className="text-sm text-earth-600">Create a lasting digital record of your pet's journey and special moments.</p>
        </div>
      </div>

      {/* Animal Form */}
      <div className="card">
        <div className="flex items-center space-x-3 mb-8">
          <div className="p-2 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg">
            <Plus className="h-5 w-5 text-primary-600" />
          </div>
          <h2 className="text-2xl font-semibold text-earth-900">Pet Registration Form</h2>
        </div>
        
        <AnimalForm />
      </div>
    </div>
  )
} 