'use client';

import Link from 'next/link';
import { useState } from 'react';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount] = useState(0);

  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo - Esquerda */}
          <Link href="/" className="text-3xl font-bold text-black hover:text-gray-700 transition-colors flex-shrink-0">
            INT Tools
          </Link>

          {/* Desktop Navigation - Centro */}
          <nav className="hidden lg:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
            <Link href="/" className="text-sm font-semibold text-gray-700 hover:text-black transition-colors whitespace-nowrap">
              Início
            </Link>
            <Link href="/produtos" className="text-sm font-semibold text-gray-700 hover:text-black transition-colors whitespace-nowrap">
              Produtos
            </Link>
            <Link href="/sobre" className="text-sm font-semibold text-gray-700 hover:text-black transition-colors whitespace-nowrap">
              Sobre
            </Link>
            <Link href="/contato" className="text-sm font-semibold text-gray-700 hover:text-black transition-colors whitespace-nowrap">
              Contato
            </Link>
          </nav>

          {/* Icons - Extrema direita */}
          <div className="flex items-center gap-4 sm:gap-6 flex-shrink-0 ml-auto">
            {/* Search Icon */}
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors" aria-label="Buscar">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* User Icon */}
            <Link href="/login" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>

            {/* Cart Icon */}
            <Link href="/carrinho" className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col gap-4">
              <Link href="/" className="text-sm font-medium text-gray-700 hover:text-black transition-colors">
                Início
              </Link>
              <Link href="/produtos" className="text-sm font-medium text-gray-700 hover:text-black transition-colors">
                Produtos
              </Link>
              <Link href="/sobre" className="text-sm font-medium text-gray-700 hover:text-black transition-colors">
                Sobre
              </Link>
              <Link href="/contato" className="text-sm font-medium text-gray-700 hover:text-black transition-colors">
                Contato
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
