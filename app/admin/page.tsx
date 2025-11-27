import { prisma } from '@/lib/prisma';

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

  const cards = [
    {
      title: 'Total de produtos',
      value: stats.products.toString(),
      description: 'Produtos cadastrados',
      trend: null,
    },
    {
      title: 'Pedidos',
      value: stats.orders.toString(),
      description: 'Total de pedidos',
      trend: null,
    },
    {
      title: 'Receita total',
      value: `R$ ${stats.revenue.toFixed(2).replace('.', ',')}`,
      description: 'Vendas confirmadas',
      trend: null,
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Início</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {cards.map((card) => (
          <div
            key={card.title}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow"
          >
            <p className="text-sm text-gray-600 mb-1">{card.title}</p>
            <p className="text-2xl font-semibold text-gray-900 mb-1">{card.value}</p>
            <p className="text-xs text-gray-500">{card.description}</p>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Ações rápidas</h2>
          <div className="space-y-3">
            <a
              href="/admin/produtos/novo"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
            >
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-sm text-gray-900">Adicionar produto</p>
                <p className="text-xs text-gray-500">Criar novo produto na loja</p>
              </div>
            </a>

            <a
              href="/admin/produtos"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
            >
              <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-sm text-gray-900">Ver produtos</p>
                <p className="text-xs text-gray-500">Gerenciar produtos existentes</p>
              </div>
            </a>

            <a
              href="/admin/pedidos"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
            >
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-sm text-gray-900">Ver pedidos</p>
                <p className="text-xs text-gray-500">Gerenciar pedidos e entregas</p>
              </div>
            </a>
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Informações</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Loja online ativa</p>
                <p className="text-xs text-gray-500 mt-1">Sua loja está disponível para os clientes</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{stats.products} produtos ativos</p>
                <p className="text-xs text-gray-500 mt-1">Visíveis para os clientes</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 100 4v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2a2 2 0 100-4V6z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{stats.categories} categorias</p>
                <p className="text-xs text-gray-500 mt-1">Organizando seus produtos</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
