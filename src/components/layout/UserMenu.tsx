'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useClientAuth } from '@/contexts/ClientAuthContext'
import { FiUser, FiShoppingBag, FiLogOut, FiChevronDown } from 'react-icons/fi'

export function UserMenu() {
  const { user, signOut } = useClientAuth()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!user) {
    return (
      <Link
        href="/login"
        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-primary-500 transition-colors"
      >
        <FiUser size={22} />
        <span className="hidden lg:block">Entrar</span>
      </Link>
    )
  }

  const userName = user.user_metadata?.name || user.email?.split('@')[0] || 'Usuário'

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-primary-500 transition-colors"
      >
        <FiUser size={22} />
        <span className="hidden lg:block">{userName}</span>
        <FiChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          <div className="px-4 py-2 border-b">
            <p className="text-sm font-semibold text-gray-900">{userName}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>

          <Link
            href="/minha-conta"
            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            onClick={() => setIsOpen(false)}
          >
            <FiUser size={18} />
            Meu Perfil
          </Link>

          <Link
            href="/minha-conta/pedidos"
            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            onClick={() => setIsOpen(false)}
          >
            <FiShoppingBag size={18} />
            Meus Pedidos
          </Link>

          <div className="border-t my-2"></div>

          <button
            onClick={() => {
              signOut()
              setIsOpen(false)
            }}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            <FiLogOut size={18} />
            Sair
          </button>
        </div>
      )}
    </div>
  )
}
