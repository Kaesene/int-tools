import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ImageGallery } from '@/components/product/ImageGallery';

export const dynamic = 'force-dynamic';

async function getProduct(slug: string) {
  return await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product || !product.isActive) {
    notFound();
  }

  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-black">Início</Link>
          <span>/</span>
          <Link href="/produtos" className="hover:text-black">Produtos</Link>
          <span>/</span>
          <span className="text-black">{product.name}</span>
        </div>
      </div>

      {/* Product */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Imagens */}
          <div>
            <ImageGallery
              images={product.images || []}
              productName={product.name}
              discount={discount}
            />
          </div>

          {/* Informações */}
          <div>
            {/* Categoria */}
            <Link
              href={`/categoria/${product.category.slug}`}
              className="text-sm text-gray-600 hover:text-black uppercase tracking-wide"
            >
              {product.category.name}
            </Link>

            {/* Nome */}
            <h1 className="text-4xl font-bold text-gray-900 mt-2 mb-4">
              {product.name}
            </h1>

            {/* Descrição Curta */}
            {product.shortDescription && (
              <p className="text-xl text-gray-600 mb-6">
                {product.shortDescription}
              </p>
            )}

            {/* Preço */}
            <div className="mb-8">
              {product.comparePrice && (
                <div className="text-lg text-gray-400 line-through mb-1">
                  R$ {product.comparePrice.toFixed(2).replace('.', ',')}
                </div>
              )}
              <div className="text-5xl font-bold text-gray-900 mb-2">
                R$ {product.price.toFixed(2).replace('.', ',')}
              </div>
              <div className="text-gray-600">
                ou 10x de R$ {(product.price / 10).toFixed(2).replace('.', ',')} sem juros
              </div>
            </div>

            {/* Estoque */}
            {product.stock > 0 ? (
              <div className="flex items-center gap-2 text-green-600 mb-8">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">
                  {product.stock <= 5 ? `Últimas ${product.stock} unidades!` : 'Em estoque'}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-red-600 mb-8">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Produto esgotado</span>
              </div>
            )}

            {/* Botão Comprar */}
            <button
              disabled={product.stock === 0}
              className="w-full bg-black text-white py-4 px-8 rounded-lg font-medium text-lg hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed mb-4"
            >
              {product.stock === 0 ? 'Produto Esgotado' : 'Adicionar ao Carrinho'}
            </button>

            {/* Descrição Completa */}
            {product.description && (
              <div className="mt-12 pt-8 border-t border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Descrição</h2>
                <div className="text-gray-600 whitespace-pre-line">
                  {product.description}
                </div>
              </div>
            )}

            {/* Informações Extras */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4">Informações do Produto</h3>
              <dl className="space-y-2">
                <div className="flex">
                  <dt className="text-gray-600 w-32">SKU:</dt>
                  <dd className="text-gray-900 font-medium">{product.sku}</dd>
                </div>
                <div className="flex">
                  <dt className="text-gray-600 w-32">Categoria:</dt>
                  <dd className="text-gray-900 font-medium">{product.category.name}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
