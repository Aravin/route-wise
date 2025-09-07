import { NextRequest } from 'next/server'
import { mongoDBService } from './mongodb-service'

export interface UserSession {
  userId: string
  email: string
  name: string
  isAuthenticated: boolean
}

export async function getAuthenticatedUser(request: NextRequest): Promise<UserSession | null> {
  try {
    // Check if user is authenticated
    const sessionCookie = request.cookies.get('auth0_session')
    
    if (sessionCookie?.value !== 'authenticated') {
      return null
    }

    // Get user data from session cookies
    const userId = request.cookies.get('user_id')?.value
    const userEmail = request.cookies.get('user_email')?.value
    const userName = request.cookies.get('user_name')?.value
    
    if (!userId) {
      return null
    }

    // Get or create user in database
    let user = await mongoDBService.getUserByUserId(userId)
    
    if (!user) {
      // Create user if doesn't exist - use real data from Auth0
      if (!userEmail || !userName) {
        console.error('Missing user data from Auth0')
        return null
      }
      
      user = await mongoDBService.createUser({
        userId,
        email: userEmail,
        name: userName
      })
    }

    return {
      userId: user.userId,
      email: user.email,
      name: user.name,
      isAuthenticated: true
    }

  } catch (error) {
    console.error('Error getting authenticated user:', error)
    return null
  }
}

export function requireAuth(handler: (request: NextRequest, user: UserSession) => Promise<Response>) {
  return async (request: NextRequest) => {
    const user = await getAuthenticatedUser(request)
    
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    return handler(request, user)
  }
}