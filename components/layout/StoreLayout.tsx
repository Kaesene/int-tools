'use client';

import { usePathname } from 'next/navigation';
import { Header } from './Header';
import { Footer } from './Footer';
import { ProfileAlert } from './ProfileAlert';

export function StoreLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <ProfileAlert />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </>
  );
}
