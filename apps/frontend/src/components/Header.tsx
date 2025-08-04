'use client'

import { User } from '@/types'
import { useAuth } from '@/lib/auth-context'
import { History, LogIn, LogOut, Sparkles } from 'lucide-react'

interface HeaderProps {
  user: User | null
  onAuthClick: () => void
  onHistoryClick: () => void
  onHomeClick: () => void
  showHistory: boolean
}

export function Header({ user, onAuthClick, onHistoryClick, onHomeClick, showHistory }: HeaderProps) {
  const { logout } = useAuth()

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-4xl">
        <button 
          onClick={onHomeClick}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <div className="bg-primary-600 rounded-lg p-2">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">Instagram Agent</h1>
        </button>

        <div className="flex items-center gap-4">
          <button
            onClick={onHistoryClick}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              showHistory 
                ? 'bg-primary-100 text-primary-700' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <History className="w-4 h-4" />
            <span className="hidden sm:inline">History</span>
          </button>

          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 hidden sm:inline">
                {user.email}
              </span>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onAuthClick}
              className="flex items-center gap-2 btn-primary"
            >
              <LogIn className="w-4 h-4" />
              <span className="hidden sm:inline">Login</span>
            </button>
          )}
        </div>
      </div>
    </header>
  )
}