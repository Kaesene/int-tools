import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
import { FiShoppingCart } from 'react-icons/fi'

interface ProductCardProps {
  id: number
  name: string
  slug: string
  shortDesc: string | null
  price: string | number
  oldPrice?: string | number | null
  thumbnail?: string | null
  stock: number
  featured?: boolean
}

export function ProductCard({
  id,
  name,
  slug,
  shortDesc,
  price,
  oldPrice,
  thumbnail,
  stock,
  featured,
}: ProductCardProps) {
  const discount = oldPrice
    ? Math.round(((Number(oldPrice) - Number(price)) / Number(oldPrice)) * 100)
    : 0

  return (
    <Link href={`/produtos/${slug}`}>
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
        {/* Image */}
        <div className="relative bg-white border-b border-gray-200 h-48 flex items-center justify-center">
          {thumbnail ? (
            <img src={thumbnail} alt={name} className="w-full h-full object-contain p-2" />
          ) : (
            <div className="text-gray-400 text-center p-4">
              <FiShoppingCart size={48} className="mx-auto mb-2" />
              <span className="text-sm">Sem imagem</span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-2">
            {featured && (
              <span className="bg-primary-500 text-white text-xs font-bold px-2 py-1 rounded">
                DESTAQUE
              </span>
            )}
            {discount > 0 && (
              <span className="bg-danger text-white text-xs font-bold px-2 py-1 rounded">
                -{discount}%
              </span>
            )}
          </div>

          {/* Stock Badge */}
          {stock <= 5 && stock > 0 && (
            <div className="absolute top-2 right-2">
              <span className="bg-warning text-white text-xs font-bold px-2 py-1 rounded">
                Últimas unidades
              </span>
            </div>
          )}
          {stock === 0 && (
            <div className="absolute top-2 right-2">
              <span className="bg-gray-600 text-white text-xs font-bold px-2 py-1 rounded">
                Esgotado
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-primary-500 transition-colors">
            {name}
          </h3>

          {shortDesc && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-1">
              {shortDesc}
            </p>
          )}

          {/* Price */}
          <div className="mt-auto">
            {oldPrice && (
              <p className="text-sm text-gray-400 line-through">
                {formatPrice(oldPrice)}
              </p>
            )}
            <p className="text-2xl font-bold text-primary-600">
              {formatPrice(price)}
            </p>

            {stock > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                Em estoque: {stock} {stock === 1 ? 'unidade' : 'unidades'}
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
