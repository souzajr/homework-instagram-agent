import { z } from 'zod'
import { ContentType } from '@/types'

// Auth schemas
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .max(100, 'Password must be less than 100 characters'),
})

export const registerSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .max(100, 'Password must be less than 100 characters'),
})

// Generation schema
export const generationSchema = z.object({
  prompt: z
    .string()
    .min(1, 'Prompt is required')
    .max(200, 'Prompt must be less than 200 characters')
    .trim(),
  type: z.nativeEnum(ContentType, {
    required_error: 'Content type is required',
    invalid_type_error: 'Content type must be either POST or STORY',
  }),
})

// Type exports for form data
export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
export type GenerationFormData = z.infer<typeof generationSchema>