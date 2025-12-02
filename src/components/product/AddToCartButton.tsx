'use client'

import { useState } from 'react'
import { useCart } from '@/contexts/CartContext'
import { Button } from '@/components/ui/Button'
import { FiShoppingCart, FiCheck } from 'react-icons/fi'

interface AddToCartButtonProps {
  product: {
    id: number
    name: string
    slug: string
    price: number
    thumbnail: string | null
    stock: number
  }
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  className?: string
}

export function AddToCartButton({ product, disabled, size = 'lg', variant = 'primary', className }: AddToCartButtonProps) {
  const { addItem } = useCart()
  const [justAdded, setJustAdded] = useState(false)

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: Number(product.price),
      thumbnail: product.thumbnail,
      stock: product.stock,
    })

    // Feedback visual
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 2000)
  }

  return (
    <Button
      size={size}
      variant={variant}
      onClick={handleAddToCart}
      disabled={disabled || product.stock === 0}
      className={`flex items-center justify-center gap-2 transition-all ${className} ${
        justAdded ? 'bg-green-600 hover:bg-green-700 border-green-600' : ''
      }`}
    >
      {justAdded ? (
        <>
          <FiCheck size={20} />
          Adicionado!
        </>
      ) : (
        <>
          <FiShoppingCart size={20} />
          {product.stock === 0 ? 'Produto Esgotado' : 'Adicionar ao Carrinho'}
        </>
      )}
    </Button>
  )
}
