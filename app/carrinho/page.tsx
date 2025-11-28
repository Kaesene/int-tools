'use client';

import { useCart } from '@/contexts/CartContext';
import Image from 'next/image';
import Link from 'next/link';

export default function CarrinhoPage() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-8">Carrinho de Compras</h1>

          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold mb-4">Seu carrinho está vazio</h2>
            <p className="text-gray-600 mb-8">
              Adicione produtos ao carrinho para continuar comprando
            </p>
            <Link
              href="/produtos"
              className="inline-block bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              Ver Produtos
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Carrinho de Compras</h1>
          <button
            onClick={clearCart}
            className="text-sm text-gray-600 hover:text-red-600 transition-colors"
          >
            Limpar carrinho
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de Produtos */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.productId}
                className="bg-white rounded-lg shadow p-6 flex gap-6"
              >
                {/* Imagem */}
                <Link href={`/produto/${item.slug}`} className="flex-shrink-0">
                  <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden relative">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/produto/${item.slug}`}
                    className="font-semibold text-lg hover:text-gray-600 transition-colors block mb-2"
                  >
                    {item.name}
                  </Link>

                  <div className="text-2xl font-bold mb-4">
                    R$ {item.price.toFixed(2).replace('.', ',')}
                  </div>

                  {/* Quantidade */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="px-4 py-2 hover:bg-gray-100 transition-colors"
                        disabled={item.quantity <= 1}
                      >
                        −
                      </button>
                      <span className="px-4 py-2 border-x border-gray-300 min-w-[60px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="px-4 py-2 hover:bg-gray-100 transition-colors"
                        disabled={item.quantity >= item.stock}
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.productId)}
                      className="text-sm text-red-600 hover:text-red-700 transition-colors ml-auto"
                    >
                      Remover
                    </button>
                  </div>

                  {item.quantity >= item.stock && (
                    <p className="text-sm text-yellow-600 mt-2">
                      Quantidade máxima em estoque
                    </p>
                  )}
                </div>

                {/* Subtotal */}
                <div className="text-right">
                  <div className="text-sm text-gray-600 mb-1">Subtotal</div>
                  <div className="text-xl font-bold">
                    R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Resumo do Pedido */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-6">Resumo do Pedido</h2>

              <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>R$ {totalPrice.toFixed(2).replace('.', ',')}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Frete</span>
                  <span className="text-sm">Calculado no checkout</span>
                </div>
              </div>

              <div className="flex justify-between text-xl font-bold mb-6">
                <span>Total</span>
                <span>R$ {totalPrice.toFixed(2).replace('.', ',')}</span>
              </div>

              <Link
                href="/checkout"
                className="block w-full bg-black text-white text-center py-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors mb-4"
              >
                Finalizar Compra
              </Link>

              <Link
                href="/produtos"
                className="block w-full text-center py-3 text-sm text-gray-600 hover:text-black transition-colors"
              >
                ← Continuar Comprando
              </Link>

              {/* Parcelamento */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600 text-center">
                  ou até 10x de{' '}
                  <span className="font-semibold text-black">
                    R$ {(totalPrice / 10).toFixed(2).replace('.', ',')}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
