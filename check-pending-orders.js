const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function checkPendingOrders() {
  try {
    const orders = await prisma.order.findMany({
      where: {
        status: 'pending',
        paymentId: { not: null }
      },
      select: {
        id: true,
        orderNumber: true,
        status: true,
        paymentStatus: true,
        paymentId: true,
        total: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    })

    if (orders.length === 0) {
      console.log('\n❌ Nenhum pedido pendente com Payment ID encontrado.')
      console.log('\nSugestão: Faça uma compra de teste no site para gerar um pedido real.')
    } else {
      console.log('\n✅ Pedidos pendentes com Payment ID:\n')
      console.table(orders.map(o => ({
        'ID': o.id,
        'Número': o.orderNumber,
        'Status': o.status,
        'Payment Status': o.paymentStatus,
        'Payment ID': o.paymentId,
        'Total': `R$ ${o.total.toFixed(2)}`,
        'Criado em': o.createdAt.toLocaleString('pt-BR')
      })))
      console.log('\n💡 Você pode usar um desses Payment IDs para testar manualmente.')
    }
  } catch (error) {
    console.error('Erro:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkPendingOrders()
