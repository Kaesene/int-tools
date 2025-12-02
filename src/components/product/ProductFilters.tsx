'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { FiSearch, FiX } from 'react-icons/fi'

interface Category {
  id: number
  name: string
  slug: string
}

interface ProductFiltersProps {
  categories: Category[]
  currentCategory?: string
  currentSearch?: string
  currentSort?: string
  currentMinPrice?: string
  currentMaxPrice?: string
}

export function ProductFilters({
  categories,
  currentCategory,
  currentSearch,
  currentSort,
  currentMinPrice,
  currentMaxPrice,
}: ProductFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [search, setSearch] = useState(currentSearch || '')
  const [minPrice, setMinPrice] = useState(currentMinPrice || '')
  const [maxPrice, setMaxPrice] = useState(currentMaxPrice || '')

  // Update local state when URL changes
  useEffect(() => {
    setSearch(currentSearch || '')
    setMinPrice(currentMinPrice || '')
    setMaxPrice(currentMaxPrice || '')
  }, [currentSearch, currentMinPrice, currentMaxPrice])

  const buildUrl = (params: Record<string, string | undefined>) => {
    const newParams = new URLSearchParams()

    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value)
      }
    })

    const queryString = newParams.toString()
    return queryString ? `/produtos?${queryString}` : '/produtos'
  }

  const handleCategoryClick = (categorySlug: string) => {
    const url = buildUrl({
      categoria: categorySlug === currentCategory ? undefined : categorySlug,
      busca: currentSearch,
      ordenar: currentSort,
      minPreco: currentMinPrice,
      maxPreco: currentMaxPrice,
    })
    router.push(url)
  }

  const handleSortChange = (sort: string) => {
    const url = buildUrl({
      categoria: currentCategory,
      busca: currentSearch,
      ordenar: sort,
      minPreco: currentMinPrice,
      maxPreco: currentMaxPrice,
    })
    router.push(url)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const url = buildUrl({
      categoria: currentCategory,
      busca: search,
      ordenar: currentSort,
      minPreco: currentMinPrice,
      maxPreco: currentMaxPrice,
    })
    router.push(url)
  }

  const handlePriceFilter = () => {
    const url = buildUrl({
      categoria: currentCategory,
      busca: currentSearch,
      ordenar: currentSort,
      minPreco: minPrice,
      maxPreco: maxPrice,
    })
    router.push(url)
  }

  const handleClearFilters = () => {
    setSearch('')
    setMinPrice('')
    setMaxPrice('')
    router.push('/produtos')
  }

  const hasActiveFilters = currentCategory || currentSearch || currentMinPrice || currentMaxPrice || (currentSort && currentSort !== 'relevancia')

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-3">Buscar</h3>
        <form onSubmit={handleSearchSubmit}>
          <div className="relative">
            <Input
              type="text"
              placeholder="Nome, marca, modelo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pr-10"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-500"
            >
              <FiSearch size={20} />
            </button>
          </div>
        </form>
      </div>

      {/* Sort */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-3">Ordenar por</h3>
        <div className="space-y-2">
          {[
            { value: 'relevancia', label: 'Relevância' },
            { value: 'menor-preco', label: 'Menor Preço' },
            { value: 'maior-preco', label: 'Maior Preço' },
            { value: 'nome-a-z', label: 'Nome A-Z' },
            { value: 'nome-z-a', label: 'Nome Z-A' },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => handleSortChange(option.value)}
              className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                (currentSort || 'relevancia') === option.value
                  ? 'bg-primary-50 text-primary-600 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-3">Categorias</h3>
        <div className="space-y-2">
          <button
            onClick={() => handleCategoryClick('')}
            className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
              !currentCategory
                ? 'bg-primary-50 text-primary-600 font-medium'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            Todas as Categorias
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.slug)}
              className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                currentCategory === category.slug
                  ? 'bg-primary-50 text-primary-600 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-3">Faixa de Preço</h3>
        <div className="space-y-3">
          <Input
            type="number"
            placeholder="Preço mínimo"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            min="0"
            step="0.01"
          />
          <Input
            type="number"
            placeholder="Preço máximo"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            min="0"
            step="0.01"
          />
          <Button
            onClick={handlePriceFilter}
            className="w-full"
            size="sm"
            variant="secondary"
          >
            Aplicar Filtro
          </Button>
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <Button
            onClick={handleClearFilters}
            className="w-full flex items-center justify-center gap-2"
            variant="outline"
            size="sm"
          >
            <FiX size={16} />
            Limpar Filtros
          </Button>
        </div>
      )}
    </div>
  )
}
