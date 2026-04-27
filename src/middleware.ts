import { NextResponse, NextRequest } from 'next/server';
export function middleware(request: NextRequest) {
  const tokenValue = request.cookies.get('auth_token')?.value;
  const token = (tokenValue === 'undefined' || tokenValue === 'null') ? null : tokenValue;
  const { pathname } = request.nextUrl;

  // Define protected routes
  const isProtectedRoute = pathname.startsWith('/dashboard') || 
                           (pathname.startsWith('/student') && 
                            !pathname.startsWith('/student/login') && 
                            !pathname.startsWith('/student/verify'));
  
  // Define auth routes (login/register)
  const isAuthRoute = pathname === '/login' || pathname === '/register';

  if (isProtectedRoute && !token) {
    // Redirect to login if trying to access protected route without token
    // If it's a student route, we should probably redirect to /student/login if we have context, 
    // but for now the user asked to fix the verify link redirection.
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
