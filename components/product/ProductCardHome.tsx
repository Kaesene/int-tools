'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { useState } from 'react';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice: number | null;
  stock: number;
  images: string[];
  category: {
    name: string;
  };
}

interface ProductCardHomeProps {
  product: Product;
}

export function ProductCardHome({ product }: ProductCardHomeProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsAdding(true);
    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      price: product.price,
      slug: product.slug,
      stock: product.stock,
      image: product.images[0] || null,
    });

    setTimeout(() => setIsAdding(false), 1500);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      price: product.price,
      slug: product.slug,
      stock: product.stock,
      image: product.images[0] || null,
    });

    router.push('/checkout');
  };

  return (
    <div className="group border border-gray-200 rounded-lg overflow-hidden hover:border-black transition-colors">
      <Link href={`/produto/${product.slug}`}>
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
      </Link>

      {/* Content */}
      <div className="p-4">
        <Link href={`/produto/${product.slug}`}>
          {/* Category */}
          <span className="text-xs text-gray-500 uppercase tracking-wide">
            {product.category.name}
          </span>

          {/* Name */}
          <h3 className="font-semibold text-lg mt-1 mb-2 line-clamp-2 group-hover:text-gray-600 transition-colors">
            {product.name}
          </h3>

          {/* Price */}
          <div className="mt-auto mb-4">
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
        </Link>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            className="flex-1 bg-white border-2 border-black text-black py-2 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            disabled={product.stock === 0 || isAdding}
            onClick={handleAddToCart}
          >
            {isAdding ? (
              <span className="flex items-center justify-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                OK
              </span>
            ) : product.stock === 0 ? (
              'Esgotado'
            ) : (
              '+ Carrinho'
            )}
          </button>
          <button
            className="flex-1 bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            disabled={product.stock === 0}
            onClick={handleBuyNow}
          >
            Comprar
          </button>
        </div>
      </div>
    </div>
  );
}
