import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { formatPrice } from '@/lib/utils'
import { UpdateOrderStatusButton } from '@/components/admin/UpdateOrderStatusButton'
import { TrackingCodeInput } from '@/components/admin/TrackingCodeInput'
import { MelhorEnvioShipping } from '@/components/admin/MelhorEnvioShipping'
import Link from 'next/link'
import { FiArrowLeft, FiUser, FiMapPin, FiCreditCard, FiPackage } from 'react-icons/fi'

export const dynamic = 'force-dynamic'

interface Props {
  params: { id: string }
}

async function getOrder(id: string) {
  const order = await prisma.order.findUnique({
    where: { id: parseInt(id) },
    include: {
      user: true,
      address: true,
      items: {
        include: {
          product: true,
        },
      },
    },
  })

  if (!order) {
    notFound()
  }

  return order
}

export default async function AdminOrderDetailPage({ params }: Props) {
  const order = await getOrder(params.id)

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/pedidos"
          className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-4"
        >
          <FiArrowLeft size={20} />
          Voltar para pedidos
        </Link>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Pedido #{order.id}</h1>
            <p className="text-gray-600 mt-1">
              Criado em {new Date(order.createdAt).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
          <UpdateOrderStatusButton orderId={order.id} currentStatus={order.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna Principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Produtos */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <FiPackage className="text-gray-600" size={20} />
                <h2 className="text-lg font-semibold text-gray-900">Produtos</h2>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {order.items.map((item) => (
                <div key={item.id} className="px-6 py-4 flex items-center gap-4">
                  <img
                    src={item.productImage || '/placeholder.png'}
                    alt={item.productName}
                    className="w-16 h-16 object-cover rounded border border-gray-200"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.productName}</h3>
                    <p className="text-sm text-gray-600">Quantidade: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{formatPrice(item.price)}</p>
                    <p className="text-sm text-gray-600">
                      Total: {formatPrice(Number(item.price) * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Frete ({order.shippingMethod})</span>
                  <span className="text-gray-900">{formatPrice(order.shippingCost)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Desconto</span>
                    <span className="text-green-600">-{formatPrice(order.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-300">
                  <span className="text-gray-900">Total</span>
                  <span className="text-primary-600">{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Codigo de Rastreio Manual */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Rastreio Manual</h2>
            <TrackingCodeInput orderId={order.id} currentTrackingCode={order.trackingCode} />
            <p className="text-xs text-gray-500 mt-2">
              💡 Ou use o sistema automatizado do Melhor Envio abaixo
            </p>
          </div>

          {/* Melhor Envio - Sistema Automatizado */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <MelhorEnvioShipping
              orderId={order.id}
              melhorEnvioId={order.melhorEnvioId}
              trackingCode={order.trackingCode}
              orderStatus={order.status}
            />
          </div>
        </div>

        {/* Coluna Lateral */}
        <div className="space-y-6">
          {/* Cliente */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <FiUser className="text-gray-600" size={20} />
              <h2 className="text-lg font-semibold text-gray-900">Cliente</h2>
            </div>
            <div className="space-y-2 text-sm">
              <div>
                <p className="text-gray-600">Nome</p>
                <p className="font-medium text-gray-900">{order.user.name || 'Nao informado'}</p>
              </div>
              <div>
                <p className="text-gray-600">Email</p>
                <p className="font-medium text-gray-900">{order.user.email}</p>
              </div>
              {order.user.phone && (
                <div>
                  <p className="text-gray-600">Telefone</p>
                  <p className="font-medium text-gray-900">{order.user.phone}</p>
                </div>
              )}
            </div>
          </div>

          {/* Endereco de Entrega */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <FiMapPin className="text-gray-600" size={20} />
              <h2 className="text-lg font-semibold text-gray-900">Entrega</h2>
            </div>
            <div className="text-sm space-y-1">
              <p className="font-medium text-gray-900">{order.shippingName}</p>
              <p className="text-gray-700">
                {order.shippingStreet}, {order.shippingNumber}
              </p>
              {order.shippingComplement && (
                <p className="text-gray-700">{order.shippingComplement}</p>
              )}
              <p className="text-gray-700">{order.shippingNeighborhood}</p>
              <p className="text-gray-700">
                {order.shippingCity} - {order.shippingState}
              </p>
              <p className="text-gray-700 font-medium">{order.shippingZipCode}</p>
            </div>
          </div>

          {/* Pagamento */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <FiCreditCard className="text-gray-600" size={20} />
              <h2 className="text-lg font-semibold text-gray-900">Pagamento</h2>
            </div>
            <div className="space-y-2 text-sm">
              <div>
                <p className="text-gray-600">Status</p>
                <p className="font-medium text-gray-900 capitalize">{order.paymentStatus}</p>
              </div>
              {order.paymentMethod && (
                <div>
                  <p className="text-gray-600">Metodo</p>
                  <p className="font-medium text-gray-900 capitalize">{order.paymentMethod}</p>
                </div>
              )}
              {order.paymentId && (
                <div>
                  <p className="text-gray-600">ID Transacao</p>
                  <code className="text-xs font-mono text-gray-900">{order.paymentId}</code>
                </div>
              )}
              {order.paidAt && (
                <div>
                  <p className="text-gray-600">Pago em</p>
                  <p className="font-medium text-gray-900">
                    {new Date(order.paidAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Datas */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <div className="flex-1">
                  <p className="text-gray-600">Criado</p>
                  <p className="font-medium text-gray-900">
                    {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
              {order.paidAt && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <div className="flex-1">
                    <p className="text-gray-600">Pago</p>
                    <p className="font-medium text-gray-900">
                      {new Date(order.paidAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              )}
              {order.shippedAt && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <div className="flex-1">
                    <p className="text-gray-600">Enviado</p>
                    <p className="font-medium text-gray-900">
                      {new Date(order.shippedAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              )}
              {order.deliveredAt && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <div className="flex-1">
                    <p className="text-gray-600">Entregue</p>
                    <p className="font-medium text-gray-900">
                      {new Date(order.deliveredAt).toLocaleDateString('pt-BR')}
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
