'use client'

import Link from 'next/link'

export function SimpleHeader() {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4">
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

          {/* Back to home */}
          <Link
            href="/"
            className="text-sm text-gray-600 hover:text-primary-500 transition-colors"
          >
            Voltar para a loja
          </Link>
        </div>
      </div>
    </header>
  )
}
