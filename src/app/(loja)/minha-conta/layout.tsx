'use client'

import { ClientGuard } from '@/components/client/ClientGuard'
import { ClientSidebar } from '@/components/client/ClientSidebar'

export default function MinhaContaLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClientGuard>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Minha Conta</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <ClientSidebar />
          </div>
          <div className="lg:col-span-3">
            {children}
          </div>
        </div>
      </div>
    </ClientGuard>
  )
}
