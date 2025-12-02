import { prisma } from '@/lib/prisma'
import { FiUser, FiMail, FiMapPin, FiShoppingBag } from 'react-icons/fi'

async function getCustomers() {
  const customers = await prisma.user.findMany({
    include: {
      _count: {
        select: {
          orders: true,
        },
      },
      orders: {
        select: {
          total: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return customers
}

export default async function AdminCustomersPage() {
  const customers = await getCustomers()

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
        <p className="text-gray-600 mt-2">{customers.length} clientes cadastrados</p>
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {customers.map((customer) => {
          const totalSpent = customer.orders.reduce((sum, order) => {
            return sum + Number(order.total)
          }, 0)

          return (
            <div key={customer.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <FiUser className="text-primary-600" size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg text-gray-900 truncate">{customer.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                    <FiMail size={14} />
                    <span className="truncate">{customer.email}</span>
                  </div>
                </div>
              </div>

              {customer.phone && (
                <div className="text-sm text-gray-600 mb-3">
                  <span className="font-medium">Telefone:</span> {customer.phone}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 pt-4 border-t">
                <div className="bg-gray-50 rounded p-3">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <FiShoppingBag size={16} />
                    <span className="text-xs font-medium">Pedidos</span>
                  </div>
                  <p className="text-xl font-bold text-gray-900">{customer._count.orders}</p>
                </div>

                <div className="bg-gray-50 rounded p-3">
                  <div className="text-xs font-medium text-gray-600 mb-1">Total Gasto</div>
                  <p className="text-xl font-bold text-gray-900">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(totalSpent)}
                  </p>
                </div>
              </div>

              <div className="mt-4 text-xs text-gray-500">
                Cadastrado em {new Date(customer.createdAt).toLocaleDateString('pt-BR')}
              </div>
            </div>
          )
        })}
      </div>

      {customers.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <FiUser className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-500 mb-2">Nenhum cliente cadastrado ainda</p>
          <p className="text-sm text-gray-400">Os clientes aparecerão aqui quando criarem contas</p>
        </div>
      )}
    </div>
  )
}
