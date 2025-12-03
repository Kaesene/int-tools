import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi'
import { Button } from '@/components/ui/Button'
import { DeleteCategoryButton } from '@/components/admin/DeleteCategoryButton'

export const dynamic = 'force-dynamic'

async function getCategories() {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: {
          products: true,
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
  })

  return categories
}

export default async function AdminCategoriesPage() {
  const categories = await getCategories()

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categorias</h1>
          <p className="text-gray-600 mt-2">{categories.length} categorias cadastradas</p>
        </div>
        <Link href="/admin/categorias/nova">
          <Button className="flex items-center gap-2">
            <FiPlus size={20} />
            Nova Categoria
          </Button>
        </Link>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div key={category.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-900">{category.name}</h3>
                <p className="text-sm text-gray-500 mt-1">Slug: {category.slug}</p>
                <p className="text-sm text-gray-600 mt-2">
                  {category._count.products} {category._count.products === 1 ? 'produto' : 'produtos'}
                </p>
              </div>
              {category.imageUrl && (
                <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden ml-4">
                  <img
                    src={category.imageUrl}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-4 border-t">
              <Link href={`/admin/categorias/${category.id}/editar`} className="flex-1">
                <Button variant="outline" size="sm" className="w-full flex items-center justify-center gap-2">
                  <FiEdit size={16} />
                  Editar
                </Button>
              </Link>
              <DeleteCategoryButton
                categoryId={category.id}
                categoryName={category.name}
                productCount={category._count.products}
              />
            </div>
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <p className="text-gray-500 mb-4">Nenhuma categoria cadastrada</p>
          <Link href="/admin/categorias/nova">
            <Button>Criar Primeira Categoria</Button>
          </Link>
        </div>
      )}
    </div>
  )
}
