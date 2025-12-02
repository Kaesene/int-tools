'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

interface AdminAuthContextData {
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  adminUser: { email: string; name: string } | null
}

const AdminAuthContext = createContext<AdminAuthContextData>({} as AdminAuthContextData)

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [adminUser, setAdminUser] = useState<{ email: string; name: string } | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Check if admin is logged in
    const adminData = localStorage.getItem('admin_auth')
    if (adminData) {
      try {
        const parsed = JSON.parse(adminData)
        setAdminUser(parsed)
        setIsAuthenticated(true)
      } catch (error) {
        localStorage.removeItem('admin_auth')
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // TODO: Implementar autenticação real com Supabase
    // Por enquanto, login simples para desenvolvimento
    if (email === 'admin@inttools.com' && password === 'admin123') {
      const userData = {
        email,
        name: 'Administrador',
      }
      localStorage.setItem('admin_auth', JSON.stringify(userData))
      setAdminUser(userData)
      setIsAuthenticated(true)
      return true
    }
    return false
  }

  const logout = () => {
    localStorage.removeItem('admin_auth')
    setAdminUser(null)
    setIsAuthenticated(false)
    router.push('/admin/login')
  }

  return (
    <AdminAuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        login,
        logout,
        adminUser,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider')
  }
  return context
}
