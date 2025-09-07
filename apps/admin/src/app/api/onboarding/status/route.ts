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

    // Get user with onboarding status
    const userData = await mongoDBService.getUserByUserId(user.userId)

    // Get organization if exists
    const organizations = await mongoDBService.getOrganizationsByUserId(user.userId)
    const organization = organizations.length > 0 ? organizations[0] : null

    // Get onboarding progress
    const progress = await mongoDBService.getOnboardingProgress(user.userId)

    // Create onboarding data structure
    const onboardingData = {
      userId: user.userId,
      organization: organization ? {
        userId: organization.userId,
        name: organization.name,
        address: organization.address,
        regOffice: organization.regOffice,
        phone: organization.phone,
        phone2: organization.phone2,
        email: organization.email,
        website: organization.website,
        gstNumber: organization.gstNumber,
        panNumber: organization.panNumber
      } : {
        userId: user.userId,
        name: '',
        address: '',
        regOffice: '',
        phone: '',
        email: '',
        phone2: ''
      },
      isComplete: userData?.onboardingComplete || false
    }

    return NextResponse.json({
      userId: user.userId,
      userEmail: user.email,
      onboardingData,
      isComplete: userData?.onboardingComplete || false,
      progress: progress || {
        organizationCreated: false,
        busTypeCreated: false,
        routeCreated: false,
        isComplete: false,
        completedSteps: 0,
        totalSteps: 3
      }
    })

  } catch (error) {
    console.error('Error checking onboarding status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
