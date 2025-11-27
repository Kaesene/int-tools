import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import AdminSidebar from '@/components/layout/AdminSidebar';

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
    <div className="flex min-h-screen bg-[#f7f7f7]">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Container */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 h-14 flex items-center px-6 sticky top-0 z-10">
          <div className="flex items-center justify-between w-full">
            {/* Search - pode adicionar depois */}
            <div className="flex-1"></div>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {session.user.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {session.user.name}
                </span>
              </div>

              <div className="w-px h-6 bg-gray-300"></div>

              <form action={async () => {
                'use server';
                const { signOut } = await import('@/auth');
                await signOut();
              }}>
                <button className="text-sm text-gray-600 hover:text-gray-900 font-medium">
                  Sair
                </button>
              </form>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-[1400px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
