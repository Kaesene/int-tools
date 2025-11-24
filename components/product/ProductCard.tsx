import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const hasDiscount = product.comparePrice && product.comparePrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.comparePrice! - product.price) / product.comparePrice!) * 100)
    : 0;

  return (
    <Link href={`/produto/${product.slug}`} className="group">
      <div className="bg-white rounded-lg border border-[var(--gray-200)] hover:border-[var(--primary)] transition-all duration-300 hover:shadow-lg overflow-hidden h-full flex flex-col">
        {/* Image */}
        <div className="relative aspect-square bg-[var(--gray-100)] overflow-hidden">
          {product.images && product.images.length > 0 ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[var(--gray-400)]">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}

          {/* Badges */}
          {hasDiscount && (
            <div className="absolute top-2 right-2 bg-[var(--secondary)] text-white px-2 py-1 rounded-md text-sm font-bold">
              -{discountPercent}%
            </div>
          )}
          {product.stock === 0 && (
            <div className="absolute top-2 left-2 bg-[var(--gray-800)] text-white px-2 py-1 rounded-md text-sm font-bold">
              Esgotado
            </div>
          )}
          {product.stock > 0 && product.stock <= 5 && (
            <div className="absolute top-2 left-2 bg-[var(--warning)] text-white px-2 py-1 rounded-md text-sm font-bold">
              Últimas unidades
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-grow">
          {/* Category */}
          {product.category && (
            <span className="text-xs text-[var(--primary)] font-medium mb-1">
              {product.category}
            </span>
          )}

          {/* Name */}
          <h3 className="text-base font-semibold text-[var(--foreground)] mb-2 line-clamp-2 group-hover:text-[var(--primary)] transition-colors">
            {product.name}
          </h3>

          {/* Description */}
          {product.shortDescription && (
            <p className="text-sm text-[var(--gray-600)] mb-3 line-clamp-2 flex-grow">
              {product.shortDescription}
            </p>
          )}

          {/* Rating */}
          {product.rating && product.reviewCount && (
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating!)
                        ? 'text-[var(--warning)]'
                        : 'text-[var(--gray-300)]'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-xs text-[var(--gray-500)]">
                ({product.reviewCount})
              </span>
            </div>
          )}

          {/* Price */}
          <div className="mt-auto">
            {hasDiscount && (
              <div className="text-sm text-[var(--gray-500)] line-through mb-1">
                R$ {product.comparePrice!.toFixed(2).replace('.', ',')}
              </div>
            )}
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-[var(--primary)]">
                R$ {product.price.toFixed(2).replace('.', ',')}
              </span>
              <span className="text-sm text-[var(--gray-500)]">
                ou 10x de R$ {(product.price / 10).toFixed(2).replace('.', ',')}
              </span>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            className="mt-4 w-full bg-[var(--primary)] text-white py-2 rounded-lg hover:bg-[var(--primary-dark)] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={product.stock === 0}
            onClick={(e) => {
              e.preventDefault();
              // TODO: Adicionar ao carrinho
              console.log('Adicionar ao carrinho:', product.id);
            }}
          >
            {product.stock === 0 ? 'Esgotado' : 'Adicionar ao Carrinho'}
          </button>
        </div>
      </div>
    </Link>
  );
}
