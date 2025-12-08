import { prisma } from '@/lib/prisma'
import { ProductCard } from '@/components/product/ProductCard'
import { ProductFiltersWrapper } from '@/components/product/ProductFiltersWrapper'

export const metadata = {
  title: 'Produtos | INT Tools',
  description: 'Confira nosso catálogo completo de ferramentas profissionais',
}

interface SearchParams {
  categoria?: string
  busca?: string
  ordenar?: string
  minPreco?: string
  maxPreco?: string
}

interface ProdutosPageProps {
  searchParams: SearchParams
}

async function getProducts(searchParams: SearchParams) {
  const {
    categoria,
    busca,
    ordenar = 'relevancia',
    minPreco,
    maxPreco,
  } = searchParams

  // Build where clause
  const where: any = {
    active: true,
  }

  if (categoria) {
    where.category = {
      slug: categoria,
    }
  }

  if (busca) {
    where.OR = [
      { name: { contains: busca, mode: 'insensitive' } },
      { description: { contains: busca, mode: 'insensitive' } },
      { brand: { contains: busca, mode: 'insensitive' } },
    ]
  }

  if (minPreco || maxPreco) {
    where.price = {}
    if (minPreco) where.price.gte = parseFloat(minPreco)
    if (maxPreco) where.price.lte = parseFloat(maxPreco)
  }

  // Build orderBy clause
  let orderBy: any = []
  switch (ordenar) {
    case 'menor-preco':
      orderBy = [{ price: 'asc' }]
      break
    case 'maior-preco':
      orderBy = [{ price: 'desc' }]
      break
    case 'nome-a-z':
      orderBy = [{ name: 'asc' }]
      break
    case 'nome-z-a':
      orderBy = [{ name: 'desc' }]
      break
    default:
      orderBy = [{ featured: 'desc' }, { createdAt: 'desc' }]
  }

  const products = await prisma.product.findMany({
    where,
    include: {
      category: true,
    },
    orderBy,
  })

  return products
}

async function getCategories() {
  const categories = await prisma.category.findMany({
    orderBy: {
      name: 'asc',
    },
  })
  return categories
}

export default async function ProdutosPage({ searchParams }: ProdutosPageProps) {
  const products = await getProducts(searchParams)
  const categories = await getCategories()

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {searchParams.categoria
              ? categories.find(c => c.slug === searchParams.categoria)?.name || 'Produtos'
              : searchParams.busca
              ? `Resultados para "${searchParams.busca}"`
              : 'Todos os Produtos'
            }
          </h1>
          <p className="text-gray-600">
            {products.length} {products.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
          </p>
        </div>

        {/* Filters and Products */}
        <div className="lg:grid lg:grid-cols-4 gap-6">
          {/* Filters - Mobile (Drawer) + Desktop (Sidebar) */}
          <div className="lg:col-span-1">
            <ProductFiltersWrapper
              categories={categories}
              currentCategory={searchParams.categoria}
              currentSearch={searchParams.busca}
              currentSort={searchParams.ordenar}
              currentMinPrice={searchParams.minPreco}
              currentMaxPrice={searchParams.maxPreco}
            />
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    slug={product.slug}
                    shortDesc={product.shortDesc}
                    price={product.price}
                    oldPrice={product.oldPrice}
                    thumbnail={product.thumbnail}
                    stock={product.stock}
                    featured={product.featured}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg p-16 text-center">
                <p className="text-gray-500 text-lg mb-2">Nenhum produto encontrado</p>
                <p className="text-gray-400 text-sm">Tente ajustar os filtros ou fazer uma nova busca</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
