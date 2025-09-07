import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth'
import { mongoDBService } from '@/lib/mongodb-service'

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const progress = await mongoDBService.getOnboardingProgress(user.userId)
    
    // If user doesn't exist or doesn't have onboarding steps, return default values
    if (!progress) {
      return NextResponse.json({
        organizationCreated: false,
        busTypeCreated: false,
        routeCreated: false,
        isComplete: false,
        completedSteps: 0,
        totalSteps: 3
      })
    }

    return NextResponse.json(progress)
  } catch (error) {
    console.error('Error fetching onboarding progress:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
