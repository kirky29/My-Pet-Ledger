'use client'

import { useState, useEffect } from 'react'
import { X, ChevronDown, ChevronUp } from 'lucide-react'

interface DebugLog {
  id: string
  timestamp: string
  type: 'info' | 'error' | 'warning' | 'success'
  message: string
  data?: any
}

let logs: DebugLog[] = []
let listeners: ((logs: DebugLog[]) => void)[] = []

export const debugLog = {
  info: (message: string, data?: any) => addLog('info', message, data),
  error: (message: string, data?: any) => addLog('error', message, data),
  warning: (message: string, data?: any) => addLog('warning', message, data),
  success: (message: string, data?: any) => addLog('success', message, data),
}

function addLog(type: DebugLog['type'], message: string, data?: any) {
  const log: DebugLog = {
    id: Date.now().toString(),
    timestamp: new Date().toLocaleTimeString(),
    type,
    message,
    data
  }
  
  logs.unshift(log) // Add to beginning
  if (logs.length > 50) logs.pop() // Keep only last 50 logs
  
  // Notify all listeners
  listeners.forEach(listener => listener([...logs]))
  
  // Also log to console
  console.log(`[${type.toUpperCase()}] ${message}`, data || '')
}

export default function DebugLogger() {
  const [debugLogs, setDebugLogs] = useState<DebugLog[]>([])
  const [isVisible, setIsVisible] = useState(true)
  const [isExpanded, setIsExpanded] = useState(true)

  useEffect(() => {
    // Register this component as a listener
    const updateLogs = (newLogs: DebugLog[]) => setDebugLogs(newLogs)
    listeners.push(updateLogs)
    
    // Set initial logs
    setDebugLogs([...logs])
    
    // Cleanup
    return () => {
      listeners = listeners.filter(l => l !== updateLogs)
    }
  }, [])

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white px-3 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition-colors z-50"
      >
        Show Debug Log
      </button>
    )
  }

  const getLogColor = (type: DebugLog['type']) => {
    switch (type) {
      case 'error': return 'text-red-600 bg-red-50'
      case 'warning': return 'text-yellow-600 bg-yellow-50'
      case 'success': return 'text-green-600 bg-green-50'
      default: return 'text-blue-600 bg-blue-50'
    }
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 max-h-96 bg-white border border-gray-300 rounded-lg shadow-xl z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
        <h3 className="font-semibold text-gray-800">Debug Log</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-gray-500 hover:text-gray-700"
          >
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </button>
          <button
            onClick={() => setDebugLogs([])}
            className="px-2 py-1 text-xs bg-gray-200 text-gray-600 rounded hover:bg-gray-300"
          >
            Clear
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="p-1 text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Logs */}
      {isExpanded && (
        <div className="max-h-80 overflow-y-auto p-2">
          {debugLogs.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-4">No logs yet...</p>
          ) : (
            <div className="space-y-2">
              {debugLogs.map((log) => (
                <div
                  key={log.id}
                  className={`p-2 rounded text-xs ${getLogColor(log.type)}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium uppercase">{log.type}</span>
                    <span className="text-gray-500">{log.timestamp}</span>
                  </div>
                  <div className="text-gray-800">{log.message}</div>
                  {log.data && (
                    <pre className="mt-1 text-xs bg-white bg-opacity-50 p-1 rounded overflow-x-auto">
                      {typeof log.data === 'string' ? log.data : JSON.stringify(log.data, null, 2)}
                    </pre>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
} 