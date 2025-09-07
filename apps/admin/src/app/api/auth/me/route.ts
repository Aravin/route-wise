import { NextRequest, NextResponse } from 'next/server'

import { getAuthenticatedUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUser(request)
  
  if (user) {
    return NextResponse.json({ 
      authenticated: true,
      user: { name: user.name, email: user.email }
    })
  }
  
  return NextResponse.json({ authenticated: false }, { status: 401 })
}
