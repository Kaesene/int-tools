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
      take: 3,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        name: true,
        price: true,
        images: true,
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
        sku: true,
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
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-3xl p-8 md:p-12 text-white shadow-2xl">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-3">Bem-vindo de volta! 👋</h1>
              <p className="text-indigo-100 text-lg">Aqui está o que está acontecendo na sua loja hoje</p>
            </div>
            <Link
              href="/admin/produtos/novo"
              className="hidden md:flex items-center gap-2 bg-white text-indigo-600 px-6 py-3 rounded-xl hover:bg-indigo-50 transition-all shadow-lg hover:shadow-xl font-bold"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Criar Produto
            </Link>
          </div>

          {/* Big Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-8">
            <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-5 border border-white/30">
              <p className="text-indigo-100 text-sm mb-2">Receita Total</p>
              <p className="text-3xl font-bold">R$ {stats.revenue.toFixed(0)}</p>
            </div>
            <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-5 border border-white/30">
              <p className="text-indigo-100 text-sm mb-2">Pedidos</p>
              <p className="text-3xl font-bold">{stats.orders}</p>
            </div>
            <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-5 border border-white/30">
              <p className="text-indigo-100 text-sm mb-2">Produtos</p>
              <p className="text-3xl font-bold">{stats.products}</p>
            </div>
            <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-5 border border-white/30">
              <p className="text-indigo-100 text-sm mb-2">Categorias</p>
              <p className="text-3xl font-bold">{stats.categories}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2 Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left - Recent Products */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Products */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Produtos Recentes</h2>
                <p className="text-sm text-gray-500">Últimos produtos adicionados</p>
              </div>
              <Link
                href="/admin/produtos"
                className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                Ver todos
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <div className="p-6 space-y-4">
              {stats.recentProducts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <p className="text-gray-500 text-sm">Nenhum produto ainda</p>
                </div>
              ) : (
                stats.recentProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/admin/produtos/${product.id}`}
                    className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors group border border-gray-100"
                  >
                    <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate group-hover:text-indigo-600 transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-500">{product.category.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-indigo-600">
                        R$ {product.price.toFixed(2).replace('.', ',')}
                      </p>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 gap-4">
            <Link
              href="/admin/produtos"
              className="group bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
            >
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-1">Gerenciar Produtos</h3>
              <p className="text-blue-100 text-sm">Ver todos os produtos →</p>
            </Link>

            <Link
              href="/admin/pedidos"
              className="group bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl"
            >
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-1">Ver Pedidos</h3>
              <p className="text-emerald-100 text-sm">Gerenciar vendas →</p>
            </Link>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Low Stock Alert */}
          {stats.lowStockProducts.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-amber-900">Estoque Baixo</h3>
                  <p className="text-sm text-amber-700">{stats.lowStockProducts.length} produtos</p>
                </div>
              </div>

              <div className="space-y-3">
                {stats.lowStockProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/admin/produtos/${product.id}`}
                    className="flex items-center justify-between p-3 bg-white rounded-lg hover:bg-amber-50 transition-colors border border-amber-100"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{product.name}</p>
                      <p className="text-xs text-gray-500 font-mono">{product.sku}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded">
                        {product.stock}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Stats Cards */}
          <div className="space-y-3">
            <div className="bg-white border border-gray-200 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Conversão</p>
                  <p className="text-2xl font-bold text-gray-900">8.5%</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-emerald-600 text-sm">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold">+2.1% esta semana</span>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Ticket Médio</p>
                  <p className="text-2xl font-bold text-gray-900">R$ {stats.orders > 0 ? (stats.revenue / stats.orders).toFixed(2) : '0,00'}</p>
                </div>
              </div>
              <p className="text-sm text-gray-500">Por pedido confirmado</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
