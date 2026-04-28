import { NextResponse, NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const tokenValue = request.cookies.get('auth_token')?.value;
  const token = (tokenValue === 'undefined' || tokenValue === 'null') ? null : tokenValue;
  const { pathname } = request.nextUrl;

  // Define protected routes (Admin only)
  // Student routes are protected via client-side logic to avoid redirection issues
  const isProtectedRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/super-admin');
  
  // Define auth routes (login/register)
  const isAuthRoute = pathname === '/login' || pathname === '/register';

  if (isProtectedRoute && !token) {
    // Redirect to login if trying to access protected route without token
    const url = new URL('/login', request.url);
    return NextResponse.redirect(url);
  }

  if (isAuthRoute && token) {
    // Redirect to dashboard if trying to access login/register with valid token
    const url = new URL('/dashboard', request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/super-admin/:path*', '/login', '/register'],
};
