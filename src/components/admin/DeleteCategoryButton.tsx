'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FiTrash2, FiAlertTriangle } from 'react-icons/fi'
import { Button } from '@/components/ui/Button'

interface DeleteCategoryButtonProps {
  categoryId: number
  categoryName: string
  productCount: number
}

export function DeleteCategoryButton({ categoryId, categoryName, productCount }: DeleteCategoryButtonProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)

    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Erro ao deletar categoria')
      }

      router.refresh()
      setShowConfirm(false)
    } catch (error) {
      alert('Erro ao deletar categoria. Tente novamente.')
    } finally {
      setIsDeleting(false)
    }
  }

  if (showConfirm) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <FiAlertTriangle className="text-red-600" size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900">Confirmar Exclusão</h3>
              <p className="text-sm text-gray-600">Esta ação não pode ser desfeita</p>
            </div>
          </div>

          <p className="text-gray-700 mb-2">
            Tem certeza que deseja deletar a categoria <strong>{categoryName}</strong>?
          </p>

          {productCount > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4">
              <p className="text-sm text-yellow-800">
                <strong>Atenção:</strong> Esta categoria possui {productCount} produto(s). Eles ficarão sem categoria.
              </p>
            </div>
          )}

          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => setShowConfirm(false)}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              isLoading={isDeleting}
            >
              {isDeleting ? 'Deletando...' : 'Sim, Deletar'}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Button
      onClick={() => setShowConfirm(true)}
      variant="outline"
      size="sm"
      className="text-red-600 hover:text-red-900 border-red-200 hover:border-red-300"
    >
      <FiTrash2 size={16} />
    </Button>
  )
}
