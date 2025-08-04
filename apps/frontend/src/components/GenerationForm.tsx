'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-hot-toast'
import { ContentType, GenerateContentResponse } from '@/types'
import { apiClient } from '@/lib/api-client'
import { generationSchema, GenerationFormData } from '@/lib/validations'
import { Sparkles, Loader2 } from 'lucide-react'

interface GenerationFormProps {
  onGenerationComplete: (generation: GenerateContentResponse) => void
}

export function GenerationForm({ onGenerationComplete }: GenerationFormProps) {
  const [loading, setLoading] = useState(false)
  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    reset 
  } = useForm<GenerationFormData>({
    resolver: zodResolver(generationSchema),
    defaultValues: {
      prompt: '',
      type: undefined,
    }
  })

  const onSubmit = async (data: GenerationFormData) => {
    setLoading(true)
    try {
      console.log('Generating content with data:', data)
      const response = await apiClient.post<GenerateContentResponse>('/api/generate', data)
      console.log('Generation response:', response.data)
      onGenerationComplete(response.data)
      reset()
      toast.success('Content generated successfully!')
    } catch (error: any) {
      console.error('Generation error:', error)
      toast.error(error.response?.data?.message || 'Failed to generate content')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Sparkles className="w-6 h-6 text-primary-600" />
        <h2 className="text-2xl font-bold text-gray-900">Generate Content</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
            Content Prompt
          </label>
          <textarea
            id="prompt"
            rows={3}
            placeholder="e.g., Post about summer skincare tips"
            className="input-field resize-none"
            {...register('prompt', {
              required: 'Prompt is required',
              maxLength: { value: 200, message: 'Prompt must be less than 200 characters' }
            })}
          />
          {errors.prompt && (
            <p className="mt-1 text-sm text-red-600">{errors.prompt.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Content Type
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                value={ContentType.POST}
                className="text-primary-600 focus:ring-primary-500"
                {...register('type', { required: 'Content type is required' })}
              />
              <div>
                <div className="font-medium text-gray-900">Post</div>
                <div className="text-sm text-gray-500">Regular Instagram post</div>
              </div>
            </label>
            
            <label className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                value={ContentType.STORY}
                className="text-primary-600 focus:ring-primary-500"
                {...register('type', { required: 'Content type is required' })}
              />
              <div>
                <div className="font-medium text-gray-900">Story</div>
                <div className="text-sm text-gray-500">Instagram story</div>
              </div>
            </label>
          </div>
          {errors.type && (
            <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Generate Content
            </>
          )}
        </button>
      </form>
    </div>
  )
}