import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // TODO: Implement actual booking system
    // For now, return empty array as booking system is not yet implemented
    const recentBookings: any[] = []

    return NextResponse.json(recentBookings)
  } catch (error) {
    console.error('Error fetching recent bookings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
