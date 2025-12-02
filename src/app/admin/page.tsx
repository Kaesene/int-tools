import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/utils'
import {
  FiPackage,
  FiShoppingBag,
  FiDollarSign,
  FiUsers,
  FiTrendingUp,
  FiAlertCircle,
} from 'react-icons/fi'

async function getDashboardData() {
  // Total de produtos
  const totalProducts = await prisma.product.count()
  const activeProducts = await prisma.product.count({
    where: { active: true },
  })
  const lowStockProducts = await prisma.product.count({
    where: {
      active: true,
      stock: { lte: 5 },
    },
  })

  // Total de pedidos
  const totalOrders = await prisma.order.count()
  const pendingOrders = await prisma.order.count({
    where: { status: 'pending' },
  })

  // Total de clientes
  const totalCustomers = await prisma.user.count()

  // Receita total (soma de todos os pedidos pagos)
  const ordersData = await prisma.order.findMany({
    where: {
      status: { in: ['paid', 'shipped', 'delivered'] },
    },
    select: {
      total: true,
    },
  })

  const totalRevenue = ordersData.reduce((sum, order) => {
    return sum + Number(order.total)
  }, 0)

  // Produtos recentes
  const recentProducts = await prisma.product.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      category: true,
    },
  })

  // Pedidos recentes
  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      user: true,
    },
  })

  return {
    totalProducts,
    activeProducts,
    lowStockProducts,
    totalOrders,
    pendingOrders,
    totalCustomers,
    totalRevenue,
    recentProducts,
    recentOrders,
  }
}

export default async function AdminDashboardPage() {
  const data = await getDashboardData()

  const stats = [
    {
      icon: FiPackage,
      label: 'Total de Produtos',
      value: data.totalProducts,
      subtext: `${data.activeProducts} ativos`,
      color: 'bg-blue-500',
    },
    {
      icon: FiShoppingBag,
      label: 'Pedidos',
      value: data.totalOrders,
      subtext: `${data.pendingOrders} pendentes`,
      color: 'bg-green-500',
    },
    {
      icon: FiDollarSign,
      label: 'Receita Total',
      value: formatPrice(data.totalRevenue),
      subtext: 'Pedidos pagos',
      color: 'bg-primary-500',
    },
    {
      icon: FiUsers,
      label: 'Clientes',
      value: data.totalCustomers,
      subtext: 'Total cadastrados',
      color: 'bg-purple-500',
    },
  ]

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Visão geral da sua loja</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="text-white" size={24} />
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.subtext}</p>
            </div>
          )
        })}
      </div>

      {/* Alerts */}
      {data.lowStockProducts > 0 && (
        <div className="bg-warning-50 border border-warning-200 rounded-lg p-4 mb-8 flex items-center gap-3">
          <FiAlertCircle className="text-warning-600" size={24} />
          <div>
            <p className="font-medium text-warning-900">
              {data.lowStockProducts} produto{data.lowStockProducts > 1 ? 's' : ''} com estoque baixo
            </p>
            <p className="text-sm text-warning-700">Verifique o estoque e reabasteça quando necessário</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Products */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Produtos Recentes</h2>
          <div className="space-y-4">
            {data.recentProducts.length > 0 ? (
              data.recentProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between pb-4 border-b last:border-b-0">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.category.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{formatPrice(product.price)}</p>
                    <p className="text-sm text-gray-500">Estoque: {product.stock}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">Nenhum produto cadastrado</p>
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Pedidos Recentes</h2>
          <div className="space-y-4">
            {data.recentOrders.length > 0 ? (
              data.recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between pb-4 border-b last:border-b-0">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Pedido #{order.id}</p>
                    <p className="text-sm text-gray-500">{order.user.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{formatPrice(order.total)}</p>
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        order.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : order.status === 'paid'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {order.status === 'pending' ? 'Pendente' : order.status === 'paid' ? 'Pago' : order.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">Nenhum pedido ainda</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
