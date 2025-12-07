const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  // Atualiza pedido #7 com CPF válido
  const updated = await prisma.order.update({
    where: { id: 7 },
    data: {
      shippingCpf: '47396109817' // CPF válido
    }
  })

  console.log('✅ Pedido #7 atualizado!')
  console.log('   CPF cliente:', updated.shippingCpf)
  console.log('\n🧪 Agora teste o botão "Criar Envio" novamente!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
