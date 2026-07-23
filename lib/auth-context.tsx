'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authAPI } from './api'

interface MenuItem {
  label: string
  href: string
  icon: string
}

interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'mahasiswa' | 'dosen'
}

interface AuthContextType {
  user: User | null
  menuItems: MenuItem[]
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const token = authAPI.getToken()
    if (token) {
      try {
        const response = await authAPI.getCurrentUser()
        setUser(response.user)
      } catch (error) {
        authAPI.clearToken()
        setUser(null)
      }
    }
    setIsLoading(false)
  }

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const response = await authAPI.login({ email, password })
      authAPI.saveToken(response.token)
      setUser(response.user)
      setMenuItems(response.menu_items || [])
    } catch (error) {
      setIsLoading(false)
      throw error
    }
    setIsLoading(false)
  }

  const logout = async () => {
    setIsLoading(true)
    try {
      await authAPI.logout()
    } finally {
      authAPI.clearToken()
      setUser(null)
      setMenuItems([])
      setIsLoading(false)
    }
  }

  const refreshUser = async () => {
    try {
      const response = await authAPI.getCurrentUser()
      setUser(response.user)
    } catch (error) {
      authAPI.clearToken()
      setUser(null)
    }
  }

  const value: AuthContextType = {
    user,
    menuItems,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    refreshUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
