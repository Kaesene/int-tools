import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import type { Product, Category } from '@prisma/client';
import { ProductCardHome } from '@/components/product/ProductCardHome';

export const dynamic = 'force-dynamic';

type ProductWithCategory = Product & {
  category: Category;
};

async function getProducts(): Promise<ProductWithCategory[]> {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
      take: 8,
    });
    return products;
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    return [];
  }
}

export default async function Home() {
  const products = await getProducts();

  return (
    <div className="min-h-screen">
      {/* Hero Section - Simples e Clean */}
      <section className="bg-black py-24 md:py-40">
        <div className="w-full px-6 flex justify-center">
          <div className="w-full flex flex-col items-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-8 !text-white text-center">
              INT Tools
            </h1>
            <p className="text-2xl md:text-3xl !text-white font-light text-center">
              Ferramentas e Tecnologia Importada
            </p>
            {products.length === 0 && (
              <p className="text-gray-300 text-lg mt-6 text-center">
                Em breve, novos produtos disponíveis
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20 bg-white">
        <div className="w-full px-6">
          <div className="w-full flex flex-col items-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-center">Produtos</h2>
            {products.length > 0 && (
              <Link href="/produtos" className="inline-block text-base font-semibold text-black hover:text-gray-600 border-b-2 border-black hover:border-gray-600 transition-colors pb-1 text-center">
                Ver todos os produtos →
              </Link>
            )}
          </div>

          <div className="max-w-7xl mx-auto">
            {products.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">📦</div>
                <p className="text-gray-600 text-lg mb-4">
                  Nenhum produto cadastrado ainda
                </p>
                <p className="text-gray-400 text-sm mb-6">
                  Use o painel administrativo para adicionar produtos
                </p>
                <Link
                  href="/api/seed"
                  target="_blank"
                  className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Adicionar Produtos de Teste
                </Link>
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
      </section>
    </div>
  );
}
