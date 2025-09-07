import { NextRequest, NextResponse } from 'next/server'
import { mongoDBService } from '@/lib/mongodb-service'
import { getAuthenticatedUser } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const user = await getAuthenticatedUser(request)
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { organization, business, isComplete, userEmail } = body

    // Save organization if provided
    let organizationId
    if (organization) {
      const org = await mongoDBService.createOrganization({
        userId: user.userId,
        ...organization
      })
      organizationId = org._id
    }

    // Save onboarding data
    const onboardingData = await mongoDBService.saveOnboardingData({
      userId: user.userId,
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
      await mongoDBService.updateUserOnboardingStatus(user.userId, true)
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
