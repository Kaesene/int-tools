import { prisma } from '@/lib/prisma';
import { ProductCardHome } from '@/components/product/ProductCardHome';

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
                <ProductCardHome key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
