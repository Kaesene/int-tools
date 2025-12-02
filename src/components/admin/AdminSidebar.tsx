'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAdminAuth } from '@/contexts/AdminAuthContext'
import {
  FiHome,
  FiPackage,
  FiShoppingBag,
  FiUsers,
  FiSettings,
  FiLogOut,
  FiGrid,
  FiTool,
} from 'react-icons/fi'

const menuItems = [
  { icon: FiHome, label: 'Dashboard', href: '/admin' },
  { icon: FiPackage, label: 'Produtos', href: '/admin/produtos' },
  { icon: FiGrid, label: 'Categorias', href: '/admin/categorias' },
  { icon: FiShoppingBag, label: 'Pedidos', href: '/admin/pedidos' },
  { icon: FiUsers, label: 'Clientes', href: '/admin/clientes' },
  { icon: FiTool, label: 'Setup Storage', href: '/admin/setup' },
  { icon: FiSettings, label: 'Configurações', href: '/admin/configuracoes' },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const { logout, adminUser } = useAdminAuth()

  return (
    <aside className="w-64 bg-secondary-900 text-white min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-secondary-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">INT</span>
          </div>
          <div>
            <h1 className="font-bold text-lg">INT TOOLS</h1>
            <p className="text-xs text-gray-400">Painel Admin</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
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
                      ? 'bg-primary-500 text-white'
                      : 'text-gray-300 hover:bg-secondary-800 hover:text-white'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-secondary-800">
        <div className="mb-3 px-4 py-2">
          <p className="text-sm font-medium text-white">{adminUser?.name}</p>
          <p className="text-xs text-gray-400">{adminUser?.email}</p>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-secondary-800 hover:text-white transition-colors"
        >
          <FiLogOut size={20} />
          <span className="font-medium">Sair</span>
        </button>
      </div>
    </aside>
  )
}
