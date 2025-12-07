const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  // Pega o último pedido
  const lastOrder = await prisma.order.findFirst({
    orderBy: { createdAt: 'desc' }
  })

  if (!lastOrder) {
    console.log('❌ Nenhum pedido encontrado')
    return
  }

  console.log(`📦 Atualizando pedido #${lastOrder.id}...`)

  const updated = await prisma.order.update({
    where: { id: lastOrder.id },
    data: {
      shippingCpf: '12345678909',
      shippingPhone: '15998765432'
    }
  })

  console.log('✅ Pedido atualizado!')
  console.log('   CPF:', updated.shippingCpf)
  console.log('   Telefone:', updated.shippingPhone)
  console.log('\n🧪 Agora teste o botão "Criar Envio" em:')
  console.log(`   http://localhost:3000/admin/pedidos/${updated.id}`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
