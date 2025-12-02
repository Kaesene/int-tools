'use client'

import { useState, useEffect } from 'react'
import { useClientAuth } from '@/contexts/ClientAuthContext'
import { Button } from '@/components/ui/Button'
import { AddressForm } from '@/components/client/AddressForm'
import { FiPlus, FiEdit, FiTrash2, FiMapPin, FiCheck } from 'react-icons/fi'

interface Address {
  id: number
  name: string
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  zipCode: string
  isDefault: boolean
}

export default function EnderecosPage() {
  const { user } = useClientAuth()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)

  useEffect(() => {
    loadAddresses()
  }, [user])

  const loadAddresses = async () => {
    if (!user) return

    try {
      const response = await fetch(`/api/addresses?userId=${user.id}`)
      if (response.ok) {
        const data = await response.json()
        setAddresses(data)
      }
    } catch (error) {
      console.error('Erro ao carregar endereços:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Deseja realmente excluir este endereço?')) return

    try {
      const response = await fetch(`/api/addresses/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        loadAddresses()
      }
    } catch (error) {
      console.error('Erro ao deletar endereço:', error)
    }
  }

  const handleSetDefault = async (id: number) => {
    try {
      const response = await fetch(`/api/addresses/${id}/set-default`, {
        method: 'PATCH',
      })

      if (response.ok) {
        loadAddresses()
      }
    } catch (error) {
      console.error('Erro ao definir endereço padrão:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
        <p className="text-gray-600 mt-4">Carregando endereços...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-xl font-bold text-gray-900">Meus Endereços</h2>
          <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
            <FiPlus size={18} />
            Adicionar Endereço
          </Button>
        </div>
        <p className="text-sm text-gray-600">Gerencie seus endereços de entrega</p>
      </div>

      {addresses.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <FiMapPin size={64} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Nenhum endereço cadastrado</h3>
          <p className="text-gray-600 mb-6">
            Adicione um endereço para facilitar suas compras
          </p>
          <Button onClick={() => setShowForm(true)} className="inline-flex items-center gap-2">
            <FiPlus size={18} />
            Adicionar Primeiro Endereço
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <div
              key={address.id}
              className={`bg-white rounded-lg border-2 p-6 relative ${
                address.isDefault ? 'border-primary-500' : 'border-gray-200'
              }`}
            >
              {address.isDefault && (
                <div className="absolute top-4 right-4">
                  <span className="bg-primary-500 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                    <FiCheck size={12} />
                    Padrão
                  </span>
                </div>
              )}

              <h3 className="font-semibold text-gray-900 mb-3">{address.name}</h3>

              <div className="text-sm text-gray-600 space-y-1 mb-4">
                <p>{address.street}, {address.number}</p>
                {address.complement && <p>{address.complement}</p>}
                <p>{address.neighborhood}</p>
                <p>{address.city} - {address.state}</p>
                <p>CEP: {address.zipCode}</p>
              </div>

              <div className="flex gap-2 pt-4 border-t">
                {!address.isDefault && (
                  <button
                    onClick={() => handleSetDefault(address.id)}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Tornar Padrão
                  </button>
                )}
                <button
                  onClick={() => {
                    setEditingAddress(address)
                    setShowForm(true)
                  }}
                  className="text-sm text-gray-600 hover:text-gray-700 font-medium flex items-center gap-1"
                >
                  <FiEdit size={14} />
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(address.id)}
                  className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                >
                  <FiTrash2 size={14} />
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && user && (
        <AddressForm
          userId={user.id}
          address={editingAddress}
          onClose={() => {
            setShowForm(false)
            setEditingAddress(null)
          }}
          onSuccess={loadAddresses}
        />
      )}
    </div>
  )
}
