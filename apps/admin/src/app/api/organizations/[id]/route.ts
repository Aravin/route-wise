import { NextRequest, NextResponse } from 'next/server'
import { mongoDBService } from '@/lib/mongodb-service'
import { getAuthenticatedUser } from '@/lib/auth'
import { ObjectId } from 'mongodb'

// GET /api/organizations/[id] - Get a specific organization
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get authenticated user
    const user = await getAuthenticatedUser(request)
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const organizationId = new ObjectId(params.id)
    const organization = await mongoDBService.getOrganizationById(organizationId)
    
    if (!organization) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 })
    }

    // Verify the organization belongs to the user
    if (organization.userId !== user.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json(organization)

  } catch (error) {
    console.error('Error fetching organization:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/organizations/[id] - Update a specific organization
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const organizationId = new ObjectId(params.id)
    
    // Check if organization exists and belongs to user
    const existingOrg = await mongoDBService.getOrganizationById(organizationId)
    if (!existingOrg) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 })
    }

    if (existingOrg.userId !== user.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Update organization
    const updatedOrganization = await mongoDBService.updateOrganization(organizationId, {
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

    return NextResponse.json(updatedOrganization)

  } catch (error) {
    console.error('Error updating organization:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/organizations/[id] - Delete a specific organization
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get authenticated user
    const user = await getAuthenticatedUser(request)
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const organizationId = new ObjectId(params.id)
    
    // Check if organization exists and belongs to user
    const existingOrg = await mongoDBService.getOrganizationById(organizationId)
    if (!existingOrg) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 })
    }

    if (existingOrg.userId !== user.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Delete organization
    await mongoDBService.deleteOrganization(organizationId)

    return NextResponse.json({ message: 'Organization deleted successfully' })

  } catch (error) {
    console.error('Error deleting organization:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
