import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth'
import { mongoDBService } from '@/lib/mongodb-service'

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's organizations
    const organizations = await mongoDBService.getOrganizationsByUserId(user.userId)
    const organizationIds = organizations.map(org => org._id)

    // Get statistics
    const [
      totalBusTypes,
      totalRoutes,
      totalOrganizations
    ] = await Promise.all([
      mongoDBService.getBusTypesByUserId(user.userId),
      mongoDBService.getRoutesByUserId(user.userId),
      Promise.resolve(organizations)
    ])

    // Calculate today's date for trip filtering
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const stats = {
      totalBuses: totalBusTypes.length,
      activeRoutes: totalRoutes.length,
      totalOrganizations: totalOrganizations.length
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
