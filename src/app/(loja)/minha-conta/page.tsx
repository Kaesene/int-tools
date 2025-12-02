'use client'

import { useState, FormEvent, useEffect } from 'react'
import { useClientAuth } from '@/contexts/ClientAuthContext'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { FiUser, FiMail, FiPhone, FiCheck } from 'react-icons/fi'

export default function MinhaContaPage() {
  const { user, updateProfile } = useClientAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    cpf: '',
  })

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState(false)

  useEffect(() => {
    if (user) {
      loadUserData()
    }
  }, [user])

  const loadUserData = async () => {
    if (!user) return

    try {
      const response = await fetch(`/api/users/${user.id}`)
      if (response.ok) {
        const data = await response.json()
        setFormData({
          name: data.name || '',
          phone: data.phone || '',
          cpf: data.cpf || '',
        })
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError('')
    setSuccess(false)

    const { error: updateError } = await updateProfile(formData)

    if (updateError) {
      setError('Erro ao atualizar perfil')
      setIsSaving(false)
      return
    }

    setSuccess(true)
    setIsEditing(false)
    setIsSaving(false)
    loadUserData()

    setTimeout(() => setSuccess(false), 3000)
  }

  const handlePasswordChange = async (e: FormEvent) => {
    e.preventDefault()
    setPasswordError('')
    setPasswordSuccess(false)

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('As senhas não coincidem')
      return
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError('A nova senha deve ter no mínimo 6 caracteres')
      return
    }

    try {
      const response = await fetch('/api/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      })

      if (!response.ok) {
        throw new Error('Senha atual incorreta')
      }

      setPasswordSuccess(true)
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setTimeout(() => {
        setPasswordSuccess(false)
        setShowPasswordForm(false)
      }, 2000)
    } catch (error) {
      setPasswordError('Senha atual incorreta')
    }
  }

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-2">
          <FiCheck className="text-green-600" size={20} />
          <p className="text-green-800 text-sm font-medium">Perfil atualizado com sucesso!</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {/* Profile Form */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Dados Pessoais</h2>
          {!isEditing && (
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              Editar
            </Button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nome Completo"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            disabled={!isEditing}
            required
            icon={<FiUser size={18} />}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <div className="relative">
              <FiMail className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">O email não pode ser alterado</p>
          </div>

          <Input
            label="Telefone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            disabled={!isEditing}
            placeholder="(11) 99999-9999"
            icon={<FiPhone size={18} />}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">CPF</label>
            <input
              type="text"
              value={formData.cpf}
              onChange={(e) => {
                // Formatar CPF: 000.000.000-00
                let value = e.target.value.replace(/\D/g, '')
                if (value.length <= 11) {
                  value = value.replace(/(\d{3})(\d)/, '$1.$2')
                  value = value.replace(/(\d{3})(\d)/, '$1.$2')
                  value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2')
                  setFormData({ ...formData, cpf: value })
                }
              }}
              disabled={!isEditing}
              placeholder="000.000.000-00"
              maxLength={14}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-gray-500 text-gray-900 bg-white"
            />
          </div>

          {isEditing && (
            <div className="flex gap-4 pt-4">
              <Button type="submit" isLoading={isSaving}>
                Salvar Alterações
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditing(false)
                  loadUserData()
                }}
              >
                Cancelar
              </Button>
            </div>
          )}
        </form>
      </div>

      {/* Password Change */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Alterar Senha</h2>
            <p className="text-sm text-gray-600 mt-1">Mantenha sua conta segura</p>
          </div>
          {!showPasswordForm && (
            <Button variant="outline" onClick={() => setShowPasswordForm(true)}>
              Alterar Senha
            </Button>
          )}
        </div>

        {showPasswordForm && (
          <form onSubmit={handlePasswordChange} className="space-y-4">
            {passwordSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-2">
                <FiCheck className="text-green-600" size={20} />
                <p className="text-green-800 text-sm font-medium">Senha alterada com sucesso!</p>
              </div>
            )}

            {passwordError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 text-sm">{passwordError}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha Atual *
              </label>
              <input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                }
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-gray-900 bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nova Senha *
              </label>
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                }
                required
                minLength={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-gray-900 bg-white"
              />
              <p className="text-xs text-gray-500 mt-1">Mínimo de 6 caracteres</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirmar Nova Senha *
              </label>
              <input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                }
                required
                minLength={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-gray-900 bg-white"
              />
            </div>

            <div className="flex gap-4 pt-4 border-t">
              <Button type="submit">Alterar Senha</Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowPasswordForm(false)
                  setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
                  setPasswordError('')
                }}
              >
                Cancelar
              </Button>
            </div>
          </form>
        )}
      </div>

      {/* Account Info */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Informações da Conta</h2>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Status da conta:</span>
            <span className="font-medium text-green-600">Ativa</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Data de cadastro:</span>
            <span className="font-medium text-gray-900">
              {user?.created_at ? new Date(user.created_at).toLocaleDateString('pt-BR') : '-'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
