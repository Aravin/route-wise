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

    const busTypes = await mongoDBService.getBusTypesByUserId(user.userId)
    return NextResponse.json(busTypes)

  } catch (error) {
    console.error('Error fetching bus types:', error)
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
    const { 
      name, 
      acType, 
      seatingType, 
      capacity, 
      lowerSeaterPrice, 
      upperSeaterPrice, 
      lowerSleeperPrice, 
      upperSleeperPrice, 
      amenities 
    } = body

    // Validate required fields
    if (!name || !acType || !seatingType || !capacity || lowerSeaterPrice === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: name, acType, seatingType, capacity, lowerSeaterPrice' },
        { status: 400 }
      )
    }

    // Get user's primary organization
    const organization = await mongoDBService.getOrganizationByUserId(user.userId)
    if (!organization) {
      return NextResponse.json(
        { error: 'No organization found. Please create an organization first.' },
        { status: 400 }
      )
    }

    // Create bus type
    const busType = await mongoDBService.createBusType({
      userId: user.userId,
      organizationId: organization._id!,
      name,
      acType,
      seatingType,
      capacity,
      lowerSeaterPrice,
      upperSeaterPrice,
      lowerSleeperPrice,
      upperSleeperPrice,
      amenities: amenities || []
    })

    return NextResponse.json(busType, { status: 201 })

  } catch (error) {
    console.error('Error creating bus type:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
