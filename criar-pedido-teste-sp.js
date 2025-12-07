const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  // Busca um usuário qualquer
  const user = await prisma.user.findFirst()

  if (!user) {
    console.log('❌ Nenhum usuário encontrado')
    return
  }

  // Busca um produto
  const product = await prisma.product.findFirst()

  if (!product) {
    console.log('❌ Nenhum produto encontrado')
    return
  }

  // Cria pedido de teste para SÃO PAULO
  const order = await prisma.order.create({
    data: {
      orderNumber: 'TESTE-SP',
      userId: user.id,
      subtotal: 100,
      shippingCost: 20,
      discount: 0,
      total: 120,
      status: 'paid',
      paymentStatus: 'paid',

      // Endereço SÃO PAULO (CEP diferente de Marília)
      shippingName: 'Cliente Teste SP',
      shippingPhone: '11987654321',
      shippingCpf: '47396109817',
      shippingStreet: 'Avenida Paulista',
      shippingNumber: '1000',
      shippingNeighborhood: 'Bela Vista',
      shippingCity: 'São Paulo',
      shippingState: 'SP',
      shippingZipCode: '01310-100',
      shippingMethod: 'PAC',

      items: {
        create: {
          productId: product.id,
          productName: product.name,
          productImage: product.thumbnail,
          quantity: 1,
          price: 100,
        }
      }
    }
  })

  console.log('✅ Pedido de teste criado!')
  console.log('   ID:', order.id)
  console.log('   Destino: São Paulo - SP (CEP 01310-100)')
  console.log('\n🧪 Teste em:')
  console.log(`   https://www.inttools.com.br/admin/pedidos/${order.id}`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
