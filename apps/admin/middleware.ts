import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes that require authentication
const protectedRoutes = ['/dashboard', '/fleet', '/organizations', '/bus-types', '/routes', '/profile', '/search']

// Routes that are public (no auth required)
const publicRoutes = ['/auth/login', '/onboarding', '/logout-success']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for public routes
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  // Check if route requires authentication
  const requiresAuth = protectedRoutes.some(route => pathname.startsWith(route))
  
  if (!requiresAuth) {
    return NextResponse.next()
  }

  // Check authentication
  const sessionCookie = request.cookies.get('auth0_session')
  const userIdCookie = request.cookies.get('user_id')

  if (sessionCookie?.value !== 'authenticated' || !userIdCookie?.value) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // For now, let the individual pages handle onboarding checks
  // This is because middleware can't easily access the database
  // and we want to avoid complex async operations in middleware

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
