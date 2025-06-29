'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { 
  Heart, 
  Menu, 
  X, 
  Home, 
  Plus, 
  PawPrint,
  Settings,
  BarChart3,
  Calendar,
  Stethoscope,
  TreePine,
  Leaf,
  Bird,
  User,
  LogOut
} from 'lucide-react'

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/',
    icon: Home,
    description: 'Overview & stats'
  },
  {
    name: 'All Pets',
    href: '/animals',
    icon: PawPrint,
    description: 'View all animals'
  },
  {
    name: 'Add Pet',
    href: '/add-animal',
    icon: Plus,
    description: 'Register new pet'
  },
  {
    name: 'Health Center',
    href: '/health',
    icon: Stethoscope,
    description: 'Medical records',
    disabled: true
  },
  {
    name: 'Calendar',
    href: '/calendar',
    icon: Calendar,
    description: 'Appointments & events',
    disabled: true
  },
  {
    name: 'Reports',
    href: '/reports',
    icon: BarChart3,
    description: 'Analytics & insights',
    disabled: true
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
    description: 'App preferences'
  }
]

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:block fixed left-0 top-0 h-screen w-72 bg-gradient-to-b from-forest-50 via-white to-sage-50 border-r border-sage-200/50 shadow-nature z-40">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="p-3 bg-gradient-to-br from-primary-500 to-forest-600 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-secondary-400 to-secondary-500 rounded-full">
                  <Leaf className="h-3 w-3 text-white m-0.5" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-earth-900 to-forest-800 bg-clip-text text-transparent">
                  Pet Ledger
                </h1>
                <p className="text-sm text-earth-600 font-medium">Animal Management</p>
              </div>
            </Link>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 px-4 pb-6">
            <div className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon
                const active = isActive(item.href)
                
                if (item.disabled) {
                  return (
                    <div
                      key={item.name}
                      className="flex items-center space-x-3 px-4 py-3 rounded-xl text-earth-400 cursor-not-allowed"
                    >
                      <Icon className="h-5 w-5" />
                      <div className="flex-1">
                        <span className="font-medium">{item.name}</span>
                        <p className="text-xs text-earth-300">Coming Soon</p>
                      </div>
                    </div>
                  )
                }

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                      active
                        ? 'bg-gradient-to-r from-primary-100 to-primary-50 text-primary-700 shadow-sm border border-primary-200/50'
                        : 'text-earth-600 hover:bg-sage-50 hover:text-earth-800'
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${active ? 'text-primary-600' : 'group-hover:text-earth-700'}`} />
                    <div className="flex-1">
                      <span className="font-medium">{item.name}</span>
                      <p className="text-xs opacity-75">{item.description}</p>
                    </div>
                    {active && (
                      <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* User Profile Section */}
          {user && (
            <div className="p-4 border-t border-sage-200/50">
              <div className="bg-gradient-to-r from-sage-50 to-primary-50 rounded-xl p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-earth-800 truncate">
                      {user.displayName || user.email}
                    </p>
                    <p className="text-xs text-earth-600 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-white/80 hover:bg-white text-earth-700 hover:text-earth-800 rounded-lg transition-colors border border-earth-200/50 hover:border-earth-300/50"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="text-sm font-medium">Sign Out</span>
                </button>
              </div>
            </div>
          )}
          
          {/* Footer Message */}
          <div className="p-4 pt-2">
            <div className="text-center">
              <div className="flex justify-center space-x-2 mb-2">
                <TreePine className="h-4 w-4 text-forest-600" />
                <Bird className="h-4 w-4 text-secondary-600" />
                <Leaf className="h-4 w-4 text-sage-600" />
              </div>
              <p className="text-xs font-medium text-earth-800">Every pet deserves love</p>
              <p className="text-xs text-earth-600">& comprehensive care</p>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="lg:hidden fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-sage-200/50 shadow-sm z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-to-br from-primary-500 to-forest-600 rounded-xl">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-earth-900">Pet Ledger</h1>
            </div>
          </Link>

          <div className="flex items-center space-x-2">
            {user && (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-medium text-earth-800 max-w-24 truncate">
                  {user.displayName || user.email?.split('@')[0]}
                </span>
              </div>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-earth-600 hover:bg-sage-100 rounded-lg transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border-b border-sage-200/50 shadow-lg">
            <div className="px-4 py-2 space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon
                const active = isActive(item.href)
                
                if (item.disabled) {
                  return (
                    <div
                      key={item.name}
                      className="flex items-center space-x-3 px-3 py-2 rounded-lg text-earth-400"
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-sm">{item.name}</span>
                      <span className="text-xs text-earth-300 ml-auto">Soon</span>
                    </div>
                  )
                }

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      active
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-earth-600 hover:bg-sage-50'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{item.name}</span>
                  </Link>
                )
              })}
              
              {/* Mobile Logout Button */}
              {user && (
                <div className="pt-2 mt-2 border-t border-sage-200/50">
                  <button
                    onClick={() => {
                      setIsOpen(false)
                      handleLogout()
                    }}
                    className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="text-sm font-medium">Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/20 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
} 