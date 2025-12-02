import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/utils'
import { UpdateOrderStatusButton } from '@/components/admin/UpdateOrderStatusButton'
import Link from 'next/link'
import { FiEye, FiPackage, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi'

async function getOrders() {
  const orders = await prisma.order.findMany({
    include: {
      user: true,
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return orders
}

const statusMap = {
  pending: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-800', icon: FiClock },
  paid: { label: 'Pago', color: 'bg-green-100 text-green-800', icon: FiCheckCircle },
  shipped: { label: 'Enviado', color: 'bg-blue-100 text-blue-800', icon: FiPackage },
  delivered: { label: 'Entregue', color: 'bg-green-100 text-green-800', icon: FiCheckCircle },
  cancelled: { label: 'Cancelado', color: 'bg-red-100 text-red-800', icon: FiXCircle },
}

export default async function AdminOrdersPage() {
  const orders = await getOrders()

  const stats = {
    pending: orders.filter(o => o.status === 'pending').length,
    paid: orders.filter(o => o.status === 'paid').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Pedidos</h1>
        <p className="text-gray-600 mt-2">{orders.length} pedidos no total</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-700 font-medium">Pendentes</p>
          <p className="text-2xl font-bold text-yellow-900">{stats.pending}</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-700 font-medium">Pagos</p>
          <p className="text-2xl font-bold text-green-900">{stats.paid}</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-700 font-medium">Enviados</p>
          <p className="text-2xl font-bold text-blue-900">{stats.shipped}</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-700 font-medium">Entregues</p>
          <p className="text-2xl font-bold text-green-900">{stats.delivered}</p>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Pedido
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Itens
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Data
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => {
                const statusInfo = statusMap[order.status as keyof typeof statusMap]
                const StatusIcon = statusInfo.icon

                return (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">#{order.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{order.user.name}</div>
                      <div className="text-xs text-gray-500">{order.user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {order.items.length} {order.items.length === 1 ? 'item' : 'itens'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{formatPrice(order.total)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <UpdateOrderStatusButton
                          orderId={order.id}
                          currentStatus={order.status}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <Link href={`/admin/pedidos/${order.id}`}>
                        <button className="text-primary-600 hover:text-primary-900 p-2 hover:bg-primary-50 rounded transition-colors">
                          <FiEye size={18} />
                        </button>
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {orders.length === 0 && (
          <div className="text-center py-12">
            <FiPackage className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-500 mb-2">Nenhum pedido ainda</p>
            <p className="text-sm text-gray-400">Os pedidos aparecerão aqui quando os clientes comprarem</p>
          </div>
        )}
      </div>
    </div>
  )
}
