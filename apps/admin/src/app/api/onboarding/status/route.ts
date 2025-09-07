import { NextRequest, NextResponse } from 'next/server'
import { mongoDBService } from '@/lib/mongodb-service'
import { getAuthenticatedUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Get authenticated user
    const user = await getAuthenticatedUser(request)
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get onboarding data
    let onboardingData = await mongoDBService.getOnboardingDataByUserId(user.userId)
    
    if (!onboardingData) {
      // Create default onboarding data
      onboardingData = await mongoDBService.saveOnboardingData({
        userId: user.userId,
        organization: {
          userId: user.userId,
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
          routes: []
        },
        isComplete: false
      })
    }

    return NextResponse.json({
      userId: user.userId,
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
