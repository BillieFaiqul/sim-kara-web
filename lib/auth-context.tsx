'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authAPI } from './api'

interface MenuItem {
  label: string
  href: string
  icon: string
  submenu?: MenuItem[]
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

const getMenuByRole = (role: string): MenuItem[] => {
  const baseMenu: MenuItem[] = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: 'Home',
    },
    {
      label: 'Semua Karya',
      href: '/semua-karya',
      icon: 'FileText',
    },
  ]

  const adminMenu: MenuItem[] = [
    ...baseMenu,
    {
      label: 'Validasi',
      href: '/validasi',
      icon: 'CheckSquare',
      submenu: [
        {
          label: 'Validasi Pending',
          href: '/validasi/pending',
          icon: 'Clock',
        },
        {
          label: 'Riwayat Validasi',
          href: '/validasi/riwayat',
          icon: 'History',
        },
      ],
    },
    {
      label: 'Kelola User',
      href: '/kelola-user',
      icon: 'Users',
    },
  ]

  const userMenu: MenuItem[] = [
    ...baseMenu,
    {
      label: 'Karya Saya',
      href: '/karya-saya',
      icon: 'BookOpen',
    },
  ]

  return role === 'admin' ? adminMenu : userMenu
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkAuth()
    // Check untuk pesan auth (e.g., token expired)
    const authMessage = typeof window !== 'undefined' ? localStorage.getItem('auth_message') : null
    if (authMessage) {
      console.log('Auth Message:', authMessage)
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_message')
      }
    }
  }, [])

  const checkAuth = async () => {
    const token = authAPI.getToken()
    if (token) {
      try {
        const response = await authAPI.getCurrentUser()
        setUser(response.user)
        // Generate menu berdasarkan role user
        setMenuItems(getMenuByRole(response.user.role))
      } catch (error) {
        authAPI.clearToken()
        setUser(null)
        setMenuItems([])
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
      // Gunakan menu dari response atau generate berdasarkan role
      setMenuItems(response.menu_items || getMenuByRole(response.user.role))
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
