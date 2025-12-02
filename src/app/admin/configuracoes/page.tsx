'use client'

import { useState } from 'react'
import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { FiSave, FiLock, FiUser, FiMail } from 'react-icons/fi'

export default function AdminConfigPage() {
  const { adminUser } = useAdminAuth()
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState('')

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage('As senhas não coincidem')
      return
    }

    if (passwordData.newPassword.length < 6) {
      setMessage('A senha deve ter no mínimo 6 caracteres')
      return
    }

    setIsSaving(true)
    setMessage('')

    // Simulação - em produção, chamar API real
    setTimeout(() => {
      setMessage('Senha atualizada com sucesso!')
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
      setIsSaving(false)
    }, 1000)
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
        <p className="text-gray-600 mt-2">Gerencie as configurações do painel administrativo</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Admin Info */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FiUser size={20} />
            Informações do Administrador
          </h2>

          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Nome</p>
              <p className="font-medium text-gray-900">{adminUser?.name}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Email</p>
              <p className="font-medium text-gray-900">{adminUser?.email}</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Nota:</strong> Para alterar suas informações pessoais, entre em contato com o desenvolvedor.
              </p>
            </div>
          </div>
        </div>

        {/* Change Password */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FiLock size={20} />
            Alterar Senha
          </h2>

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <Input
              label="Senha Atual"
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              required
              placeholder="Digite sua senha atual"
            />

            <Input
              label="Nova Senha"
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              required
              placeholder="Digite a nova senha"
            />

            <Input
              label="Confirmar Nova Senha"
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              required
              placeholder="Digite a nova senha novamente"
            />

            {message && (
              <div className={`rounded-lg p-3 ${
                message.includes('sucesso')
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                <p className="text-sm">{message}</p>
              </div>
            )}

            <Button
              type="submit"
              isLoading={isSaving}
              className="w-full flex items-center justify-center gap-2"
            >
              <FiSave size={18} />
              {isSaving ? 'Salvando...' : 'Salvar Nova Senha'}
            </Button>
          </form>
        </div>

        {/* Store Settings */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Configurações da Loja</h2>

          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Nome da Loja</p>
              <p className="font-medium text-gray-900">INT TOOLS</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Domínio</p>
              <p className="font-medium text-gray-900">localhost:3000</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Email de Contato</p>
              <p className="font-medium text-gray-900">contato@inttools.com</p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>Em Desenvolvimento:</strong> Configurações avançadas da loja estarão disponíveis em breve.
              </p>
            </div>
          </div>
        </div>

        {/* System Info */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Informações do Sistema</h2>

          <div className="space-y-3">
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-gray-600">Versão</span>
              <span className="font-medium text-gray-900">1.0.0</span>
            </div>

            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-gray-600">Framework</span>
              <span className="font-medium text-gray-900">Next.js 14</span>
            </div>

            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-gray-600">Banco de Dados</span>
              <span className="font-medium text-gray-900">PostgreSQL (Supabase)</span>
            </div>

            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-gray-600">Storage</span>
              <span className="font-medium text-gray-900">Supabase Storage</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">Status</span>
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Online
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-6 bg-gradient-to-r from-primary-500 to-primary-700 rounded-lg shadow-lg p-6 text-white">
        <h2 className="text-xl font-bold mb-4">Painel Administrativo INT TOOLS</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
            <p className="text-primary-100 text-sm mb-1">Produtos</p>
            <p className="text-2xl font-bold">Gerenciar</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
            <p className="text-primary-100 text-sm mb-1">Pedidos</p>
            <p className="text-2xl font-bold">Processar</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
            <p className="text-primary-100 text-sm mb-1">Categorias</p>
            <p className="text-2xl font-bold">Organizar</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
            <p className="text-primary-100 text-sm mb-1">Clientes</p>
            <p className="text-2xl font-bold">Acompanhar</p>
          </div>
        </div>
      </div>
    </div>
  )
}
