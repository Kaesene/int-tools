'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'

interface ClientAuthContextType {
  user: User | null
  isLoading: boolean
  signUp: (email: string, password: string, name: string) => Promise<{ error: Error | null }>
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
  updateProfile: (data: { name?: string; phone?: string; cpf?: string }) => Promise<{ error: Error | null }>
}

const ClientAuthContext = createContext<ClientAuthContextType | undefined>(undefined)

export function ClientAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Verificar sessão inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setIsLoading(false)
    })

    // Escutar mudanças de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
          emailRedirectTo: undefined,
        },
      })

      if (error) throw error

      // Verificar se o usuário precisa confirmar email
      if (data.user && !data.session) {
        return {
          error: new Error('Por favor, confirme seu email antes de fazer login. Verifique sua caixa de entrada.')
        }
      }

      // Criar registro na tabela users
      if (data.user) {
        const now = new Date().toISOString()
        const { error: userError } = await supabase.from('users').insert({
          id: data.user.id,
          email,
          name,
          created_at: now,
          updated_at: now,
          is_admin: false,
        })

        if (userError) {
          console.error('Erro ao criar user:', userError)
          // Se já existe, não é erro crítico
          if (userError.code !== '23505') {
            throw userError
          }
        }
      }

      return { error: null }
    } catch (error: any) {
      return { error }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
      return { error: null }
    } catch (error: any) {
      return { error }
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  const updateProfile = async (data: { name?: string; phone?: string; cpf?: string }) => {
    try {
      if (!user) throw new Error('Usuário não autenticado')

      // Atualizar metadata do Supabase Auth
      const { error: authError } = await supabase.auth.updateUser({
        data: { name: data.name },
      })

      if (authError) throw authError

      // Atualizar tabela users
      const { error: userError } = await supabase
        .from('users')
        .update({
          name: data.name,
          phone: data.phone,
          cpf: data.cpf,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

      if (userError) throw userError

      return { error: null }
    } catch (error: any) {
      return { error }
    }
  }

  return (
    <ClientAuthContext.Provider
      value={{
        user,
        isLoading,
        signUp,
        signIn,
        signOut,
        updateProfile,
      }}
    >
      {children}
    </ClientAuthContext.Provider>
  )
}

export function useClientAuth() {
  const context = useContext(ClientAuthContext)
  if (context === undefined) {
    throw new Error('useClientAuth must be used within a ClientAuthProvider')
  }
  return context
}
