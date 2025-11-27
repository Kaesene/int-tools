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
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation - Ultra Clean */}
      <nav className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo + Nav */}
            <div className="flex items-center gap-12">
              <Link href="/admin" className="flex items-center gap-3">
                <div className="w-8 h-8 bg-black rounded-lg"></div>
                <span className="text-xl font-semibold text-gray-900">INT Tools</span>
              </Link>

              <div className="flex items-center gap-8">
                <NavLink href="/admin" label="Home" />
                <NavLink href="/admin/produtos" label="Produtos" />
                <NavLink href="/admin/categorias" label="Categorias" />
                <NavLink href="/admin/pedidos" label="Pedidos" />
              </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-4">
              <Link
                href="/admin/produtos/novo"
                className="px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
              >
                Novo Produto
              </Link>

              <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                <span className="text-sm font-medium text-gray-700">{session.user.name}</span>
                <form action={async () => {
                  'use server';
                  const { signOut } = await import('@/auth');
                  await signOut();
                }}>
                  <button className="text-sm text-gray-500 hover:text-gray-900">Sair</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="w-full">
        <div className="max-w-7xl mx-auto px-8 py-12">
          {children}
        </div>
      </main>
    </div>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
    >
      {label}
    </Link>
  );
}
