import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check for the NextAuth session token cookie. 
  // It handles both secure (__Secure-authjs.session-token) and insecure (authjs.session-token) environments.
  const token = request.cookies.get('authjs.session-token')?.value || request.cookies.get('__Secure-authjs.session-token')?.value;

  const currentPath = request.nextUrl.pathname;
  
  // Define routes that do not require authentication
  const isPublicRoute = currentPath === '/' || currentPath === '/login' || currentPath.startsWith('/api/auth');

  if (!token && !isPublicRoute) {
    // If there is no token and the user is trying to access a protected route, redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (token && (currentPath === '/' || currentPath === '/login')) {
    // If the user has a token and is on the splash or login page, bounce them straight to the dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// Ensure the middleware only runs on actual UI application routes, not static files
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
};
