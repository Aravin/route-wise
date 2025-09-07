import { NextRequest, NextResponse } from 'next/server'
import { mongoDBService } from '@/lib/mongodb-service'

export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated
    const sessionCookie = request.cookies.get('auth0_session')
    
    if (sessionCookie?.value !== 'authenticated') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // For demo purposes, use a mock userId
    // In production, extract userId from JWT token or session
    const mockUserId = 'user_' + Date.now()
    
    // Check if user exists
    let user = await mongoDBService.getUserByUserId(mockUserId)
    
    if (!user) {
      // Create user if doesn't exist
      user = await mongoDBService.createUser({
        userId: mockUserId,
        email: 'admin@routewise.com',
        name: 'Admin User'
      })
    }

    // Get onboarding data
    let onboardingData = await mongoDBService.getOnboardingDataByUserId(mockUserId)
    
    if (!onboardingData) {
      // Create default onboarding data
      onboardingData = await mongoDBService.saveOnboardingData({
        userId: mockUserId,
        organization: {
          userId: mockUserId,
          name: '',
          address: '',
          regOffice: '',
          phone: '',
          email: '',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        business: {
          busTypes: [],
          routes: [],
          stops: [],
          fleet: [],
          drivers: [],
          workers: []
        },
        isComplete: false
      })
    }

    return NextResponse.json({
      userId: mockUserId,
      userEmail: user.email,
      onboardingData,
      isComplete: onboardingData.isComplete
    })

  } catch (error) {
    console.error('Error checking onboarding status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
