'use client';

import Link from 'next/link';
import { useState } from 'react';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount] = useState(0); // TODO: Conectar com estado do carrinho

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      {/* Top Bar */}
      <div className="bg-[var(--primary)] text-white py-2">
        <div className="container mx-auto px-4 text-center text-sm">
          Frete GRÁTIS para compras acima de R$ 299 | WhatsApp: (11) 9999-9999
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] rounded-lg flex items-center justify-center text-white font-bold text-xl transition-transform group-hover:scale-110">
              INT
            </div>
            <span className="text-2xl font-bold text-[var(--foreground)]">
              INT <span className="text-[var(--secondary)]">Tools</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-[var(--foreground)] hover:text-[var(--primary)] transition-colors font-medium">
              Início
            </Link>
            <Link href="/produtos" className="text-[var(--foreground)] hover:text-[var(--primary)] transition-colors font-medium">
              Produtos
            </Link>
            <Link href="/categorias" className="text-[var(--foreground)] hover:text-[var(--primary)] transition-colors font-medium">
              Categorias
            </Link>
            <Link href="/sobre" className="text-[var(--foreground)] hover:text-[var(--primary)] transition-colors font-medium">
              Sobre
            </Link>
            <Link href="/contato" className="text-[var(--foreground)] hover:text-[var(--primary)] transition-colors font-medium">
              Contato
            </Link>
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-4">
            {/* Search Icon */}
            <button className="p-2 hover:bg-[var(--gray-100)] rounded-full transition-colors" aria-label="Buscar">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* User Icon */}
            <button className="p-2 hover:bg-[var(--gray-100)] rounded-full transition-colors" aria-label="Minha conta">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>

            {/* Cart Icon */}
            <Link href="/carrinho" className="relative p-2 hover:bg-[var(--gray-100)] rounded-full transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[var(--secondary)] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 hover:bg-[var(--gray-100)] rounded-full transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-[var(--gray-200)] pt-4">
            <div className="flex flex-col gap-4">
              <Link href="/" className="text-[var(--foreground)] hover:text-[var(--primary)] transition-colors font-medium">
                Início
              </Link>
              <Link href="/produtos" className="text-[var(--foreground)] hover:text-[var(--primary)] transition-colors font-medium">
                Produtos
              </Link>
              <Link href="/categorias" className="text-[var(--foreground)] hover:text-[var(--primary)] transition-colors font-medium">
                Categorias
              </Link>
              <Link href="/sobre" className="text-[var(--foreground)] hover:text-[var(--primary)] transition-colors font-medium">
                Sobre
              </Link>
              <Link href="/contato" className="text-[var(--foreground)] hover:text-[var(--primary)] transition-colors font-medium">
                Contato
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
