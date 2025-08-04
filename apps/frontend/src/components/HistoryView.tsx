'use client'

import { useState, useEffect } from 'react'
import { GetHistoryResponse, Generation, SelectedOption, ContentType, ApiError } from '@/types'
import { apiClient } from '@/lib/api-client'
import { useAuth } from '@/lib/auth-context'
import { History, MessageSquare, Hash, Calendar, CheckCircle, LogIn } from 'lucide-react'

interface HistoryViewProps {
  onAuthClick: () => void
}

export function HistoryView({ onAuthClick }: HistoryViewProps) {
  const { user } = useAuth()
  const [history, setHistory] = useState<Generation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        const response = await apiClient.get<GetHistoryResponse>('/api/history')
        setHistory(response.data.generations)
      } catch (error: unknown) {
        const apiError = error as ApiError;
        setError(apiError.response?.data?.message || 'Failed to load history')
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [user])

  const GenerationCard = ({ generation }: { generation: Generation }) => {
    const selectedContent = generation.selectedOption === SelectedOption.A 
      ? generation.optionA 
      : generation.selectedOption === SelectedOption.B 
        ? generation.optionB 
        : null

    return (
      <div className="card">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                generation.type === ContentType.POST 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-purple-100 text-purple-800'
              }`}>
                {generation.type}
              </span>
              <span className="text-sm text-gray-500">
                <Calendar className="w-3 h-3 inline mr-1" />
                {new Date(generation.createdAt).toLocaleDateString()}
              </span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">{generation.prompt}</h3>
          </div>
          
          {generation.selectedOption && (
            <div className="flex items-center gap-1 text-green-600">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Option {generation.selectedOption}</span>
            </div>
          )}
        </div>

        {selectedContent ? (
          <div className="space-y-3">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Selected Caption</span>
              </div>
              <p className="text-gray-900 bg-gray-50 p-3 rounded-lg text-sm">
                {selectedContent.caption}
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Hash className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Hashtags</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {selectedContent.hashtags.map((hashtag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    #{hashtag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-500 text-sm">No option selected yet</p>
          </div>
        )}
      </div>
    )
  }

  // Show login prompt if user is not authenticated
  if (!user) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <History className="w-6 h-6 text-primary-600" />
          <h2 className="text-2xl font-bold text-gray-900">Content History</h2>
        </div>

        <div className="text-center py-12">
          <div className="bg-white rounded-xl p-8 border border-gray-200 max-w-md mx-auto">
            <History className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Sign in to view your history</h3>
            <p className="text-gray-600 mb-6">
              Create an account or sign in to track your generated content and see your A/B testing results.
            </p>
            
            <div className="space-y-3">
              <button
                onClick={onAuthClick}
                className="w-full btn-primary flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                Sign In / Create Account
              </button>
              
              <p className="text-sm text-gray-500">
                Your content history is private and only visible to you.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <History className="w-6 h-6 text-primary-600" />
          <h2 className="text-2xl font-bold text-gray-900">Content History</h2>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <History className="w-6 h-6 text-primary-600" />
          <h2 className="text-2xl font-bold text-gray-900">Content History</h2>
        </div>
        <div className="text-center py-12">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <History className="w-6 h-6 text-primary-600" />
        <h2 className="text-2xl font-bold text-gray-900">My Content History</h2>
        <span className="text-sm text-gray-500">({user.email})</span>
      </div>

      {history.length === 0 ? (
        <div className="text-center py-12">
          <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No content yet</h3>
          <p className="text-gray-500">Start generating content to see your history here.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {history.map((generation) => (
            <GenerationCard key={generation.id} generation={generation} />
          ))}
        </div>
      )}
    </div>
  )
}