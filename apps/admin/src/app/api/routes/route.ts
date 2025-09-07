import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import { mongoDBService } from '@/lib/mongodb-service'
import { getAuthenticatedUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request)
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const routes = await mongoDBService.getRoutesByUserId(user.userId)
    return NextResponse.json(routes)

  } catch (error) {
    console.error('Error fetching routes:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request)
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, from, to, distance, duration, description } = body

    // Validate required fields
    if (!name || !from || !to || !distance) {
      return NextResponse.json(
        { error: 'Missing required fields: name, from, to, distance' },
        { status: 400 }
      )
    }

    // Get user's primary organization
    const organization = await mongoDBService.getOrganizationByUserId(user.userId)
    if (!organization) {
      return NextResponse.json(
        { error: 'No organization found. Please complete onboarding first.' },
        { status: 400 }
      )
    }

    // Create route
    const route = await mongoDBService.createRoute({
      userId: user.userId,
      organizationId: organization._id!,
      name,
      from,
      to,
      distance,
      duration,
      description
    })

    return NextResponse.json(route, { status: 201 })

  } catch (error) {
    console.error('Error creating route:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
