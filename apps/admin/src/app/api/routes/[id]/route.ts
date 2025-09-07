import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import { mongoDBService } from '@/lib/mongodb-service'
import { getAuthenticatedUser } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthenticatedUser(request)
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const routeId = new ObjectId(params.id)
    const route = await mongoDBService.getRouteById(routeId)

    if (!route) {
      return NextResponse.json({ error: 'Route not found' }, { status: 404 })
    }

    if (route.userId !== user.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json(route)

  } catch (error) {
    console.error('Error fetching route:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthenticatedUser(request)
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const routeId = new ObjectId(params.id)
    const existingRoute = await mongoDBService.getRouteById(routeId)

    if (!existingRoute) {
      return NextResponse.json({ error: 'Route not found' }, { status: 404 })
    }

    if (existingRoute.userId !== user.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
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

    // Update route
    const updatedRoute = await mongoDBService.updateRoute(routeId, {
      name,
      from,
      to,
      distance,
      duration,
      description
    })

    return NextResponse.json(updatedRoute)

  } catch (error) {
    console.error('Error updating route:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthenticatedUser(request)
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const routeId = new ObjectId(params.id)
    const existingRoute = await mongoDBService.getRouteById(routeId)

    if (!existingRoute) {
      return NextResponse.json({ error: 'Route not found' }, { status: 404 })
    }

    if (existingRoute.userId !== user.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await mongoDBService.deleteRoute(routeId)
    return NextResponse.json({ message: 'Route deleted successfully' })

  } catch (error) {
    console.error('Error deleting route:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
