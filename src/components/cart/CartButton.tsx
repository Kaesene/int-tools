'use client'

import { useCart } from '@/contexts/CartContext'
import Link from 'next/link'
import { FiShoppingCart } from 'react-icons/fi'

export function CartButton() {
  const { totalItems } = useCart()

  return (
    <Link
      href="/carrinho"
      className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
    >
      <FiShoppingCart size={24} className="text-gray-700" />
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {totalItems > 9 ? '9+' : totalItems}
        </span>
      )}
    </Link>
  )
}
