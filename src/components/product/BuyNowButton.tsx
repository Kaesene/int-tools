'use client'

import { useCart } from '@/contexts/CartContext'
import { Button } from '@/components/ui/Button'
import { useRouter } from 'next/navigation'
import { FiZap } from 'react-icons/fi'
import { useState } from 'react'

interface Product {
  id: number
  name: string
  slug: string
  price: number
  thumbnail: string | null
  stock: number
}

interface BuyNowButtonProps {
  product: Product
  className?: string
}

export function BuyNowButton({ product, className }: BuyNowButtonProps) {
  const { addItem } = useCart()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleBuyNow = async () => {
    if (product.stock === 0) return

    setIsLoading(true)

    // Adiciona ao carrinho
    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      thumbnail: product.thumbnail,
      quantity: 1,
    })

    // Redireciona para o checkout
    router.push('/checkout')
  }

  return (
    <Button
      onClick={handleBuyNow}
      disabled={product.stock === 0 || isLoading}
      isLoading={isLoading}
      className={className}
    >
      <FiZap size={20} />
      {product.stock === 0 ? 'Produto Esgotado' : 'Comprar Agora'}
    </Button>
  )
}
