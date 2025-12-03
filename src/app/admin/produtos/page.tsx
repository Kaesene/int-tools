import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'
import { FiPlus, FiEdit, FiAlertCircle, FiCheckCircle, FiXCircle } from 'react-icons/fi'
import { Button } from '@/components/ui/Button'

export const dynamic = 'force-dynamic'
import { DeleteProductButton } from '@/components/admin/DeleteProductButton'

async function getProducts() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return products
}

export default async function AdminProductsPage() {
  const products = await getProducts()

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Produtos</h1>
          <p className="text-gray-600 mt-2">{products.length} produtos cadastrados</p>
        </div>
        <Link href="/admin/produtos/novo">
          <Button className="flex items-center gap-2">
            <FiPlus size={20} />
            Novo Produto
          </Button>
        </Link>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Produto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoria
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Preço
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estoque
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 bg-gray-100 rounded">
                        {product.thumbnail ? (
                          <img
                            src={product.thumbnail}
                            alt={product.name}
                            className="h-10 w-10 rounded object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded bg-gray-200"></div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">SKU: #{product.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{product.category.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{formatPrice(product.price)}</div>
                    {product.oldPrice && (
                      <div className="text-xs text-gray-500 line-through">{formatPrice(product.oldPrice)}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {product.stock === 0 ? (
                        <FiXCircle className="text-red-500" size={16} />
                      ) : product.stock <= 5 ? (
                        <FiAlertCircle className="text-yellow-500" size={16} />
                      ) : (
                        <FiCheckCircle className="text-green-500" size={16} />
                      )}
                      <span className="text-sm text-gray-900">{product.stock} un.</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        product.active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {product.active ? 'Ativo' : 'Inativo'}
                    </span>
                    {product.featured && (
                      <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary-100 text-primary-800">
                        Destaque
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/produtos/${product.id}/editar`}>
                        <button className="text-primary-600 hover:text-primary-900 p-2 hover:bg-primary-50 rounded transition-colors">
                          <FiEdit size={18} />
                        </button>
                      </Link>
                      <DeleteProductButton productId={product.id} productName={product.name} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Nenhum produto cadastrado ainda</p>
            <Link href="/admin/produtos/novo">
              <Button>Criar Primeiro Produto</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
