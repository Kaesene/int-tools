'use client'

import { useState } from 'react'
import { FiFilter, FiX } from 'react-icons/fi'
import { ProductFilters } from './ProductFilters'

interface Category {
  id: number
  name: string
  slug: string
}

interface ProductFiltersWrapperProps {
  categories: Category[]
  currentCategory?: string
  currentSearch?: string
  currentSort?: string
  currentMinPrice?: string
  currentMaxPrice?: string
}

export function ProductFiltersWrapper({
  categories,
  currentCategory,
  currentSearch,
  currentSort,
  currentMinPrice,
  currentMaxPrice,
}: ProductFiltersWrapperProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Botão Flutuante Mobile */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-40 bg-primary-500 text-white p-4 rounded-full shadow-lg hover:bg-primary-600 transition-all flex items-center gap-2"
      >
        <FiFilter size={24} />
        <span className="font-medium">Filtros</span>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer Mobile */}
      <div
        className={`lg:hidden fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-gray-50 z-50 transform transition-transform duration-300 overflow-y-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header do Drawer */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between z-10">
          <h2 className="text-lg font-semibold text-gray-900">Filtros</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Conteúdo do Drawer */}
        <div className="p-4">
          <ProductFilters
            categories={categories}
            currentCategory={currentCategory}
            currentSearch={currentSearch}
            currentSort={currentSort}
            currentMinPrice={currentMinPrice}
            currentMaxPrice={currentMaxPrice}
          />
        </div>
      </div>

      {/* Desktop - Sempre Visível */}
      <div className="hidden lg:block">
        <ProductFilters
          categories={categories}
          currentCategory={currentCategory}
          currentSearch={currentSearch}
          currentSort={currentSort}
          currentMinPrice={currentMinPrice}
          currentMaxPrice={currentMaxPrice}
        />
      </div>
    </>
  )
}
