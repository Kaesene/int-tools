'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { FiTruck, FiCreditCard, FiPrinter, FiDownload, FiCheckCircle } from 'react-icons/fi'

interface MelhorEnvioShippingProps {
  orderId: number
  melhorEnvioId?: string | null
  trackingCode?: string | null
  orderStatus: string
}

export function MelhorEnvioShipping({
  orderId,
  melhorEnvioId,
  trackingCode,
  orderStatus,
}: MelhorEnvioShippingProps) {
  const router = useRouter()
  const [isCreating, setIsCreating] = useState(false)
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [labelUrl, setLabelUrl] = useState<string | null>(null)

  // Passo 1: Criar envio no Melhor Envio
  const handleCreateShipment = async () => {
    setIsCreating(true)
    try {
      const response = await fetch('/api/admin/shipping/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar envio')
      }

      alert(`✅ Envio criado no Melhor Envio!\n\nID: ${data.melhorEnvioId}\n\nAgora va ao painel do Melhor Envio e pague o frete.`)
      router.refresh()
    } catch (error: any) {
      alert(`❌ ${error.message}`)
    } finally {
      setIsCreating(false)
    }
  }

  // Passo 2: Fazer checkout (pagar)
  const handleCheckout = async () => {
    if (!melhorEnvioId) {
      alert('Primeiro crie o envio!')
      return
    }

    const confirmed = confirm(
      '💳 Isso ira processar o pagamento do frete no Melhor Envio.\n\nCertifique-se de ter saldo suficiente.\n\nContinuar?'
    )

    if (!confirmed) return

    setIsCheckingOut(true)
    try {
      const response = await fetch('/api/admin/shipping/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao fazer checkout')
      }

      alert('✅ Checkout realizado com sucesso!\n\nAgora voce pode gerar a etiqueta.')
      router.refresh()
    } catch (error: any) {
      alert(`❌ ${error.message}`)
    } finally {
      setIsCheckingOut(false)
    }
  }

  // Passo 3: Gerar etiqueta e buscar codigo de rastreio
  const handleGenerateLabel = async () => {
    if (!melhorEnvioId) {
      alert('Primeiro crie o envio e pague!')
      return
    }

    const confirmed = confirm(
      '🏷️ Isso ira:\n\n1. Gerar a etiqueta no Melhor Envio\n2. Buscar o codigo de rastreio automaticamente\n3. Marcar o pedido como "Enviado"\n4. Enviar email ao cliente\n\nContinuar?'
    )

    if (!confirmed) return

    setIsGenerating(true)
    try {
      const response = await fetch('/api/admin/shipping/labels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao gerar etiqueta')
      }

      setLabelUrl(data.labelUrl)
      alert(
        `✅ Etiqueta gerada com sucesso!\n\nCodigo de rastreio: ${data.trackingCode}\n\nEmail enviado ao cliente.\n\nClique em "Baixar PDF" para baixar a etiqueta.`
      )
      router.refresh()
    } catch (error: any) {
      alert(`❌ ${error.message}`)
    } finally {
      setIsGenerating(false)
    }
  }

  // Passo 4: Baixar PDF da etiqueta
  const handleDownloadLabel = () => {
    if (!labelUrl && !trackingCode) {
      alert('Primeiro gere a etiqueta!')
      return
    }

    if (labelUrl) {
      window.open(labelUrl, '_blank')
    } else {
      alert('URL da etiqueta nao encontrada. Acesse o painel do Melhor Envio.')
    }
  }

  // So mostrar para pedidos pagos ou enviados
  if (orderStatus !== 'paid' && orderStatus !== 'shipped') {
    return null
  }

  return (
    <div className="border-t border-gray-200 pt-6">
      <div className="flex items-center gap-2 mb-4">
        <FiTruck className="text-primary-600" size={20} />
        <h3 className="text-lg font-semibold text-gray-900">Melhor Envio</h3>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <p className="text-sm text-blue-800 font-medium mb-2">
          ℹ️ Processo de envio automatizado:
        </p>
        <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
          <li>Criar envio no Melhor Envio</li>
          <li>Pagar frete no painel do Melhor Envio</li>
          <li>Gerar etiqueta (busca codigo de rastreio automaticamente)</li>
          <li>Baixar PDF e imprimir</li>
        </ol>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Passo 1: Criar Envio */}
        <Button
          onClick={handleCreateShipment}
          disabled={!!melhorEnvioId || isCreating}
          isLoading={isCreating}
          className="w-full"
          variant={melhorEnvioId ? 'outline' : 'primary'}
        >
          {melhorEnvioId ? (
            <>
              <FiCheckCircle size={18} />
              Envio criado
            </>
          ) : (
            <>
              <FiTruck size={18} />
              1. Criar Envio
            </>
          )}
        </Button>

        {/* Passo 2: Checkout (pagar) */}
        <Button
          onClick={handleCheckout}
          disabled={!melhorEnvioId || isCheckingOut || !!trackingCode}
          isLoading={isCheckingOut}
          className="w-full"
          variant="primary"
        >
          <FiCreditCard size={18} />
          2. Pagar Frete
        </Button>

        {/* Passo 3: Gerar Etiqueta */}
        <Button
          onClick={handleGenerateLabel}
          disabled={!melhorEnvioId || isGenerating || !!trackingCode}
          isLoading={isGenerating}
          className="w-full"
          variant={trackingCode ? 'outline' : 'primary'}
        >
          {trackingCode ? (
            <>
              <FiCheckCircle size={18} />
              Etiqueta gerada
            </>
          ) : (
            <>
              <FiPrinter size={18} />
              3. Gerar Etiqueta
            </>
          )}
        </Button>

        {/* Passo 4: Baixar PDF */}
        <Button
          onClick={handleDownloadLabel}
          disabled={!trackingCode && !labelUrl}
          className="w-full"
          variant="outline"
        >
          <FiDownload size={18} />
          4. Baixar PDF
        </Button>
      </div>

      {melhorEnvioId && (
        <div className="mt-4 p-3 bg-gray-50 rounded border border-gray-200">
          <p className="text-xs text-gray-600 mb-1">ID Melhor Envio:</p>
          <code className="text-sm font-mono text-gray-900">{melhorEnvioId}</code>
        </div>
      )}

      {trackingCode && (
        <div className="mt-2 p-3 bg-green-50 rounded border border-green-200">
          <p className="text-xs text-green-700 mb-1">✅ Codigo de Rastreio obtido:</p>
          <code className="text-sm font-mono text-green-900 font-medium">{trackingCode}</code>
        </div>
      )}
    </div>
  )
}
