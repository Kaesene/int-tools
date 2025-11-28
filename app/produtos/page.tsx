import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

async function getProducts() {
  return await prisma.product.findMany({
    where: { isActive: true },
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  });
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-black py-16">
        <div className="w-full px-6 flex justify-center">
          <div className="w-full flex flex-col items-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 !text-white text-center">Produtos</h1>
            <p className="text-xl !text-gray-300 text-center">
              Confira nossa seleção de ferramentas e tecnologia importada
            </p>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="w-full px-6 py-12">
        <div className="max-w-7xl mx-auto">
          {products.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📦</div>
              <p className="text-gray-600 text-lg">
                Nenhum produto disponível no momento
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/produto/${product.slug}`}
                className="group border border-gray-200 rounded-lg overflow-hidden hover:border-black transition-colors"
              >
                {/* Image */}
                <div className="relative aspect-square bg-gray-100">
                  {product.images && product.images.length > 0 ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}

                  {/* Badges */}
                  {product.comparePrice && product.comparePrice > product.price && (
                    <div className="absolute top-2 right-2 bg-black text-white px-2 py-1 rounded text-xs font-bold">
                      -{Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}%
                    </div>
                  )}
                  {product.stock === 0 && (
                    <div className="absolute top-2 left-2 bg-gray-800 text-white px-2 py-1 rounded text-xs font-bold">
                      Esgotado
                    </div>
                  )}
                  {product.stock > 0 && product.stock <= 5 && (
                    <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-bold">
                      Últimas unidades
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  {/* Category */}
                  <span className="text-xs text-gray-500 uppercase tracking-wide">
                    {product.category.name}
                  </span>

                  {/* Name */}
                  <h3 className="font-semibold text-lg mt-1 mb-2 line-clamp-2 group-hover:text-gray-600 transition-colors">
                    {product.name}
                  </h3>

                  {/* Price */}
                  <div className="mt-auto">
                    {product.comparePrice && (
                      <div className="text-sm text-gray-400 line-through mb-1">
                        R$ {product.comparePrice.toFixed(2).replace('.', ',')}
                      </div>
                    )}
                    <div className="text-2xl font-bold">
                      R$ {product.price.toFixed(2).replace('.', ',')}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      ou 10x de R$ {(product.price / 10).toFixed(2).replace('.', ',')}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
