'use client'

import { useState, FormEvent, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useClientAuth } from '@/contexts/ClientAuthContext'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { FiMail, FiLock, FiUser } from 'react-icons/fi'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { signIn, signUp } = useClientAuth()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  })

  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  // Ler parâmetro da URL para definir modo inicial
  useEffect(() => {
    const modeParam = searchParams.get('mode')
    if (modeParam === 'register') {
      setMode('register')
    }
  }, [searchParams])

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    const { error: loginError } = await signIn(loginData.email, loginData.password)

    if (loginError) {
      setError(loginError.message === 'Invalid login credentials'
        ? 'Email ou senha incorretos'
        : 'Erro ao fazer login')
      setIsLoading(false)
      return
    }

    router.push('/minha-conta')
  }

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Validações
    if (registerData.password !== registerData.confirmPassword) {
      setError('As senhas não coincidem')
      setIsLoading(false)
      return
    }

    if (registerData.password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres')
      setIsLoading(false)
      return
    }

    const { error: registerError } = await signUp(
      registerData.email,
      registerData.password,
      registerData.name
    )

    if (registerError) {
      if (registerError.message.includes('already registered')) {
        setError('Este email já está cadastrado')
      } else if (registerError.message.includes('confirme seu email')) {
        setError(registerError.message)
      } else {
        setError('Erro ao criar conta: ' + registerError.message)
      }
      setIsLoading(false)
      return
    }

    // Sucesso - tentar fazer login automático
    const { error: loginError } = await signIn(registerData.email, registerData.password)

    if (loginError) {
      // Se não conseguiu fazer login automático, mostrar mensagem
      setError('Conta criada! Faça login para continuar.')
      setMode('login')
      setIsLoading(false)
      return
    }

    router.push('/minha-conta')
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {mode === 'login' ? 'Entrar' : 'Criar Conta'}
          </h1>
          <p className="text-gray-600">
            {mode === 'login'
              ? 'Faça login para continuar suas compras'
              : 'Cadastre-se para acompanhar seus pedidos'}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => {
              setMode('login')
              setError('')
            }}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
              mode === 'login'
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => {
              setMode('register')
              setError('')
            }}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
              mode === 'register'
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Cadastrar
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {/* Login Form */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <Input
              label="Email"
              type="email"
              value={loginData.email}
              onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
              required
              placeholder="seu@email.com"
              icon={<FiMail size={18} />}
            />

            <Input
              label="Senha"
              type="password"
              value={loginData.password}
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              required
              placeholder="••••••••"
              icon={<FiLock size={18} />}
            />

            <Button type="submit" isLoading={isLoading} className="w-full">
              Entrar
            </Button>

            <p className="text-sm text-center text-gray-600">
              Esqueceu sua senha?{' '}
              <Link href="/recuperar-senha" className="text-primary-500 hover:underline">
                Recuperar
              </Link>
            </p>
          </form>
        )}

        {/* Register Form */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <Input
              label="Nome Completo"
              type="text"
              value={registerData.name}
              onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
              required
              placeholder="João da Silva"
              icon={<FiUser size={18} />}
            />

            <Input
              label="Email"
              type="email"
              value={registerData.email}
              onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
              required
              placeholder="seu@email.com"
              icon={<FiMail size={18} />}
            />

            <Input
              label="Senha"
              type="password"
              value={registerData.password}
              onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
              required
              placeholder="Mínimo 6 caracteres"
              icon={<FiLock size={18} />}
            />

            <Input
              label="Confirmar Senha"
              type="password"
              value={registerData.confirmPassword}
              onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
              required
              placeholder="Digite a senha novamente"
              icon={<FiLock size={18} />}
            />

            <Button type="submit" isLoading={isLoading} className="w-full">
              Criar Conta
            </Button>

            <p className="text-xs text-center text-gray-500">
              Ao criar uma conta, você concorda com nossos{' '}
              <Link href="/termos" className="text-primary-500 hover:underline">
                Termos de Uso
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
