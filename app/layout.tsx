import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navigation from '@/components/Navigation'
import { SettingsProvider } from '@/lib/settings-context'
import { AuthProvider } from '@/lib/auth-context'
import AuthWrapper from '@/components/AuthWrapper'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'My Pet Ledger - Comprehensive Animal Management',
  description: 'A beautiful and comprehensive animal management system for tracking your beloved pets',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gradient-to-br from-sage-25 via-white to-primary-25 min-h-screen`}>
        <AuthProvider>
          <AuthWrapper>
            <SettingsProvider>
              {children}
            </SettingsProvider>
          </AuthWrapper>
        </AuthProvider>
      </body>
    </html>
  )
} 