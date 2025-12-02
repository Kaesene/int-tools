'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FiSearch } from 'react-icons/fi'
import { CartButton } from '@/components/cart/CartButton'
import { UserMenu } from '@/components/layout/UserMenu'

export function Header() {
  const router = useRouter()
  const [searchDesktop, setSearchDesktop] = useState('')
  const [searchMobile, setSearchMobile] = useState('')

  const handleSearch = (search: string) => {
    if (search.trim()) {
      router.push(`/produtos?busca=${encodeURIComponent(search.trim())}`)
    } else {
      router.push('/produtos')
    }
  }

  const handleDesktopSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch(searchDesktop)
  }

  const handleMobileSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch(searchMobile)
  }

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">INT</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">INT TOOLS</h1>
              <p className="text-xs text-gray-500">Ferramentas Profissionais</p>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleDesktopSubmit} className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Buscar produtos..."
                value={searchDesktop}
                onChange={(e) => setSearchDesktop(e.target.value)}
                className="w-full px-4 py-2.5 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
              <button type="submit" className="absolute left-3 top-3.5 text-gray-400 hover:text-primary-500">
                <FiSearch size={20} />
              </button>
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <UserMenu />
            <CartButton />
          </div>
        </div>

        {/* Search Bar - Mobile */}
        <form onSubmit={handleMobileSubmit} className="md:hidden pb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar produtos..."
              value={searchMobile}
              onChange={(e) => setSearchMobile(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
            <button type="submit" className="absolute left-3 top-3 text-gray-400 hover:text-primary-500">
              <FiSearch size={18} />
            </button>
          </div>
        </form>

        {/* Categories Nav */}
        <nav className="border-t border-gray-200 py-3">
          <ul className="flex gap-6 overflow-x-auto">
            <li>
              <Link href="/produtos" className="text-sm font-medium text-gray-700 hover:text-primary-500 whitespace-nowrap">
                Todos os Produtos
              </Link>
            </li>
            <li>
              <Link href="/categorias/ferramentas-manuais" className="text-sm text-gray-600 hover:text-primary-500 whitespace-nowrap">
                Ferramentas Manuais
              </Link>
            </li>
            <li>
              <Link href="/categorias/ferramentas-eletricas" className="text-sm text-gray-600 hover:text-primary-500 whitespace-nowrap">
                Ferramentas Elétricas
              </Link>
            </li>
            <li>
              <Link href="/categorias/equipamentos-de-seguranca" className="text-sm text-gray-600 hover:text-primary-500 whitespace-nowrap">
                Segurança
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
