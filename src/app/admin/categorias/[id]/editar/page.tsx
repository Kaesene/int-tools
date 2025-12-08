'use client'

import { useState, useEffect, FormEvent } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { slugify } from '@/lib/utils'
import { FiSave, FiX, FiUpload } from 'react-icons/fi'
import Link from 'next/link'
import Image from 'next/image'

export default function EditCategoryPage() {
  const router = useRouter()
  const params = useParams()
  const categoryId = params.id as string

  const [isLoading, setIsLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    imageUrl: '',
    isFeatured: false,
    displayOrder: 0,
    active: true,
  })

  useEffect(() => {
    fetchCategory()
  }, [])

  const fetchCategory = async () => {
    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`)
      if (!response.ok) {
        throw new Error('Erro ao carregar categoria')
      }
      const data = await response.json()
      setFormData({
        name: data.name,
        slug: data.slug,
        description: data.description || '',
        imageUrl: data.imageUrl || '',
        isFeatured: data.isFeatured || false,
        displayOrder: data.displayOrder || 0,
        active: data.active ?? true,
      })
    } catch (err) {
      setError('Erro ao carregar categoria')
    } finally {
      setLoading(false)
    }
  }

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: slugify(name),
    })
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError('')

    try {
      const formDataUpload = new FormData()
      formDataUpload.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao fazer upload')
      }

      const data = await response.json()
      setFormData({ ...formData, imageUrl: data.url })
    } catch (error: any) {
      setError(error.message || 'Erro ao fazer upload da imagem')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao atualizar categoria')
      }

      router.push('/admin/categorias')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar categoria. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center text-gray-500">Carregando categoria...</div>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Editar Categoria</h1>
          <p className="text-gray-600 mt-2">Atualize as informações da categoria</p>
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
          <div className="space-y-6">
            {/* Nome e Slug */}
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

            {/* Descrição */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                placeholder="Descrição da categoria (opcional)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Upload de Imagem */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imagem da Categoria
              </label>
              <div className="flex items-center gap-4">
                <label className="cursor-pointer">
                  <div className="px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 transition-colors flex items-center gap-2">
                    <FiUpload size={20} />
                    <span className="text-sm">
                      {uploading ? 'Fazendo upload...' : 'Escolher imagem'}
                    </span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
                {formData.imageUrl && (
                  <div className="relative w-20 h-20 border border-gray-200 rounded-lg overflow-hidden">
                    <Image
                      src={formData.imageUrl}
                      alt="Preview"
                      fill
                      className="object-contain"
                    />
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                PNG, JPG, WEBP ou SVG (máx 2MB)
              </p>
            </div>

            {/* Ordem de Exibição */}
            <Input
              label="Ordem de Exibição"
              type="number"
              value={formData.displayOrder.toString()}
              onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
              placeholder="0"
              helperText="Menor número = aparece primeiro"
            />

            {/* Checkboxes */}
            <div className="space-y-3 pt-4 border-t">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <div>
                  <span className="text-sm font-medium text-gray-900">
                    Exibir em Destaque
                  </span>
                  <p className="text-xs text-gray-500">
                    Aparece no menu superior e na home (máx 5 categorias)
                  </p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <div>
                  <span className="text-sm font-medium text-gray-900">
                    Categoria Ativa
                  </span>
                  <p className="text-xs text-gray-500">
                    Categoria visível no site
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 pt-6 mt-6 border-t">
            <Button type="submit" isLoading={isLoading} className="flex items-center gap-2">
              <FiSave size={20} />
              {isLoading ? 'Salvando...' : 'Salvar Alterações'}
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
