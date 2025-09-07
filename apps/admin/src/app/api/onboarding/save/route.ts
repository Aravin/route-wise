import { NextRequest, NextResponse } from 'next/server'
import { mongoDBService } from '@/lib/mongodb-service'

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated
    const sessionCookie = request.cookies.get('auth0_session')
    
    if (sessionCookie?.value !== 'authenticated') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { organization, business, isComplete, userEmail } = body

    // For demo purposes, use a mock userId
    // In production, extract userId from JWT token or session
    const mockUserId = 'user_' + Date.now()
    
    // Ensure user exists
    let user = await mongoDBService.getUserByUserId(mockUserId)
    if (!user) {
      user = await mongoDBService.createUser({
        userId: mockUserId,
        email: 'admin@routewise.com',
        name: 'Admin User'
      })
    }

    // Save organization if provided
    let organizationId
    if (organization) {
      const org = await mongoDBService.createOrganization({
        userId: mockUserId,
        ...organization
      })
      organizationId = org._id
    }

    // Save onboarding data
    const onboardingData = await mongoDBService.saveOnboardingData({
      userId: mockUserId,
      organization,
      business,
      isComplete
    })

    // Save business data to separate collections if provided
    if (organizationId && business) {
      if (business.busTypes?.length > 0) {
        await mongoDBService.saveBusTypes(organizationId, business.busTypes)
      }
      if (business.routes?.length > 0) {
        await mongoDBService.saveRoutes(organizationId, business.routes)
      }
    }

    // Update user's onboarding status
    if (isComplete) {
      await mongoDBService.updateUserOnboardingStatus(mockUserId, true)
    }

    console.log('Saved onboarding data:', onboardingData)

    return NextResponse.json(onboardingData)

  } catch (error) {
    console.error('Error saving onboarding data:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
