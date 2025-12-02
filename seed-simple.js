const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  const categories = [
    {
      name: 'Ferramentas Manuais',
      slug: 'ferramentas-manuais',
    },
    {
      name: 'Ferramentas Elétricas',
      slug: 'ferramentas-eletricas',
    },
    {
      name: 'Ferramentas de Jardim',
      slug: 'ferramentas-de-jardim',
    },
    {
      name: 'Equipamentos de Segurança',
      slug: 'equipamentos-de-seguranca',
    },
    {
      name: 'Acessórios',
      slug: 'acessorios',
    },
    {
      name: 'Medição e Nivelamento',
      slug: 'medicao-e-nivelamento',
    },
  ]

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    })
  }

  console.log('✅ Categorias criadas com sucesso!')
  console.log(`📦 Total de categorias: ${categories.length}`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Erro ao executar seed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
