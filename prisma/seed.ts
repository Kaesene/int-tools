import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // Criar categorias iniciais
  const categories = [
    {
      name: 'Ferramentas Manuais',
      slug: 'ferramentas-manuais',
      imageUrl: null,
    },
    {
      name: 'Ferramentas Elétricas',
      slug: 'ferramentas-eletricas',
      imageUrl: null,
    },
    {
      name: 'Ferramentas de Jardim',
      slug: 'ferramentas-de-jardim',
      imageUrl: null,
    },
    {
      name: 'Equipamentos de Segurança',
      slug: 'equipamentos-de-seguranca',
      imageUrl: null,
    },
    {
      name: 'Acessórios',
      slug: 'acessorios',
      imageUrl: null,
    },
    {
      name: 'Medição e Nivelamento',
      slug: 'medicao-e-nivelamento',
      imageUrl: null,
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
