import { NextResponse, NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const tokenValue = request.cookies.get('auth_token')?.value;
  const token = (tokenValue === 'undefined' || tokenValue === 'null') ? null : tokenValue;
  
  const voterTokenValue = request.cookies.get('voter_session_token')?.value;
  const voterToken = (voterTokenValue === 'undefined' || voterTokenValue === 'null') ? null : voterTokenValue;

  const { pathname } = request.nextUrl;

  // Define protected routes (Admin only)
  const isAdminRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/super-admin');
  
  // Define student routes
  const isStudentAuthRoute = pathname.startsWith('/student/login') || pathname.startsWith('/student/verify');
  const isStudentProtectedRoute = pathname.startsWith('/student') && !isStudentAuthRoute;

  // Define auth routes (login/register)
  const isAuthRoute = pathname === '/login' || pathname === '/register';

  // 1. Admin Auth Guard
  if (isAdminRoute && !token) {
    const url = new URL('/login', request.url);
    return NextResponse.redirect(url);
  }

  // 2. Student Auth Guard
  if (isStudentProtectedRoute && !voterToken) {
    const url = new URL('/student/login', request.url);
    // Persist election/assoc params if present
    url.search = request.nextUrl.search;
    return NextResponse.redirect(url);
  }

  // 3. Prevent logged in users from seeing auth pages
  if (isAuthRoute && token) {
    const url = new URL('/dashboard', request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/super-admin/:path*', '/student/:path*', '/login', '/register'],
};
