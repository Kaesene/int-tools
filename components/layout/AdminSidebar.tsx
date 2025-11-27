'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const links = [
    {
      href: '/admin',
      label: 'Dashboard',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1v-2zM14 12a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1v-7z" />
        </svg>
      ),
    },
    {
      href: '/admin/produtos',
      label: 'Produtos',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
    },
    {
      href: '/admin/categorias',
      label: 'Categorias',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
      ),
    },
    {
      href: '/admin/pedidos',
      label: 'Pedidos',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
    },
  ];

  return (
    <aside
      className={`${
        collapsed ? 'w-20' : 'w-72'
      } bg-white border-r border-gray-200 min-h-screen flex flex-col transition-all duration-300 ease-in-out relative`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-8 w-6 h-6 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-200 z-10 shadow-sm"
      >
        <svg
          className={`w-3 h-3 text-gray-600 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Logo */}
      <div className={`p-6 border-b border-gray-100 ${collapsed ? 'px-4' : ''}`}>
        <Link href="/admin" className="flex items-center gap-3 group">
          <div className="w-11 h-11 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 flex-shrink-0 group-hover:scale-105">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
            </svg>
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <h1 className="text-gray-900 font-bold text-lg tracking-tight whitespace-nowrap">INT Tools</h1>
              <p className="text-gray-500 text-xs whitespace-nowrap">Admin Panel</p>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <div key={link.href} className="relative group/item">
                <Link
                  href={link.href}
                  className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 relative ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-200'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-indigo-600'
                  } ${collapsed ? 'justify-center' : ''}`}
                >
                  <div className={`flex-shrink-0 ${isActive ? 'scale-110' : ''} transition-transform duration-200`}>
                    {link.icon}
                  </div>
                  {!collapsed && (
                    <span className="text-sm font-semibold whitespace-nowrap">{link.label}</span>
                  )}
                  {isActive && !collapsed && (
                    <div className="absolute right-4 w-1.5 h-1.5 bg-white rounded-full"></div>
                  )}
                </Link>

                {/* Tooltip on hover when collapsed */}
                {collapsed && (
                  <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-3 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg opacity-0 invisible group-hover/item:opacity-100 group-hover/item:visible transition-all duration-200 whitespace-nowrap z-50 shadow-xl">
                    {link.label}
                    <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>

      {/* Footer - Store Link */}
      <div className={`p-4 border-t border-gray-100 ${collapsed ? 'px-4' : ''}`}>
        <div className="relative group/item">
          <Link
            href="/"
            target="_blank"
            className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-200 ${
              collapsed ? 'justify-center' : ''
            }`}
          >
            <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            {!collapsed && <span className="text-sm font-semibold whitespace-nowrap">Visitar Loja</span>}
          </Link>

          {/* Tooltip when collapsed */}
          {collapsed && (
            <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-3 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg opacity-0 invisible group-hover/item:opacity-100 group-hover/item:visible transition-all duration-200 whitespace-nowrap z-50 shadow-xl">
              Visitar Loja
              <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
