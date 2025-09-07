import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state') || '/dashboard'
  const error = searchParams.get('error')
  
  if (error) {
    return NextResponse.redirect(new URL(`/auth/login?error=${error}`, request.url))
  }
  
  if (code) {
    // For now, just redirect to dashboard with a session cookie
    const response = NextResponse.redirect(new URL(state, request.url))
    response.cookies.set('auth0_session', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 // 24 hours
    })
    return response
  }
  
  return NextResponse.redirect(new URL('/auth/login', request.url))
}
