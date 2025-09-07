import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action') || 'login'
  
  const auth0Domain = process.env.AUTH0_DOMAIN
  const clientId = process.env.AUTH0_CLIENT_ID
  const baseURL = process.env.AUTH0_BASE_URL
  const audience = process.env.AUTH0_AUDIENCE
  
  if (!auth0Domain || !clientId || !baseURL) {
    return NextResponse.json({ error: 'Auth0 configuration missing' }, { status: 500 })
  }
  
  if (action === 'login') {
    const returnTo = searchParams.get('returnTo') || '/dashboard'
    const redirectUri = `${baseURL}/api/auth/callback`
    
    const auth0LoginUrl = `https://${auth0Domain}/authorize?` + new URLSearchParams({
      response_type: 'code',
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: 'openid profile email',
      audience: audience || '',
      state: returnTo
    })
    
    return NextResponse.redirect(auth0LoginUrl)
  }
  
  if (action === 'logout') {
    const returnTo = searchParams.get('returnTo') || '/logout-success'
    const logoutUrl = `https://${auth0Domain}/v2/logout?` + new URLSearchParams({
      client_id: clientId,
      returnTo: `${baseURL}${returnTo}`
    })
    
    return NextResponse.redirect(logoutUrl)
  }
  
  if (action === 'callback') {
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
  }
  
  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action') || 'logout'
  
  if (action === 'logout') {
    // Clear session cookie and redirect to Auth0 logout
    const auth0Domain = process.env.AUTH0_DOMAIN
    const clientId = process.env.AUTH0_CLIENT_ID
    const baseURL = process.env.AUTH0_BASE_URL
    
    if (!auth0Domain || !clientId || !baseURL) {
      return NextResponse.json({ error: 'Auth0 configuration missing' }, { status: 500 })
    }
    
    const response = NextResponse.redirect(new URL(`https://${auth0Domain}/v2/logout?` + new URLSearchParams({
      client_id: clientId
    })))
    
    // Clear the session cookie
    response.cookies.set('auth0_session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0 // Expire immediately
    })
    
    return response
  }
  
  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}
