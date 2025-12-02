import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/utils'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ProductCard } from '@/components/product/ProductCard'
import { AddToCartButton } from '@/components/product/AddToCartButton'
import { BuyNowButton } from '@/components/product/BuyNowButton'
import {
  FiShoppingCart,
  FiTruck,
  FiShield,
  FiCreditCard,
  FiCheckCircle,
  FiXCircle,
  FiStar,
} from 'react-icons/fi'

interface ProductPageProps {
  params: {
    slug: string
  }
}

async function getProduct(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
    },
  })

  if (!product || !product.active) {
    return null
  }

  return product
}

async function getRelatedProducts(categoryId: number, currentProductId: number) {
  const products = await prisma.product.findMany({
    where: {
      categoryId,
      active: true,
      id: { not: currentProductId },
    },
    take: 4,
    include: {
      category: true,
    },
  })

  return products
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.slug)

  if (!product) {
    notFound()
  }

  const relatedProducts = await getRelatedProducts(product.categoryId, product.id)

  const discount = product.oldPrice
    ? Math.round(
        ((Number(product.oldPrice) - Number(product.price)) / Number(product.oldPrice)) * 100
      )
    : 0

  const stockStatus =
    product.stock === 0
      ? { icon: FiXCircle, text: 'Esgotado', color: 'text-gray-600' }
      : product.stock <= 5
      ? { icon: FiCheckCircle, text: `Apenas ${product.stock} unidades`, color: 'text-warning' }
      : { icon: FiCheckCircle, text: 'Em estoque', color: 'text-success' }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-gray-600">
        <Link href="/" className="hover:text-primary-500">
          Início
        </Link>
        <span className="mx-2">/</span>
        <Link href="/produtos" className="hover:text-primary-500">
          Produtos
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/produtos?categoria=${product.category.slug}`} className="hover:text-primary-500">
          {product.category.name}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{product.name}</span>
      </nav>

      {/* Product Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Image Gallery */}
        <div>
          <div className="bg-gray-100 rounded-lg overflow-hidden mb-4">
            {product.thumbnail ? (
              <img
                src={product.thumbnail}
                alt={product.name}
                className="w-full h-96 object-cover"
              />
            ) : (
              <div className="w-full h-96 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <FiShoppingCart size={64} className="mx-auto mb-4" />
                  <p>Imagem não disponível</p>
                </div>
              </div>
            )}
          </div>

          {/* Additional Images - If available */}
          {product.images && product.images.length > 0 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <div key={index} className="bg-gray-100 rounded overflow-hidden cursor-pointer hover:opacity-75">
                  <img src={image} alt={`${product.name} - ${index + 1}`} className="w-full h-20 object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          {/* Badges */}
          <div className="flex gap-2 mb-4">
            {product.featured && (
              <span className="bg-primary-500 text-white text-xs font-bold px-3 py-1 rounded">
                DESTAQUE
              </span>
            )}
            {discount > 0 && (
              <span className="bg-danger text-white text-xs font-bold px-3 py-1 rounded">
                -{discount}% OFF
              </span>
            )}
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>

          {product.brand && (
            <p className="text-gray-600 mb-4">
              Marca: <span className="font-medium">{product.brand}</span>
              {product.model && <span className="ml-2">| Modelo: {product.model}</span>}
            </p>
          )}

          {/* Price */}
          <div className="border-t border-b py-6 my-6">
            {product.oldPrice && (
              <p className="text-lg text-gray-400 line-through mb-1">
                De: {formatPrice(product.oldPrice)}
              </p>
            )}
            <p className="text-4xl font-bold text-primary-600 mb-2">
              {formatPrice(product.price)}
            </p>
            <p className="text-sm text-gray-600">
              Em até 12x de {formatPrice(Number(product.price) / 12)} sem juros
            </p>
          </div>

          {/* Stock Status */}
          <div className="flex items-center gap-2 mb-6">
            <stockStatus.icon className={stockStatus.color} size={20} />
            <span className={`font-medium ${stockStatus.color}`}>{stockStatus.text}</span>
          </div>

          {/* Short Description */}
          {product.shortDesc && (
            <p className="text-gray-700 mb-6 leading-relaxed">{product.shortDesc}</p>
          )}

          {/* Action Buttons */}
          <div className="mb-6 space-y-3">
            {/* Botão Principal - Comprar Agora */}
            <BuyNowButton
              product={{
                id: product.id,
                name: product.name,
                slug: product.slug,
                price: Number(product.price),
                thumbnail: product.thumbnail,
                stock: product.stock,
              }}
              className="w-full text-lg py-4"
            />

            {/* Botão Secundário - Adicionar ao Carrinho */}
            <AddToCartButton
              product={{
                id: product.id,
                name: product.name,
                slug: product.slug,
                price: Number(product.price),
                thumbnail: product.thumbnail,
                stock: product.stock,
              }}
              className="w-full"
              variant="outline"
            />
          </div>

          {/* Benefits */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <FiTruck className="text-primary-500" size={20} />
              <span>Frete grátis para compras acima de R$ 299</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <FiCreditCard className="text-primary-500" size={20} />
              <span>Parcele em até 12x sem juros no cartão</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <FiShield className="text-primary-500" size={20} />
              <span>
                {product.warranty || 'Garantia do fabricante'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications and Description */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Description */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-4">Descrição do Produto</h2>
          <div className="prose max-w-none">
            {product.description ? (
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            ) : (
              <p className="text-gray-500 italic">Descrição não disponível</p>
            )}
          </div>
        </div>

        {/* Specifications */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Especificações</h2>
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            {product.brand && (
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Marca:</span>
                <span className="font-medium">{product.brand}</span>
              </div>
            )}
            {product.model && (
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Modelo:</span>
                <span className="font-medium">{product.model}</span>
              </div>
            )}
            {product.voltage && (
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Voltagem:</span>
                <span className="font-medium">{product.voltage}</span>
              </div>
            )}
            {product.power && (
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Potência:</span>
                <span className="font-medium">{product.power}</span>
              </div>
            )}
            {product.warranty && (
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Garantia:</span>
                <span className="font-medium">{product.warranty}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">SKU:</span>
              <span className="font-medium text-sm">#{product.id}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Produtos Relacionados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard
                key={relatedProduct.id}
                id={relatedProduct.id}
                name={relatedProduct.name}
                slug={relatedProduct.slug}
                shortDesc={relatedProduct.shortDesc}
                price={relatedProduct.price}
                oldPrice={relatedProduct.oldPrice}
                thumbnail={relatedProduct.thumbnail}
                stock={relatedProduct.stock}
                featured={relatedProduct.featured}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
