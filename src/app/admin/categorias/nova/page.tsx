'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { slugify } from '@/lib/utils'
import { FiSave, FiX } from 'react-icons/fi'
import Link from 'next/link'

export default function NewCategoryPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
  })

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: slugify(name),
    })
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Erro ao criar categoria')
      }

      router.push('/admin/categorias')
      router.refresh()
    } catch (err) {
      setError('Erro ao criar categoria. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nova Categoria</h1>
          <p className="text-gray-600 mt-2">Adicione uma nova categoria de produtos</p>
        </div>
        <Link href="/admin/categorias">
          <Button variant="outline">
            <FiX size={20} className="mr-2" />
            Cancelar
          </Button>
        </Link>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-lg shadow-sm p-6 max-w-2xl">
          <div className="space-y-4">
            <Input
              label="Nome da Categoria *"
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              required
              placeholder="Ex: Ferramentas Elétricas"
            />

            <Input
              label="Slug (URL)"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              required
              placeholder="ferramentas-eletricas"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 pt-6 mt-6 border-t">
            <Button type="submit" isLoading={isLoading} className="flex items-center gap-2">
              <FiSave size={20} />
              {isLoading ? 'Salvando...' : 'Salvar Categoria'}
            </Button>
            <Link href="/admin/categorias">
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </Link>
          </div>
        </div>
      </form>
    </div>
  )
}
