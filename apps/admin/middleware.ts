import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes that are public (no auth required)
const publicRoutes = ['/auth/login', '/logout-success', '/api/auth/callback', '/api/auth/logout', '/logout']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for public routes
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // All other routes require authentication

  // Check authentication
  const sessionCookie = request.cookies.get('auth0_session')
  const userIdCookie = request.cookies.get('user_id')

  if (sessionCookie?.value !== 'authenticated' || !userIdCookie?.value) {
    return NextResponse.redirect(new URL('/api/auth/login?action=login', request.url))
  }

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
