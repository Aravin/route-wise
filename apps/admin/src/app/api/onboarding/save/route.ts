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
    const { organization, isComplete, userEmail } = body

    // Save organization if provided
    let organizationId
    if (organization) {
      const org = await mongoDBService.createOrganization({
        userId: user.userId,
        ...organization
      })
      organizationId = org._id
    }

    // Organization is already saved above

    // Update user's onboarding status
    if (isComplete !== undefined) {
      await mongoDBService.updateUserOnboardingStatus(user.userId, isComplete)
    }

    // Create response data structure
    const responseData = {
      userId: user.userId,
      organization,
      isComplete: isComplete || false
    }

    console.log('Saved onboarding data:', responseData)

    return NextResponse.json(responseData)

  } catch (error) {
    console.error('Error saving onboarding data:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
