import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

async function getStats() {
  const [productsCount, ordersCount, categoriesCount, revenue] = await Promise.all([
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
  ]);

  return {
    products: productsCount,
    orders: ordersCount,
    categories: categoriesCount,
    revenue: revenue._sum.total || 0,
  };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const statCards = [
    {
      title: 'Receita Total',
      value: `R$ ${stats.revenue.toFixed(2).replace('.', ',')}`,
      subtitle: 'Vendas confirmadas',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      gradient: 'from-emerald-500 to-teal-600',
      bgGradient: 'from-emerald-50 to-teal-50',
      textColor: 'text-emerald-700',
    },
    {
      title: 'Pedidos',
      value: stats.orders.toString(),
      subtitle: 'Total de pedidos',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
      gradient: 'from-blue-500 to-indigo-600',
      bgGradient: 'from-blue-50 to-indigo-50',
      textColor: 'text-blue-700',
    },
    {
      title: 'Produtos',
      value: stats.products.toString(),
      subtitle: 'Produtos cadastrados',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      gradient: 'from-purple-500 to-pink-600',
      bgGradient: 'from-purple-50 to-pink-50',
      textColor: 'text-purple-700',
    },
    {
      title: 'Categorias',
      value: stats.categories.toString(),
      subtitle: 'Categorias ativas',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
      ),
      gradient: 'from-orange-500 to-red-600',
      bgGradient: 'from-orange-50 to-red-50',
      textColor: 'text-orange-700',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Bem-vindo de volta! Aqui está um resumo da sua loja.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <div
            key={card.title}
            className={`relative bg-gradient-to-br ${card.bgGradient} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden border border-white/50`}
          >
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-32 h-32 opacity-10 transform translate-x-8 -translate-y-8">
              <div className={`w-full h-full bg-gradient-to-br ${card.gradient} rounded-full blur-2xl`}></div>
            </div>

            {/* Icon */}
            <div className={`relative inline-flex p-3 rounded-xl bg-gradient-to-br ${card.gradient} text-white shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
              {card.icon}
            </div>

            {/* Content */}
            <div className="relative">
              <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
              <p className={`text-3xl font-bold ${card.textColor} mb-1`}>{card.value}</p>
              <p className="text-xs text-gray-500">{card.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions - 2/3 */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Ações Rápidas</h2>
              <span className="text-xs px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full font-medium">4 ações</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                href="/admin/produtos/novo"
                className="group flex items-start gap-4 p-4 rounded-xl hover:bg-gradient-to-br hover:from-indigo-50 hover:to-purple-50 transition-all duration-300 border-2 border-dashed border-gray-200 hover:border-indigo-300"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">Novo Produto</h3>
                  <p className="text-sm text-gray-500">Adicionar produto à loja</p>
                </div>
              </Link>

              <Link
                href="/admin/produtos"
                className="group flex items-start gap-4 p-4 rounded-xl hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 border-2 border-dashed border-gray-200 hover:border-blue-300"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">Ver Produtos</h3>
                  <p className="text-sm text-gray-500">Gerenciar produtos</p>
                </div>
              </Link>

              <Link
                href="/admin/pedidos"
                className="group flex items-start gap-4 p-4 rounded-xl hover:bg-gradient-to-br hover:from-emerald-50 hover:to-teal-50 transition-all duration-300 border-2 border-dashed border-gray-200 hover:border-emerald-300"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">Pedidos</h3>
                  <p className="text-sm text-gray-500">Gerenciar pedidos</p>
                </div>
              </Link>

              <Link
                href="/admin/categorias"
                className="group flex items-start gap-4 p-4 rounded-xl hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50 transition-all duration-300 border-2 border-dashed border-gray-200 hover:border-purple-300"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">Categorias</h3>
                  <p className="text-sm text-gray-500">Organizar produtos</p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Status Info - 1/3 */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl shadow-xl p-6 text-white relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-20 translate-x-20"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-16 -translate-x-16"></div>

          <div className="relative">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">Status da Loja</h2>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>

            <div className="space-y-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold">Loja Online</p>
                    <p className="text-xs text-indigo-200">Sistema operacional</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold">{stats.products} Produtos</p>
                    <p className="text-xs text-indigo-200">Visíveis na loja</p>
                  </div>
                </div>
              </div>

              <Link
                href="/"
                target="_blank"
                className="block w-full bg-white hover:bg-gray-100 text-indigo-700 font-semibold py-3 px-4 rounded-xl text-center transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Visualizar Loja →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
