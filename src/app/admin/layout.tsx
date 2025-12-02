'use client'

import { AdminAuthProvider } from '@/contexts/AdminAuthContext'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminGuard } from '@/components/admin/AdminGuard'
import { usePathname } from 'next/navigation'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/admin/login'

  if (isLoginPage) {
    return <AdminAuthProvider>{children}</AdminAuthProvider>
  }

  return (
    <AdminAuthProvider>
      <AdminGuard>
        <div className="flex min-h-screen bg-gray-50">
          <AdminSidebar />
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </AdminGuard>
    </AdminAuthProvider>
  )
}
