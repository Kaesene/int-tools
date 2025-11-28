import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isAdmin = req.auth?.user?.role === 'ADMIN';
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin');
  const isAdminLoginPage = req.nextUrl.pathname.startsWith('/admin-login');

  // Protege rotas do admin (exceto página de login)
  if (isAdminRoute && !isAdminLoginPage && (!isLoggedIn || !isAdmin)) {
    return NextResponse.redirect(new URL('/admin-login', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
