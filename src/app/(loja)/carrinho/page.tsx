'use client'

import { useCart } from '@/contexts/CartContext'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { FiTrash2, FiMinus, FiPlus, FiShoppingCart, FiArrowRight } from 'react-icons/fi'

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart()

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <FiShoppingCart size={80} className="mx-auto text-gray-300 mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Carrinho Vazio</h1>
          <p className="text-gray-600 mb-8">
            Você ainda não adicionou nenhum produto ao carrinho
          </p>
          <Link href="/produtos">
            <Button size="lg" className="inline-flex items-center gap-2">
              Ver Produtos
              <FiArrowRight size={20} />
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Carrinho de Compras</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg border border-gray-200 p-4 flex gap-4"
            >
              {/* Product Image */}
              <Link href={`/produtos/${item.slug}`} className="flex-shrink-0">
                {item.thumbnail ? (
                  <img
                    src={item.thumbnail}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                    <FiShoppingCart className="text-gray-400" size={32} />
                  </div>
                )}
              </Link>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <Link
                  href={`/produtos/${item.slug}`}
                  className="text-lg font-semibold text-gray-900 hover:text-primary-500 line-clamp-2"
                >
                  {item.name}
                </Link>
                <p className="text-primary-600 font-bold text-xl mt-1">
                  {formatPrice(item.price)}
                </p>

                {/* Quantity Controls */}
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                      disabled={item.quantity <= 1}
                    >
                      <FiMinus size={16} />
                    </button>
                    <span className="w-12 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                      disabled={item.quantity >= item.stock}
                    >
                      <FiPlus size={16} />
                    </button>
                  </div>

                  <span className="text-sm text-gray-500">
                    {item.stock <= 5 && `Apenas ${item.stock} disponíveis`}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col items-end justify-between">
                <p className="text-lg font-bold text-gray-900">
                  {formatPrice(item.price * item.quantity)}
                </p>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded transition-colors"
                  title="Remover"
                >
                  <FiTrash2 size={20} />
                </button>
              </div>
            </div>
          ))}

          {/* Clear Cart */}
          <button
            onClick={clearCart}
            className="text-sm text-gray-600 hover:text-red-600 transition-colors"
          >
            Limpar Carrinho
          </button>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Resumo do Pedido</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({items.length} {items.length === 1 ? 'item' : 'itens'})</span>
                <span className="font-medium">{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Frete</span>
                <span className="text-sm text-green-600 font-medium">
                  {totalPrice >= 299 ? 'GRÁTIS' : 'Calcular no checkout'}
                </span>
              </div>
              {totalPrice < 299 && (
                <p className="text-xs text-gray-500">
                  Falta {formatPrice(299 - totalPrice)} para frete grátis
                </p>
              )}
            </div>

            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-primary-600">
                  {formatPrice(totalPrice)}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Em até 12x de {formatPrice(totalPrice / 12)} sem juros
              </p>
            </div>

            <Link href="/checkout">
              <Button size="lg" className="w-full flex items-center justify-center gap-2 mb-3">
                Finalizar Compra
                <FiArrowRight size={20} />
              </Button>
            </Link>

            <Link href="/produtos">
              <Button variant="outline" size="lg" className="w-full">
                Continuar Comprando
              </Button>
            </Link>

            {/* Security Badge */}
            <div className="mt-6 pt-6 border-t">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 1l6 3v5c0 5-6 9-6 9s-6-4-6-9V4l6-3zm0 2.236L5 5.618v3.764c0 3.5 4 6.5 5 7.236 1-.736 5-3.736 5-7.236V5.618L10 3.236z" clipRule="evenodd"/>
                </svg>
                <span>Compra 100% Segura</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
