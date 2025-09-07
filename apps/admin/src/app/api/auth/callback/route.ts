import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state') || '/dashboard'
  const error = searchParams.get('error')
  
    if (error) {
      return NextResponse.redirect(new URL(`/api/auth/login?action=login&error=${error}`, request.url))
    }
  
  if (code) {
    try {
      // Exchange code for access token
      const tokenResponse = await fetch(`https://${process.env.AUTH0_DOMAIN}/oauth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          grant_type: 'authorization_code',
          client_id: process.env.AUTH0_CLIENT_ID,
          client_secret: process.env.AUTH0_CLIENT_SECRET,
          code: code,
          redirect_uri: `${process.env.AUTH0_BASE_URL}/api/auth/callback`
        })
      })

      if (!tokenResponse.ok) {
        throw new Error('Failed to exchange code for token')
      }

      const tokenData = await tokenResponse.json()
      const accessToken = tokenData.access_token

      // Get user info from Auth0
      const userResponse = await fetch(`https://${process.env.AUTH0_DOMAIN}/userinfo`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })

      if (!userResponse.ok) {
        throw new Error('Failed to get user info')
      }

      const userInfo = await userResponse.json()
      
      // Extract user ID from Auth0 user info
      const userId = userInfo.sub || userInfo.user_id || `auth0_${Date.now()}`
      const userEmail = userInfo.email || 'user@example.com'
      const userName = userInfo.name || userInfo.nickname || 'User'

      // Redirect to dashboard with session cookies
      const response = NextResponse.redirect(new URL(state, request.url))
      response.cookies.set('auth0_session', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 // 24 hours
      })
      response.cookies.set('user_id', userId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 // 24 hours
      })
      response.cookies.set('user_email', userEmail, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 // 24 hours
      })
      response.cookies.set('user_name', userName, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 // 24 hours
      })
      
      return response
    } catch (error) {
      console.error('Auth0 callback error:', error)
      // Redirect to login with error if Auth0 fails
      return NextResponse.redirect(new URL(`/api/auth/login?action=login&error=auth_failed`, request.url))
    }
  }
  
  return NextResponse.redirect(new URL('/api/auth/login?action=login', request.url))
}