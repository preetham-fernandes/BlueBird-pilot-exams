// src/middleware.ts
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isAuth = !!token;
  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || 
                     request.nextUrl.pathname.startsWith('/register');
                     
  // Check for admin routes
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');
  const isAdmin = token?.role === 'admin';

  // Redirect unauthenticated users to login
  if (!isAuth && !isAuthPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redirect authenticated users from login/register to dashboard
  if (isAuth && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Protect admin routes
  if (isAdminRoute && !isAdmin) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// Specify which paths should trigger this middleware
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/practice/:path*',
    '/mock-tests/:path*',
    '/profile/:path*',
    '/login',
    '/register',
  ],
};