'use client';

import { useCart } from '@/contexts/CartContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    price: number;
    slug: string;
    stock: number;
    images: string[];
  };
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      price: product.price,
      slug: product.slug,
      stock: product.stock,
      image: product.images[0] || null,
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNow = () => {
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

  if (product.stock === 0) {
    return (
      <button
        disabled
        className="w-full bg-gray-300 text-gray-600 py-4 px-8 rounded-lg font-medium text-lg cursor-not-allowed mb-4"
      >
        Produto Esgotado
      </button>
    );
  }

  return (
    <div className="flex gap-4 mb-4">
      <button
        onClick={handleAddToCart}
        className="flex-1 bg-white border-2 border-black text-black py-4 px-8 rounded-lg font-medium text-lg hover:bg-gray-50 transition-colors"
      >
        {isAdded ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Adicionado!
          </span>
        ) : (
          'Adicionar ao Carrinho'
        )}
      </button>
      <button
        onClick={handleBuyNow}
        className="flex-1 bg-black text-white py-4 px-8 rounded-lg font-medium text-lg hover:bg-gray-800 transition-colors"
      >
        Comprar Agora
      </button>
    </div>
  );
}
