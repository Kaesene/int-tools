'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useClientAuth } from '@/contexts/ClientAuthContext'
import { FiUser, FiShoppingBag, FiMapPin, FiLogOut } from 'react-icons/fi'

const menuItems = [
  { icon: FiUser, label: 'Meu Perfil', href: '/minha-conta' },
  { icon: FiShoppingBag, label: 'Meus Pedidos', href: '/minha-conta/pedidos' },
  { icon: FiMapPin, label: 'Endereços', href: '/minha-conta/enderecos' },
]

export function ClientSidebar() {
  const pathname = usePathname()
  const { user, signOut } = useClientAuth()

  return (
    <aside className="bg-white rounded-lg border border-gray-200 p-4">
      {/* User Info */}
      <div className="pb-4 mb-4 border-b">
        <p className="text-sm text-gray-500">Olá,</p>
        <p className="font-semibold text-gray-900">
          {user?.user_metadata?.name || user?.email?.split('@')[0]}
        </p>
      </div>

      {/* Menu */}
      <nav>
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-600 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Logout */}
      <button
        onClick={signOut}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors mt-4"
      >
        <FiLogOut size={20} />
        <span>Sair</span>
      </button>
    </aside>
  )
}
