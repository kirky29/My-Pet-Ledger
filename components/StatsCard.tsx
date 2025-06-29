'use client'

import { LucideIcon } from 'lucide-react'
import Link from 'next/link'

interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  color: 'primary' | 'green' | 'amber' | 'purple' | 'blue' | 'pink'
  trend?: {
    value: number
    isPositive: boolean
  }
  action?: {
    label: string
    href: string
  }
  loading?: boolean
}

const colorClasses = {
  primary: {
    background: 'bg-gradient-to-br from-primary-50 to-primary-100',
    border: 'border-primary-200',
    text: 'text-primary-600',
    textStrong: 'text-primary-800',
    iconBg: 'bg-primary-500',
    iconText: 'text-white'
  },
  green: {
    background: 'bg-gradient-to-br from-green-50 to-green-100',
    border: 'border-green-200',
    text: 'text-green-600',
    textStrong: 'text-green-800',
    iconBg: 'bg-green-500',
    iconText: 'text-white'
  },
  amber: {
    background: 'bg-gradient-to-br from-amber-50 to-amber-100',
    border: 'border-amber-200',
    text: 'text-amber-600',
    textStrong: 'text-amber-800',
    iconBg: 'bg-amber-500',
    iconText: 'text-white'
  },
  purple: {
    background: 'bg-gradient-to-br from-purple-50 to-purple-100',
    border: 'border-purple-200',
    text: 'text-purple-600',
    textStrong: 'text-purple-800',
    iconBg: 'bg-purple-500',
    iconText: 'text-white'
  },
  blue: {
    background: 'bg-gradient-to-br from-blue-50 to-blue-100',
    border: 'border-blue-200',
    text: 'text-blue-600',
    textStrong: 'text-blue-800',
    iconBg: 'bg-blue-500',
    iconText: 'text-white'
  },
  pink: {
    background: 'bg-gradient-to-br from-pink-50 to-pink-100',
    border: 'border-pink-200',
    text: 'text-pink-600',
    textStrong: 'text-pink-800',
    iconBg: 'bg-pink-500',
    iconText: 'text-white'
  }
}

export default function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
  trend,
  action,
  loading = false
}: StatsCardProps) {
  const colors = colorClasses[color]

  if (loading) {
    return (
      <div className="stats-card animate-pulse">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-8 bg-gray-200 rounded mb-1"></div>
            <div className="h-3 bg-gray-200 rounded w-20"></div>
          </div>
          <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    )
  }

  const CardContent = (
    <div className={`stats-card ${colors.background} ${colors.border} group`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className={`${colors.text} font-semibold text-sm uppercase tracking-wide mb-1`}>
            {title}
          </p>
          <div className="flex items-baseline space-x-2">
            <p className={`text-3xl font-bold ${colors.textStrong}`}>
              {typeof value === 'number' ? value.toLocaleString() : value}
            </p>
            {trend && (
              <span className={`text-sm font-medium ${
                trend.isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
            )}
          </div>
          {subtitle && (
            <p className={`text-xs ${colors.text} opacity-75 mt-1`}>
              {subtitle}
            </p>
          )}
        </div>
        
        <div className={`p-3 ${colors.iconBg} rounded-xl shadow-sm group-hover:shadow-md transition-shadow duration-200`}>
          <Icon className={`h-6 w-6 ${colors.iconText}`} />
        </div>
      </div>
      
      {action && (
        <div className="mt-4 pt-4 border-t border-white/50">
          <div className={`text-xs ${colors.text} font-medium hover:${colors.textStrong} transition-colors flex items-center space-x-1`}>
            <span>{action.label}</span>
            <span>→</span>
          </div>
        </div>
      )}
    </div>
  )

  if (action) {
    return (
      <Link href={action.href} className="block hover:scale-105 transition-transform duration-200">
        {CardContent}
      </Link>
    )
  }

  return CardContent
} 