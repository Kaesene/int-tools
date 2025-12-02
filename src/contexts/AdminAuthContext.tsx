'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

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
    const checkAuth = async () => {
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
    }
    checkAuth()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // 1. Fazer login no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError || !authData.user) {
        console.error('Erro de autenticação:', authError?.message)
        return false
      }

      // 2. Verificar se o usuário é admin
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single()

      if (userError || !userData) {
        console.error('Erro ao buscar usuário:', userError?.message)
        await supabase.auth.signOut()
        return false
      }

      // 3. Verificar se is_admin = true
      if (!userData.is_admin) {
        console.error('Usuário não é admin')
        await supabase.auth.signOut()
        return false
      }

      // 4. Autenticado como admin!
      const adminUserData = {
        email: userData.email,
        name: userData.name || 'Admin',
      }

      localStorage.setItem('admin_auth', JSON.stringify(adminUserData))
      setAdminUser(adminUserData)
      setIsAuthenticated(true)
      return true
    } catch (error) {
      console.error('Erro no login:', error)
      return false
    }
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
