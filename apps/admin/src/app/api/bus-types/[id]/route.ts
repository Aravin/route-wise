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

    const busTypeId = new ObjectId(params.id)
    const busType = await mongoDBService.getBusTypeById(busTypeId)

    if (!busType) {
      return NextResponse.json({ error: 'Bus type not found' }, { status: 404 })
    }

    if (busType.userId !== user.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json(busType)

  } catch (error) {
    console.error('Error fetching bus type:', error)
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

    const busTypeId = new ObjectId(params.id)
    const existingBusType = await mongoDBService.getBusTypeById(busTypeId)

    if (!existingBusType) {
      return NextResponse.json({ error: 'Bus type not found' }, { status: 404 })
    }

    if (existingBusType.userId !== user.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
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

    // Update bus type
    const updatedBusType = await mongoDBService.updateBusType(busTypeId, {
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

    return NextResponse.json(updatedBusType)

  } catch (error) {
    console.error('Error updating bus type:', error)
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

    const busTypeId = new ObjectId(params.id)
    const existingBusType = await mongoDBService.getBusTypeById(busTypeId)

    if (!existingBusType) {
      return NextResponse.json({ error: 'Bus type not found' }, { status: 404 })
    }

    if (existingBusType.userId !== user.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await mongoDBService.deleteBusType(busTypeId)
    return NextResponse.json({ message: 'Bus type deleted successfully' })

  } catch (error) {
    console.error('Error deleting bus type:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
