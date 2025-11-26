'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ImageUpload } from '@/components/admin/ImageUpload';

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  shortDescription: string | null;
  price: number;
  comparePrice: number | null;
  images: string[];
  sku: string;
  stock: number;
  isActive: boolean;
  categoryId: string;
}

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
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
    Promise.all([
      fetch(`/api/products/${id}`).then((res) => res.json()),
      fetch('/api/categories').then((res) => res.json()),
    ]).then(([productData, categoriesData]) => {
      setProduct(productData);
      setCategories(categoriesData);
      setImages(productData.images || []);
      setFormData({
        name: productData.name,
        slug: productData.slug,
        description: productData.description || '',
        shortDescription: productData.shortDescription || '',
        price: productData.price.toString(),
        comparePrice: productData.comparePrice?.toString() || '',
        sku: productData.sku,
        stock: productData.stock.toString(),
        categoryId: productData.categoryId,
        isActive: productData.isActive,
      });
    });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
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
        alert(error.error || 'Erro ao atualizar produto');
      }
    } catch (error) {
      alert('Erro ao atualizar produto');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;

    setDeleting(true);
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/admin/produtos');
        router.refresh();
      } else {
        alert('Erro ao excluir produto');
      }
    } catch (error) {
      alert('Erro ao excluir produto');
    } finally {
      setDeleting(false);
    }
  };

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Editar Produto</h1>
        <p className="text-gray-600 mt-2">Atualize as informações do produto</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nome */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Produto *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
            />
          </div>

          {/* Slug */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Slug (URL) *</label>
            <input
              type="text"
              required
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
            />
          </div>

          {/* Descrição Curta */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Descrição Curta</label>
            <input
              type="text"
              value={formData.shortDescription}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
            />
          </div>

          {/* Descrição */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Descrição Completa</label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
            />
          </div>

          {/* Categoria */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Categoria *</label>
            <select
              required
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
            >
              <option value="">Selecione...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* SKU */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">SKU *</label>
            <input
              type="text"
              required
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
            />
          </div>

          {/* Preço */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Preço (R$) *</label>
            <input
              type="number"
              step="0.01"
              required
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
            />
          </div>

          {/* Preço Comparação */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Preço Anterior (R$)</label>
            <input
              type="number"
              step="0.01"
              value={formData.comparePrice}
              onChange={(e) => setFormData({ ...formData, comparePrice: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
            />
          </div>

          {/* Estoque */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Estoque *</label>
            <input
              type="number"
              required
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
            />
          </div>

          {/* Imagens */}
          <div className="md:col-span-2">
            <ImageUpload
              images={images}
              onChange={setImages}
              maxImages={5}
            />
          </div>

          {/* Status */}
          <div className="md:col-span-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
              />
              <span className="text-sm font-medium text-gray-700">Produto ativo</span>
            </label>
          </div>
        </div>

        {/* Botões */}
        <div className="flex justify-between mt-6 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            {deleting ? 'Excluindo...' : 'Excluir Produto'}
          </button>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 disabled:opacity-50"
            >
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
