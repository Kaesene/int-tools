'use client'

import { useState, useEffect } from 'react'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { FiCheckCircle, FiPackage, FiHome } from 'react-icons/fi'

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

export default function PedidoSucessoPage({ params }: { params: { id: string } }) {
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
      <div className="container mx-auto px-4 py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Pedido não encontrado</h1>
        <Link href="/">
          <Button>Voltar para Início</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <FiCheckCircle className="text-green-600" size={48} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Pedido Realizado com Sucesso!</h1>
          <p className="text-gray-600">
            Seu pedido <span className="font-semibold">#{order.orderNumber}</span> foi recebido e está
            sendo processado
          </p>
        </div>

        {/* Order Summary Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Resumo do Pedido</h2>

          {/* Items */}
          <div className="space-y-3 mb-6">
            {order.items.map((item, index) => (
              <div key={index} className="flex gap-3 pb-3 border-b last:border-0">
                <img
                  src={item.productImage || '/placeholder.png'}
                  alt={item.productName}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{item.productName}</h3>
                  <p className="text-sm text-gray-600">Quantidade: {item.quantity}</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="border-t pt-4 flex justify-between items-center">
            <span className="font-semibold text-gray-900">Total:</span>
            <span className="text-2xl font-bold text-primary-600">{formatPrice(order.total)}</span>
          </div>
        </div>

        {/* Shipping Address Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Endereço de Entrega</h2>
          <div className="text-gray-700 space-y-1">
            <p className="font-semibold">{order.shippingName}</p>
            <p>
              {order.shippingStreet}, {order.shippingNumber}
            </p>
            {order.shippingComplement && <p>{order.shippingComplement}</p>}
            <p>{order.shippingNeighborhood}</p>
            <p>
              {order.shippingCity} - {order.shippingState}
            </p>
            <p>CEP: {order.shippingZipCode}</p>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Próximos Passos</h2>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Você receberá um e-mail de confirmação em breve</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Acompanhe o status do seu pedido na área "Meus Pedidos"</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Prazo de entrega: 5 a 10 dias úteis</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/minha-conta/pedidos" className="flex-1">
            <Button variant="outline" className="w-full">
              <FiPackage size={20} />
              Ver Meus Pedidos
            </Button>
          </Link>
          <Link href="/" className="flex-1">
            <Button className="w-full">
              <FiHome size={20} />
              Voltar para Início
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
