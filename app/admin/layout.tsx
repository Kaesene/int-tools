import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Top Navigation - Horizontal */}
      <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
        <div className="max-w-[1800px] mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo + Nav Links */}
            <div className="flex items-center gap-8">
              {/* Logo */}
              <Link href="/admin" className="flex items-center gap-3 group">
                <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">INT Tools</h1>
                </div>
              </Link>

              {/* Navigation Tabs */}
              <div className="hidden md:flex items-center gap-1">
                <NavLink href="/admin" label="Dashboard" icon="dashboard" />
                <NavLink href="/admin/produtos" label="Produtos" icon="products" />
                <NavLink href="/admin/categorias" label="Categorias" icon="categories" />
                <NavLink href="/admin/pedidos" label="Pedidos" icon="orders" />
              </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4">
              {/* Quick Actions */}
              <Link
                href="/admin/produtos/novo"
                className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg text-sm font-semibold"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Novo Produto
              </Link>

              {/* User Menu */}
              <div className="flex items-center gap-3">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-semibold text-gray-700">{session.user.name}</p>
                </div>
                <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-white text-xs font-bold">
                    {session.user.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Logout */}
              <form action={async () => {
                'use server';
                const { signOut } = await import('@/auth');
                await signOut();
              }}>
                <button
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  title="Sair"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content - Full Width */}
      <main className="max-w-[1800px] mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
}

// Nav Link Component
function NavLink({ href, label, icon }: { href: string; label: string; icon: string }) {
  return (
    <Link
      href={href}
      className="relative px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-all group"
    >
      <span>{label}</span>
      {/* Active indicator */}
      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
    </Link>
  );
}
