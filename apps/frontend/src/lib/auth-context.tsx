'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User, LoginResponse } from '@/types'
import { apiClient } from './api-client'
import Cookies from 'js-cookie'

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string) => Promise<void>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = Cookies.get('auth_token')
    if (token) {
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`
      // You could validate the token here by making a request to a protected endpoint
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.post<LoginResponse>('/auth/login', {
        email,
        password,
      })
      
      const { access_token, user: userData } = response.data
      
      Cookies.set('auth_token', access_token, { expires: 7 })
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
      setUser(userData)
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  const register = async (email: string, password: string) => {
    try {
      const response = await apiClient.post<LoginResponse>('/auth/register', {
        email,
        password,
      })
      
      const { access_token, user: userData } = response.data
      
      Cookies.set('auth_token', access_token, { expires: 7 })
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
      setUser(userData)
    } catch (error) {
      console.error('Register error:', error)
      throw error
    }
  }

  const logout = () => {
    Cookies.remove('auth_token')
    delete apiClient.defaults.headers.common['Authorization']
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}