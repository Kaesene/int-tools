'use client'

import { usePathname } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { SimpleHeader } from '@/components/layout/SimpleHeader'
import { Footer } from '@/components/layout/Footer'
import { CartProvider } from '@/contexts/CartContext'
import { ClientAuthProvider } from '@/contexts/ClientAuthContext'

export default function LojaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/login'

  return (
    <ClientAuthProvider>
      <CartProvider>
        <div className="min-h-screen flex flex-col bg-white">
          {isLoginPage ? <SimpleHeader /> : <Header />}
          <main className="flex-1 bg-white">
            {children}
          </main>
          <Footer />
        </div>
      </CartProvider>
    </ClientAuthProvider>
  )
}
