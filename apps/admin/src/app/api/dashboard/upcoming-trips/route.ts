import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // TODO: Implement actual trip management system
    // For now, return empty array as trip management is not yet implemented
    const upcomingTrips: any[] = []

    return NextResponse.json(upcomingTrips)
  } catch (error) {
    console.error('Error fetching upcoming trips:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
