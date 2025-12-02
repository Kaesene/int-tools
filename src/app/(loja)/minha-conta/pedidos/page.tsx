'use client'

import { useState, useEffect } from 'react'
import { useClientAuth } from '@/contexts/ClientAuthContext'
import { formatPrice } from '@/lib/utils'
import { FiPackage, FiClock, FiCheckCircle, FiTruck, FiShoppingBag } from 'react-icons/fi'
import Link from 'next/link'

interface Order {
  id: number
  orderNumber: string
  total: number
  status: string
  createdAt: string
  items: {
    productName: string
    quantity: number
    price: number
  }[]
}

const statusConfig = {
  pending: { label: 'Pendente', icon: FiClock, color: 'text-yellow-600 bg-yellow-50' },
  paid: { label: 'Pago', icon: FiCheckCircle, color: 'text-green-600 bg-green-50' },
  shipped: { label: 'Enviado', icon: FiTruck, color: 'text-blue-600 bg-blue-50' },
  delivered: { label: 'Entregue', icon: FiCheckCircle, color: 'text-green-700 bg-green-100' },
  cancelled: { label: 'Cancelado', icon: FiPackage, color: 'text-red-600 bg-red-50' },
}

export default function MeusPedidosPage() {
  const { user } = useClientAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadOrders()
  }, [user])

  const loadOrders = async () => {
    if (!user) return

    try {
      const response = await fetch(`/api/orders?customerId=${user.id}`)
      if (response.ok) {
        const data = await response.json()
        setOrders(data)
      }
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
        <p className="text-gray-600 mt-4">Carregando pedidos...</p>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <FiShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Nenhum pedido ainda</h2>
        <p className="text-gray-600 mb-6">
          Você ainda não fez nenhum pedido. Explore nossos produtos!
        </p>
        <Link
          href="/produtos"
          className="inline-block px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          Ver Produtos
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-1">Meus Pedidos</h2>
        <p className="text-sm text-gray-600">Acompanhe o status dos seus pedidos</p>
      </div>

      {orders.map((order) => {
        const status = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.pending
        const StatusIcon = status.icon

        return (
          <div key={order.id} className="bg-white rounded-lg border border-gray-200 p-6">
            {/* Order Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b">
              <div>
                <h3 className="font-bold text-gray-900">Pedido #{order.orderNumber}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${status.color}`}>
                  <StatusIcon size={16} />
                  <span className="text-sm font-medium">{status.label}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="text-lg font-bold text-primary-600">{formatPrice(order.total)}</p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="space-y-2">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-gray-700">
                    {item.quantity}x {item.productName}
                  </span>
                  <span className="font-medium text-gray-900">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="mt-4 pt-4 border-t flex gap-3">
              <Link
                href={`/minha-conta/pedidos/${order.id}`}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                Ver Detalhes
              </Link>
              {order.status === 'delivered' && (
                <button className="text-sm text-gray-600 hover:text-gray-700 font-medium">
                  Avaliar Compra
                </button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
