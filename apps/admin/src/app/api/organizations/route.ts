import { NextRequest, NextResponse } from 'next/server'
import { mongoDBService } from '@/lib/mongodb-service'
import { getAuthenticatedUser } from '@/lib/auth'

// GET /api/organizations - List all organizations for the logged-in user
export async function GET(request: NextRequest) {
  try {
    // Get authenticated user
    const user = await getAuthenticatedUser(request)
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Get organizations for the user
    const organizations = await mongoDBService.getOrganizationsByUserId(user.userId)
    
    return NextResponse.json(organizations)

  } catch (error) {
    console.error('Error fetching organizations:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/organizations - Create a new organization
export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const user = await getAuthenticatedUser(request)
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, address, regOffice, phone, phone2, email, website, gstNumber, panNumber } = body

    // Validate required fields
    if (!name || !address || !phone || !email) {
      return NextResponse.json(
        { error: 'Missing required fields: name, address, phone, email' },
        { status: 400 }
      )
    }

    // Create organization
    const organization = await mongoDBService.createOrganization({
      userId: user.userId,
      name,
      address,
      regOffice,
      phone,
      phone2,
      email,
      website,
      gstNumber,
      panNumber
    })

    return NextResponse.json(organization, { status: 201 })

  } catch (error) {
    console.error('Error creating organization:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
