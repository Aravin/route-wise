import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const sessionCookie = request.cookies.get('auth0_session')
  
  if (sessionCookie?.value === 'authenticated') {
    return NextResponse.json({ 
      authenticated: true,
      user: { name: 'Admin User', email: 'admin@routewise.com' }
    })
  }
  
  return NextResponse.json({ authenticated: false }, { status: 401 })
}
