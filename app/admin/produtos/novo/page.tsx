'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ImageUpload } from '@/components/admin/ImageUpload';

interface Category {
  id: string;
  name: string;
}

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    shortDescription: '',
    price: '',
    comparePrice: '',
    sku: '',
    stock: '',
    categoryId: '',
    isActive: true,
  });

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          comparePrice: formData.comparePrice ? parseFloat(formData.comparePrice) : null,
          stock: parseInt(formData.stock),
          images: images,
        }),
      });

      if (response.ok) {
        router.push('/admin/produtos');
        router.refresh();
      } else {
        const error = await response.json();
        alert(error.error || 'Erro ao criar produto');
      }
    } catch (error) {
      alert('Erro ao criar produto');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="p-2 text-gray-600 hover:text-gray-900 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Novo Produto</h1>
            <p className="text-gray-600 text-base mt-2">Adicione um novo produto ao catálogo</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 border border-gray-200 hover:border-gray-900 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-black hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Salvando...' : 'Salvar Produto'}
          </button>
        </div>
      </div>

      {/* Layout linear único */}
      <div className="space-y-6">
          {/* Card: Informações básicas */}
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-8">Informações Básicas</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-base font-semibold text-gray-700 mb-3">
                  Nome do Produto <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      name: e.target.value,
                      slug: generateSlug(e.target.value),
                    });
                  }}
                  className="w-full px-4 py-3 text-base border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors"
                  placeholder="Ex: Camiseta Básica Preta"
                />
              </div>

              <div>
                <label className="block text-base font-semibold text-gray-700 mb-3">
                  Descrição
                </label>
                <textarea
                  rows={6}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 text-base border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors resize-none"
                  placeholder="Descreva os detalhes, características e benefícios do produto..."
                />
              </div>
            </div>
          </div>

          {/* Card: Mídia */}
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900">Imagens do Produto</h2>
              <p className="text-base text-gray-500 mt-2">Até 5 imagens - A primeira será a imagem principal</p>
            </div>
            <ImageUpload
              images={images}
              onChange={setImages}
              maxImages={5}
            />
          </div>

          {/* Card: Preços */}
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-8">Preços</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-base font-semibold text-gray-700 mb-3">
                  Preço de Venda <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base font-medium text-gray-600">R$</span>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 text-base border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors"
                    placeholder="0,00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-base font-semibold text-gray-700 mb-3">
                  Preço Comparado
                  <span className="ml-1 text-sm font-normal text-gray-500">(opcional)</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base font-medium text-gray-600">R$</span>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.comparePrice}
                    onChange={(e) => setFormData({ ...formData, comparePrice: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 text-base border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors"
                    placeholder="0,00"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card: Estoque */}
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-8">Estoque e SKU</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-base font-semibold text-gray-700 mb-3">
                  Código SKU <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  className="w-full px-4 py-3 text-base font-mono border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors"
                  placeholder="ABC-123-XYZ"
                />
              </div>

              <div>
                <label className="block text-base font-semibold text-gray-700 mb-3">
                  Quantidade <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="w-full px-4 py-3 text-base border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Card: Organização e Status */}
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-8">Organização e Status</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-base font-semibold text-gray-700 mb-3">
                  Categoria <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full px-4 py-3 text-base border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 bg-white transition-colors"
                >
                  <option value="">Selecione uma categoria</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-base font-semibold text-gray-700 mb-3">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.isActive ? 'active' : 'draft'}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'active' })}
                  className="w-full px-4 py-3 text-base border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 bg-white transition-colors"
                >
                  <option value="active">Ativo (visível na loja)</option>
                  <option value="draft">Rascunho (oculto)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Card: SEO */}
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-8">SEO</h2>
            <div>
              <label className="block text-base font-semibold text-gray-700 mb-3">
                URL do Produto <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-4 py-3 text-base font-mono border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors"
                placeholder="produto-exemplo"
              />
              <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-sm font-mono text-gray-600 break-all">
                  int-tools.vercel.app/produto/{formData.slug || 'url'}
                </p>
              </div>
            </div>
          </div>
      </div>
    </form>
  );
}
