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
        for (const busType of business.busTypes) {
          await mongoDBService.createBusType({
            userId: user.userId,
            organizationId: organizationId,
            name: busType.name,
            acType: busType.acType,
            seatingType: busType.seatingType,
            capacity: busType.capacity,
            lowerSeaterPrice: busType.lowerSeaterPrice,
            upperSeaterPrice: busType.upperSeaterPrice,
            lowerSleeperPrice: busType.lowerSleeperPrice,
            upperSleeperPrice: busType.upperSleeperPrice,
            amenities: busType.amenities
          })
        }
      }
      if (business.routes?.length > 0) {
        for (const route of business.routes) {
          await mongoDBService.createRoute({
            userId: user.userId,
            organizationId: organizationId,
            name: route.name,
            from: route.from,
            to: route.to,
            distance: route.distance,
            duration: route.duration,
            description: route.description
          })
        }
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
