'use client'

import { useState } from 'react'
import { FiStar } from 'react-icons/fi'
import { useRouter } from 'next/navigation'

interface FeaturedToggleProps {
  categoryId: number
  isFeatured: boolean
  categoryName: string
}

export function FeaturedToggle({ categoryId, isFeatured, categoryName }: FeaturedToggleProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleToggle = async () => {
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/admin/categories/${categoryId}/toggle-featured`, {
        method: 'POST',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao atualizar')
      }

      router.refresh()
    } catch (err: any) {
      setError(err.message)
      // Mostrar erro por 3 segundos
      setTimeout(() => setError(''), 3000)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative">
      <button
        onClick={handleToggle}
        disabled={isLoading}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
          isFeatured
            ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        title={isFeatured ? 'Remover de destaque' : 'Marcar como destaque'}
      >
        <FiStar
          size={16}
          className={isFeatured ? 'fill-yellow-500 text-yellow-500' : ''}
        />
        <span>{isLoading ? 'Atualizando...' : isFeatured ? 'Em Destaque' : 'Destaque'}</span>
      </button>

      {error && (
        <div className="absolute top-full left-0 mt-2 bg-red-50 border border-red-200 rounded-lg p-2 text-xs text-red-800 whitespace-nowrap z-10 shadow-lg">
          {error}
        </div>
      )}
    </div>
  )
}
