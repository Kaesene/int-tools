'use client'

import { useState, useEffect } from 'react'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { FiArrowLeft, FiPackage, FiTruck, FiCheckCircle, FiClock } from 'react-icons/fi'

interface OrderDetails {
  id: number
  orderNumber: string
  total: number
  status: string
  createdAt: string
  items: {
    productName: string
    productImage: string
    quantity: number
    price: number
  }[]
  shippingName: string
  shippingStreet: string
  shippingNumber: string
  shippingComplement?: string
  shippingNeighborhood: string
  shippingCity: string
  shippingState: string
  shippingZipCode: string
}

const statusConfig = {
  pending: { label: 'Pendente', icon: FiClock, color: 'text-yellow-600 bg-yellow-50' },
  paid: { label: 'Pago', icon: FiCheckCircle, color: 'text-green-600 bg-green-50' },
  shipped: { label: 'Enviado', icon: FiTruck, color: 'text-blue-600 bg-blue-50' },
  delivered: { label: 'Entregue', icon: FiCheckCircle, color: 'text-green-700 bg-green-100' },
}

export default function PedidoDetalhesPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<OrderDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadOrder()
  }, [params.id])

  const loadOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setOrder(data)
      }
    } catch (error) {
      console.error('Erro ao carregar pedido:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Pedido não encontrado</h1>
        <Link href="/minha-conta/pedidos">
          <Button>Voltar para Meus Pedidos</Button>
        </Link>
      </div>
    )
  }

  const status = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.pending
  const StatusIcon = status.icon

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/minha-conta/pedidos"
        className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6"
      >
        <FiArrowLeft size={20} />
        Voltar para Meus Pedidos
      </Link>

      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Pedido #{order.orderNumber}</h1>
            <p className="text-sm text-gray-500 mt-1">
              Realizado em {new Date(order.createdAt).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>

          <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${status.color}`}>
            <StatusIcon size={20} />
            <span className="font-semibold">{status.label}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Itens do Pedido</h2>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex gap-4 pb-4 border-b last:border-0">
                  <img
                    src={item.productImage || '/placeholder.png'}
                    alt={item.productName}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{item.productName}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Quantidade: {item.quantity}
                    </p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">
                      {formatPrice(item.price)} cada
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Endereço de Entrega</h2>
            <div className="text-gray-700 space-y-1">
              <p className="font-semibold">{order.shippingName}</p>
              <p>{order.shippingStreet}, {order.shippingNumber}</p>
              {order.shippingComplement && <p>{order.shippingComplement}</p>}
              <p>{order.shippingNeighborhood}</p>
              <p>{order.shippingCity} - {order.shippingState}</p>
              <p>CEP: {order.shippingZipCode}</p>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Resumo do Pedido</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span>{formatPrice(order.total)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Frete:</span>
                <span className="text-green-600 font-medium">GRÁTIS</span>
              </div>
              <div className="border-t pt-3 flex justify-between items-center">
                <span className="font-semibold text-gray-900">Total:</span>
                <span className="text-2xl font-bold text-primary-600">
                  {formatPrice(order.total)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
