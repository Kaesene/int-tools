import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

async function getStats() {
  const [productsCount, ordersCount, categoriesCount, revenue, recentProducts] = await Promise.all([
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
        createdAt: true,
      },
    }),
  ]);

  return {
    products: productsCount,
    orders: ordersCount,
    categories: categoriesCount,
    revenue: revenue._sum.total || 0,
    recentProducts,
  };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  // Fake data for chart (últimos 7 dias)
  const chartData = [
    { day: 'Seg', value: 65 },
    { day: 'Ter', value: 85 },
    { day: 'Qua', value: 45 },
    { day: 'Qui', value: 95 },
    { day: 'Sex', value: 75 },
    { day: 'Sáb', value: 55 },
    { day: 'Dom', value: 40 },
  ];

  const maxValue = Math.max(...chartData.map((d) => d.value));

  return (
    <div className="space-y-6">
      {/* Welcome Header - Simples e direto */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Visão geral da sua loja</p>
      </div>

      {/* Main Grid - Assimétrico */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Stats Compactos - 3 colunas */}
        <div className="lg:col-span-8 grid grid-cols-3 gap-4">
          {/* Receita */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">R$ {stats.revenue.toFixed(2).replace('.', ',')}</p>
            <p className="text-xs text-gray-500 mt-1">Receita Total</p>
          </div>

          {/* Pedidos */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.orders}</p>
            <p className="text-xs text-gray-500 mt-1">Pedidos</p>
          </div>

          {/* Produtos */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.products}</p>
            <p className="text-xs text-gray-500 mt-1">Produtos</p>
          </div>
        </div>

        {/* Quick Action - 1 coluna */}
        <div className="lg:col-span-4">
          <Link
            href="/admin/produtos/novo"
            className="group block bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-6 text-white hover:shadow-xl transition-all h-full"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
            </div>
            <p className="text-lg font-bold">Novo Produto</p>
            <p className="text-sm text-indigo-100 mt-1">Adicionar ao catálogo →</p>
          </Link>
        </div>

        {/* Gráfico de Vendas - 8 colunas */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Vendas da Semana</h2>
              <p className="text-xs text-gray-500 mt-1">Últimos 7 dias</p>
            </div>
            <div className="flex items-center gap-2 text-emerald-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span className="text-sm font-semibold">+12.5%</span>
            </div>
          </div>

          {/* Chart */}
          <div className="flex items-end justify-between gap-3 h-40">
            {chartData.map((item, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="w-full flex flex-col justify-end h-32">
                  <div
                    className="w-full bg-gradient-to-t from-indigo-600 to-purple-600 rounded-t-lg group-hover:from-indigo-700 group-hover:to-purple-700 transition-all"
                    style={{ height: `${(item.value / maxValue) * 100}%` }}
                  ></div>
                </div>
                <span className="text-xs font-medium text-gray-500">{item.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Atividades Recentes - 4 colunas */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-gray-900">Atividades</h2>
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          </div>

          <div className="space-y-4">
            {/* Activity Items */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">Novo pedido #1234</p>
                <p className="text-xs text-gray-500 mt-0.5">2 minutos atrás</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">Produto atualizado</p>
                <p className="text-xs text-gray-500 mt-0.5">15 minutos atrás</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">Pagamento recebido</p>
                <p className="text-xs text-gray-500 mt-0.5">1 hora atrás</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">Estoque baixo</p>
                <p className="text-xs text-gray-500 mt-0.5">3 horas atrás</p>
              </div>
            </div>
          </div>

          <Link
            href="/admin/pedidos"
            className="block text-center text-sm font-medium text-indigo-600 hover:text-indigo-700 mt-5 pt-5 border-t border-gray-100"
          >
            Ver todas as atividades →
          </Link>
        </div>

        {/* Produtos Recentes - 12 colunas (full width) */}
        <div className="lg:col-span-12 bg-white rounded-2xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-gray-900">Produtos Recentes</h2>
            <Link href="/admin/produtos" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
              Ver todos →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {stats.recentProducts.map((product) => (
              <Link
                key={product.id}
                href={`/admin/produtos/${product.id}`}
                className="group block bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-all"
              >
                <div className="aspect-square bg-white rounded-lg mb-3 overflow-hidden border border-gray-200">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
                <p className="text-sm font-semibold text-gray-900 truncate">{product.name}</p>
                <p className="text-sm font-bold text-indigo-600 mt-1">
                  R$ {product.price.toFixed(2).replace('.', ',')}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
