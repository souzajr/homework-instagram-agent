'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { GenerationForm } from '@/components/GenerationForm'
import { ABTestDisplay } from '@/components/ABTestDisplay'
import { HistoryView } from '@/components/HistoryView'
import { AuthModal } from '@/components/AuthModal'
import { Header } from '@/components/Header'
import { GenerateContentResponse } from '@/types'

export default function Home() {
  const { user } = useAuth()
  const [currentGeneration, setCurrentGeneration] = useState<GenerateContentResponse | null>(null)
  const [showHistory, setShowHistory] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [refreshHistory, setRefreshHistory] = useState(0)

  const handleGenerationComplete = (generation: GenerateContentResponse) => {
    setCurrentGeneration(generation)
    setShowHistory(false)
  }

  const handleSelectionComplete = () => {
    setCurrentGeneration(null)
    setRefreshHistory(prev => prev + 1)
  }

  const handleHomeClick = () => {
    setShowHistory(false)
    setCurrentGeneration(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        user={user} 
        onAuthClick={() => setShowAuthModal(true)}
        onHistoryClick={() => setShowHistory(!showHistory)}
        onHomeClick={handleHomeClick}
        showHistory={showHistory}
      />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {!showHistory ? (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Instagram Agent
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Generate AI-powered Instagram content with A/B testing
              </p>
            </div>

            {!currentGeneration ? (
              <GenerationForm onGenerationComplete={handleGenerationComplete} />
            ) : (
              <ABTestDisplay 
                generation={currentGeneration}
                onSelectionComplete={handleSelectionComplete}
              />
            )}
          </div>
        ) : (
          <HistoryView key={refreshHistory} onAuthClick={() => setShowAuthModal(true)} />
        )}
      </main>

      {showAuthModal && (
        <AuthModal 
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      )}
    </div>
  )
}