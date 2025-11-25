import { prisma } from '@/lib/prisma';

export const revalidate = 0;

async function getOrders() {
  return await prisma.order.findMany({
    include: {
      user: true,
      address: true,
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

const statusMap = {
  PENDING: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-800' },
  PAID: { label: 'Pago', color: 'bg-green-100 text-green-800' },
  PROCESSING: { label: 'Processando', color: 'bg-blue-100 text-blue-800' },
  SHIPPED: { label: 'Enviado', color: 'bg-purple-100 text-purple-800' },
  DELIVERED: { label: 'Entregue', color: 'bg-green-100 text-green-800' },
  CANCELLED: { label: 'Cancelado', color: 'bg-red-100 text-red-800' },
};

export default async function OrdersPage() {
  const orders = await getOrders();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Pedidos</h1>
        <p className="text-gray-600 mt-2">{orders.length} pedido(s) cadastrado(s)</p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum pedido ainda</h3>
          <p className="text-gray-600">Os pedidos aparecerão aqui quando os clientes comprarem</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {/* Header do Pedido */}
              <div className="flex justify-between items-start mb-4 pb-4 border-b border-gray-200">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Pedido #{order.orderNumber.slice(0, 8).toUpperCase()}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {new Date(order.createdAt).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusMap[order.status].color}`}>
                  {statusMap[order.status].label}
                </span>
              </div>

              {/* Informações do Cliente */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Cliente</h4>
                  <p className="text-sm text-gray-900">{order.user.name}</p>
                  <p className="text-sm text-gray-600">{order.user.email}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Endereço de Entrega</h4>
                  <p className="text-sm text-gray-900">
                    {order.address.street}, {order.address.number}
                    {order.address.complement && ` - ${order.address.complement}`}
                  </p>
                  <p className="text-sm text-gray-600">
                    {order.address.neighborhood}, {order.address.city} - {order.address.state}
                  </p>
                  <p className="text-sm text-gray-600">CEP: {order.address.zipCode}</p>
                </div>
              </div>

              {/* Itens do Pedido */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Itens</h4>
                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-900">
                        {item.quantity}x {item.product.name}
                      </span>
                      <span className="text-gray-600">
                        R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totais */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">R$ {order.subtotal.toFixed(2).replace('.', ',')}</span>
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Frete</span>
                  <span className="text-gray-900">R$ {order.shippingCost.toFixed(2).replace('.', ',')}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Desconto</span>
                    <span className="text-green-600">-R$ {order.discount.toFixed(2).replace('.', ',')}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg mt-2">
                  <span>Total</span>
                  <span>R$ {order.total.toFixed(2).replace('.', ',')}</span>
                </div>
              </div>

              {/* Informações Extras */}
              {(order.paymentMethod || order.trackingCode) && (
                <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {order.paymentMethod && (
                    <div>
                      <span className="text-sm font-medium text-gray-700">Forma de Pagamento: </span>
                      <span className="text-sm text-gray-900">{order.paymentMethod}</span>
                    </div>
                  )}
                  {order.trackingCode && (
                    <div>
                      <span className="text-sm font-medium text-gray-700">Código de Rastreio: </span>
                      <span className="text-sm text-gray-900 font-mono">{order.trackingCode}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
