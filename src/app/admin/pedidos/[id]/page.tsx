import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'
import { FiArrowLeft, FiPackage, FiMapPin, FiUser, FiCalendar, FiCreditCard } from 'react-icons/fi'
import { Button } from '@/components/ui/Button'
import { UpdateOrderStatusButton } from '@/components/admin/UpdateOrderStatusButton'

export const dynamic = 'force-dynamic'

async function getOrder(id: string) {
  const order = await prisma.order.findUnique({
    where: { id: parseInt(id) },
    include: {
      user: true,
      items: {
        include: {
          product: true,
        },
      },
    },
  })

  return order
}

export default async function AdminOrderDetailPage({ params }: { params: { id: string } }) {
  const order = await getOrder(params.id)

  if (!order) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Pedido nao encontrado</h1>
        <Link href="/admin/pedidos">
          <Button variant="outline">Voltar para Pedidos</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/admin/pedidos" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-4">
          <FiArrowLeft size={20} />
          Voltar para Pedidos
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Pedido #{order.orderNumber}</h1>
            <p className="text-gray-600 mt-1">
              Criado em {new Date(order.createdAt).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
          <UpdateOrderStatusButton orderId={order.id} currentStatus={order.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FiPackage size={20} />
              Itens do Pedido
            </h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4 pb-4 border-b last:border-0">
                  <img
                    src={item.productImage || '/placeholder.png'}
                    alt={item.productName}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.productName}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Quantidade: {item.quantity} x {formatPrice(item.price)}
                    </p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">
                      Subtotal: {formatPrice(Number(item.price) * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="mt-6 pt-4 border-t space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Frete:</span>
                <span className="font-medium">
                  {order.shippingCost > 0 ? formatPrice(order.shippingCost) : 'GRATIS'}
                </span>
              </div>
              {Number(order.discount) > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Desconto:</span>
                  <span className="font-medium text-green-600">-{formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between items-center pt-2 border-t">
                <span className="font-semibold text-gray-900">Total:</span>
                <span className="text-2xl font-bold text-primary-600">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FiMapPin size={20} />
              Endereco de Entrega
            </h2>
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

        {/* Right Column - Customer & Payment Info */}
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FiUser size={20} />
              Cliente
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Nome</p>
                <p className="font-medium text-gray-900">{order.user.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium text-gray-900">{order.user.email}</p>
              </div>
              {order.user.phone && (
                <div>
                  <p className="text-sm text-gray-600">Telefone</p>
                  <p className="font-medium text-gray-900">{order.user.phone}</p>
                </div>
              )}
              {order.user.cpf && (
                <div>
                  <p className="text-sm text-gray-600">CPF</p>
                  <p className="font-medium text-gray-900">{order.user.cpf}</p>
                </div>
              )}
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FiCreditCard size={20} />
              Pagamento
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Status do Pagamento</p>
                <p className="font-medium text-gray-900">{order.paymentStatus === 'approved' ? 'Aprovado' : order.paymentStatus === 'pending' ? 'Pendente' : 'Rejeitado'}</p>
              </div>
              {order.paymentMethod && (
                <div>
                  <p className="text-sm text-gray-600">Metodo</p>
                  <p className="font-medium text-gray-900">{order.paymentMethod}</p>
                </div>
              )}
              {order.paymentId && (
                <div>
                  <p className="text-sm text-gray-600">ID do Pagamento</p>
                  <p className="font-medium text-gray-900 text-xs break-all">{order.paymentId}</p>
                </div>
              )}
              {order.paidAt && (
                <div>
                  <p className="text-sm text-gray-600">Pago em</p>
                  <p className="font-medium text-gray-900">
                    {new Date(order.paidAt).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FiCalendar size={20} />
              Linha do Tempo
            </h2>
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="w-2 h-2 bg-primary-600 rounded-full mt-1.5 flex-shrink-0"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Pedido Criado</p>
                  <p className="text-xs text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
              {order.paidAt && (
                <div className="flex gap-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-1.5 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Pagamento Aprovado</p>
                    <p className="text-xs text-gray-600">
                      {new Date(order.paidAt).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              )}
              {order.shippedAt && (
                <div className="flex gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Enviado</p>
                    <p className="text-xs text-gray-600">
                      {new Date(order.shippedAt).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              )}
              {order.deliveredAt && (
                <div className="flex gap-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-1.5 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Entregue</p>
                    <p className="text-xs text-gray-600">
                      {new Date(order.deliveredAt).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
