'use client'

import { useState, FormEvent, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Loading } from '@/components/ui/Loading'
import { ImageUpload } from '@/components/admin/ImageUpload'
import { slugify } from '@/lib/utils'
import { FiSave, FiX } from 'react-icons/fi'
import Link from 'next/link'

interface EditProductPageProps {
  params: {
    id: string
  }
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    shortDesc: '',
    price: '',
    oldPrice: '',
    stock: '',
    categoryId: '1',
    brand: '',
    model: '',
    voltage: '',
    power: '',
    warranty: '',
    active: true,
    featured: false,
    // Campos de frete
    shippingWeight: '',
    shippingWidth: '',
    shippingHeight: '',
    shippingLength: '',
  })

  const [images, setImages] = useState<string[]>([])

  useEffect(() => {
    loadProduct()
  }, [params.id])

  const loadProduct = async () => {
    try {
      const response = await fetch(`/api/admin/products/${params.id}`)
      if (!response.ok) throw new Error('Produto não encontrado')

      const product = await response.json()

      setFormData({
        name: product.name || '',
        slug: product.slug || '',
        description: product.description || '',
        shortDesc: product.shortDesc || '',
        price: product.price ? String(product.price) : '',
        oldPrice: product.oldPrice ? String(product.oldPrice) : '',
        stock: String(product.stock || 0),
        categoryId: String(product.categoryId || 1),
        brand: product.brand || '',
        model: product.model || '',
        voltage: product.voltage || '',
        power: product.power || '',
        warranty: product.warranty || '',
        active: product.active ?? true,
        featured: product.featured ?? false,
        // Campos de frete
        shippingWeight: product.shippingWeight ? String(product.shippingWeight).replace('.', ',') : '',
        shippingWidth: product.shippingWidth ? String(product.shippingWidth) : '',
        shippingHeight: product.shippingHeight ? String(product.shippingHeight) : '',
        shippingLength: product.shippingLength ? String(product.shippingLength) : '',
      })
      setImages(product.images || [])
    } catch (err) {
      setError('Erro ao carregar produto')
    } finally {
      setIsLoading(false)
    }
  }

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: slugify(name),
    })
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError('')

    try {
      const response = await fetch(`/api/admin/products/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          oldPrice: formData.oldPrice ? parseFloat(formData.oldPrice) : null,
          stock: parseInt(formData.stock),
          categoryId: parseInt(formData.categoryId),
          images,
          thumbnail: images[0] || null,
          // Converter campos de frete (vírgula para ponto)
          shippingWeight: formData.shippingWeight ? parseFloat(formData.shippingWeight.replace(',', '.')) : null,
          shippingWidth: formData.shippingWidth ? parseInt(formData.shippingWidth) : null,
          shippingHeight: formData.shippingHeight ? parseInt(formData.shippingHeight) : null,
          shippingLength: formData.shippingLength ? parseInt(formData.shippingLength) : null,
        }),
      })

      if (!response.ok) {
        throw new Error('Erro ao atualizar produto')
      }

      router.push('/admin/produtos')
      router.refresh()
    } catch (err) {
      setError('Erro ao atualizar produto. Tente novamente.')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <Loading />
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Editar Produto</h1>
          <p className="text-gray-600 mt-2">Atualize as informações do produto</p>
        </div>
        <Link href="/admin/produtos">
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
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          {/* Basic Info */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Informações Básicas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Input
                  label="Nome do Produto *"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  required
                  placeholder="Ex: Furadeira de Impacto 850W"
                />
              </div>

              <div className="md:col-span-2">
                <Input
                  label="Slug (URL)"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  required
                  placeholder="furadeira-impacto-850w"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição Curta
                </label>
                <input
                  type="text"
                  value={formData.shortDesc}
                  onChange={(e) => setFormData({ ...formData, shortDesc: e.target.value })}
                  maxLength={500}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-gray-900 bg-white"
                  placeholder="Descrição breve para o card do produto"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição Completa
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-gray-900 bg-white"
                  placeholder="Descrição detalhada do produto..."
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Imagens do Produto</h2>
            <ImageUpload images={images} onImagesChange={setImages} maxImages={5} />
            <p className="text-sm text-gray-500 mt-2">
              A primeira imagem será usada como imagem principal do produto
            </p>
          </div>

          {/* Pricing */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Preços e Estoque</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Preço *"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
                placeholder="0.00"
              />

              <Input
                label="Preço Antigo (opcional)"
                type="number"
                step="0.01"
                value={formData.oldPrice}
                onChange={(e) => setFormData({ ...formData, oldPrice: e.target.value })}
                placeholder="0.00"
              />

              <Input
                label="Estoque *"
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                required
                placeholder="0"
              />
            </div>
          </div>

          {/* Shipping Dimensions - CRÍTICO PARA FRETE */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Dimensões para Frete</h2>
              <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">IMPORTANTE</span>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Essas informações são essenciais para o cálculo correto do frete.
              Preencha com as dimensões da embalagem do produto.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Peso (kg) *
                </label>
                <input
                  type="text"
                  value={formData.shippingWeight}
                  onChange={(e) => {
                    // Aceita apenas números e vírgula
                    const value = e.target.value.replace(/[^0-9,]/g, '')
                    setFormData({ ...formData, shippingWeight: value })
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 bg-white"
                  placeholder="0,500"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Ex: 1,5 para 1,5kg</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Largura (cm) *
                </label>
                <input
                  type="number"
                  value={formData.shippingWidth}
                  onChange={(e) => setFormData({ ...formData, shippingWidth: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 bg-white"
                  placeholder="20"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Mínimo: 11cm</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Altura (cm) *
                </label>
                <input
                  type="number"
                  value={formData.shippingHeight}
                  onChange={(e) => setFormData({ ...formData, shippingHeight: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 bg-white"
                  placeholder="15"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Mínimo: 2cm</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comprimento (cm) *
                </label>
                <input
                  type="number"
                  value={formData.shippingLength}
                  onChange={(e) => setFormData({ ...formData, shippingLength: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 bg-white"
                  placeholder="30"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Mínimo: 16cm</p>
              </div>
            </div>
            <div className="mt-3 text-xs text-gray-600 bg-white rounded p-3">
              <strong>Nota:</strong> A soma das dimensões (C+L+A) não pode ultrapassar 200cm.
              Dimensão mínima: 11x2x16cm. Peso máximo: 30kg.
            </div>
          </div>

          {/* Category and Specs */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Categoria e Especificações</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoria *
                </label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-gray-900 bg-white [&>option]:bg-white [&>option]:text-gray-900"
                >
                  <option value="1" className="bg-white text-gray-900">Ferramentas Manuais</option>
                  <option value="2" className="bg-white text-gray-900">Ferramentas Elétricas</option>
                  <option value="3" className="bg-white text-gray-900">Ferramentas de Jardim</option>
                  <option value="4" className="bg-white text-gray-900">Equipamentos de Segurança</option>
                  <option value="5" className="bg-white text-gray-900">Acessórios</option>
                  <option value="6" className="bg-white text-gray-900">Medição e Nivelamento</option>
                </select>
              </div>

              <Input
                label="Marca"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                placeholder="Ex: Bosch, Makita"
              />

              <Input
                label="Modelo"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                placeholder="Ex: GSB 550"
              />

              <Input
                label="Voltagem"
                value={formData.voltage}
                onChange={(e) => setFormData({ ...formData, voltage: e.target.value })}
                placeholder="Ex: 110V, 220V, Bivolt"
              />

              <Input
                label="Potência"
                value={formData.power}
                onChange={(e) => setFormData({ ...formData, power: e.target.value })}
                placeholder="Ex: 850W"
              />

              <Input
                label="Garantia"
                value={formData.warranty}
                onChange={(e) => setFormData({ ...formData, warranty: e.target.value })}
                placeholder="Ex: 12 meses"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Status</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm font-medium text-gray-700">Produto Ativo (visível na loja)</span>
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm font-medium text-gray-700">Produto em Destaque</span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 pt-6 border-t">
            <Button type="submit" isLoading={isSaving} className="flex items-center gap-2">
              <FiSave size={20} />
              {isSaving ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
            <Link href="/admin/produtos">
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
