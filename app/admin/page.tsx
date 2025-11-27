import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

async function getStats() {
  const [productsCount, ordersCount, categoriesCount, revenue, recentProducts, lowStockProducts] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.category.count(),
    prisma.order.aggregate({
      _sum: {
        total: true,
      },
      where: {
        status: {
          in: ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED'],
        },
      },
    }),
    prisma.product.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        name: true,
        price: true,
        images: true,
        stock: true,
        category: {
          select: {
            name: true,
          },
        },
      },
    }),
    prisma.product.findMany({
      where: {
        stock: {
          lt: 10,
        },
      },
      take: 5,
      orderBy: {
        stock: 'asc',
      },
      select: {
        id: true,
        name: true,
        stock: true,
      },
    }),
  ]);

  return {
    products: productsCount,
    orders: ordersCount,
    categories: categoriesCount,
    revenue: revenue._sum.total || 0,
    recentProducts,
    lowStockProducts,
  };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Visão geral da sua loja</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="border border-gray-200 rounded-lg p-10 text-center">
          <p className="text-base text-gray-600 mb-4">Receita</p>
          <p className="text-5xl font-bold text-gray-900">R$ {stats.revenue.toFixed(0)}</p>
        </div>
        <div className="border border-gray-200 rounded-lg p-10 text-center">
          <p className="text-base text-gray-600 mb-4">Pedidos</p>
          <p className="text-5xl font-bold text-gray-900">{stats.orders}</p>
        </div>
        <div className="border border-gray-200 rounded-lg p-10 text-center">
          <p className="text-base text-gray-600 mb-4">Produtos</p>
          <p className="text-5xl font-bold text-gray-900">{stats.products}</p>
        </div>
        <div className="border border-gray-200 rounded-lg p-10 text-center">
          <p className="text-base text-gray-600 mb-4">Categorias</p>
          <p className="text-5xl font-bold text-gray-900">{stats.categories}</p>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Products */}
        <div className="col-span-2 border border-gray-200 rounded-lg">
          <div className="px-8 py-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Produtos Recentes</h2>
              <Link href="/admin/produtos" className="text-sm font-medium text-gray-900 hover:text-gray-600">
                Ver todos →
              </Link>
            </div>
          </div>
          <div className="p-8">
            {stats.recentProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Nenhum produto ainda</p>
              </div>
            ) : (
              <div className="space-y-4">
                {stats.recentProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/admin/produtos/${product.id}`}
                    className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-gray-900 transition-colors"
                  >
                    <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.category.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">R$ {product.price.toFixed(2)}</p>
                      <p className="text-sm text-gray-500">{product.stock} un.</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Low Stock */}
        <div className="border border-gray-200 rounded-lg">
          <div className="px-8 py-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Estoque Baixo</h2>
          </div>
          <div className="p-8">
            {stats.lowStockProducts.length === 0 ? (
              <p className="text-gray-500 text-sm">Nenhum produto com estoque baixo</p>
            ) : (
              <div className="space-y-3">
                {stats.lowStockProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/admin/produtos/${product.id}`}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-gray-900 transition-colors"
                  >
                    <p className="text-sm font-medium text-gray-900 truncate flex-1">{product.name}</p>
                    <span className="ml-3 text-sm font-semibold text-gray-900">{product.stock}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Link
          href="/admin/produtos"
          className="border-2 border-gray-900 rounded-lg p-10 hover:bg-gray-900 hover:text-white transition-colors group"
        >
          <h3 className="text-xl font-semibold mb-2 group-hover:text-white">Gerenciar Produtos</h3>
          <p className="text-gray-600 group-hover:text-gray-300">Ver e editar todos os produtos</p>
        </Link>
        <Link
          href="/admin/pedidos"
          className="border-2 border-gray-900 rounded-lg p-10 hover:bg-gray-900 hover:text-white transition-colors group"
        >
          <h3 className="text-xl font-semibold mb-2 group-hover:text-white">Ver Pedidos</h3>
          <p className="text-gray-600 group-hover:text-gray-300">Gerenciar todas as vendas</p>
        </Link>
      </div>
    </div>
  );
}
