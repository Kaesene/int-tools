'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { FiPackage, FiCheck, FiCopy } from 'react-icons/fi'

interface TrackingCodeInputProps {
  orderId: number
  currentTrackingCode?: string | null
}

export function TrackingCodeInput({ orderId, currentTrackingCode }: TrackingCodeInputProps) {
  const router = useRouter()
  const [trackingCode, setTrackingCode] = useState(currentTrackingCode || '')
  const [isEditing, setIsEditing] = useState(!currentTrackingCode)
  const [isSaving, setIsSaving] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleSave = async () => {
    if (!trackingCode.trim()) return

    setIsSaving(true)

    try {
      const response = await fetch(`/api/admin/orders/${orderId}/tracking`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trackingCode: trackingCode.trim() }),
      })

      if (!response.ok) {
        throw new Error('Erro ao salvar codigo de rastreio')
      }

      setIsEditing(false)
      router.refresh()
    } catch (error) {
      alert('Erro ao salvar codigo de rastreio')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(trackingCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!isEditing && trackingCode) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-1">Codigo de Rastreio</p>
          <div className="flex items-center gap-2">
            <code className="px-3 py-2 bg-gray-100 rounded font-mono text-sm">
              {trackingCode}
            </code>
            <button
              onClick={handleCopy}
              className="p-2 hover:bg-gray-100 rounded transition-colors"
              title="Copiar codigo"
            >
              {copied ? (
                <FiCheck className="text-green-600" size={18} />
              ) : (
                <FiCopy className="text-gray-600" size={18} />
              )}
            </button>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsEditing(true)}
        >
          Editar
        </Button>
      </div>
    )
  }

  return (
    <div>
      <label className="block text-sm text-gray-600 mb-2">
        <FiPackage className="inline mr-1" size={16} />
        Codigo de Rastreio
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          value={trackingCode}
          onChange={(e) => setTrackingCode(e.target.value.toUpperCase())}
          placeholder="Ex: AA123456789BR"
          className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          disabled={isSaving}
        />
        <Button
          onClick={handleSave}
          disabled={!trackingCode.trim() || isSaving}
          isLoading={isSaving}
        >
          Salvar
        </Button>
        {currentTrackingCode && (
          <Button
            variant="outline"
            onClick={() => {
              setTrackingCode(currentTrackingCode)
              setIsEditing(false)
            }}
            disabled={isSaving}
          >
            Cancelar
          </Button>
        )}
      </div>
      <p className="text-xs text-gray-500 mt-1">
        Digite o codigo de rastreio dos Correios ou transportadora
      </p>
    </div>
  )
}
