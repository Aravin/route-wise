import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth'
import { mongoDBService } from '@/lib/mongodb-service'

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user data from database
    const userData = await mongoDBService.getUserByUserId(user.userId)
    
    if (!userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get user's primary organization
    const organizations = await mongoDBService.getOrganizationsByUserId(user.userId)
    const primaryOrg = organizations.find(org => org.isPrimary) || organizations[0]

    const profile = {
      name: userData.name || 'User',
      email: userData.email || '',
      phone: '', // Not stored in current user model
      location: primaryOrg?.address || '',
      joinDate: userData.createdAt ? new Date(userData.createdAt).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long' 
      }) : 'Unknown',
      role: 'Administrator', // Default role
      department: primaryOrg?.name || 'Operations',
      organizationId: primaryOrg?._id || null
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, phone, location } = body

    // Update user data
    const updatedUser = await mongoDBService.updateUser(user.userId, {
      name: name || undefined,
      updatedAt: new Date()
    })

    // If location is provided and user has a primary organization, update it
    if (location) {
      const organizations = await mongoDBService.getOrganizationsByUserId(user.userId)
      const primaryOrg = organizations.find(org => org.isPrimary)
      
      if (primaryOrg && primaryOrg._id) {
        await mongoDBService.updateOrganization(primaryOrg._id, {
          address: location,
          updatedAt: new Date()
        })
      }
    }

    return NextResponse.json({ success: true, user: updatedUser })
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
