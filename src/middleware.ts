import { NextResponse, NextRequest } from 'next/server';
export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const { pathname } = request.nextUrl;

  // Define protected routes
  const isProtectedRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/student');
  // Define auth routes (login/register)
  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/register');

  if (isProtectedRoute && !token) {
    // Redirect to login if trying to access protected route without token
    const url = new URL('/login', request.url);
    return NextResponse.redirect(url);
  }

  if (isAuthRoute && token) {
    // Redirect to dashboard if trying to access login/register with valid token
    // We assume /student or /dashboard based on some logic, but for now /dashboard
    const url = new URL('/dashboard', request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/student/:path*', '/login', '/register'],
};
