// Database integration for MongoDB/Cosmos DB
// This is a placeholder implementation - replace with actual database connection

interface DatabaseConfig {
  connectionString: string
  databaseName: string
}

const config: DatabaseConfig = {
  connectionString: process.env.DATABASE_URL || 'mongodb://localhost:27017/routewise',
  databaseName: 'routewise'
}

export interface User {
  _id: string
  userId: string
  email: string
  name: string
  organizationId?: string
  onboardingComplete: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Organization {
  _id: string
  userId: string
  name: string
  address: string
  regOffice: string
  phone: string
  phone2?: string
  email: string
  website?: string
  gstNumber?: string
  panNumber?: string
  createdAt: Date
  updatedAt: Date
}

export interface OnboardingData {
  _id: string
  userId: string
  organization: Organization
  business: {
    busTypes: Array<{
      id: string
      name: string
      capacity: number
      amenities: string[]
      basePrice: number
    }>
    routes: Array<{
      id: string
      name: string
      from: string
      to: string
      distance: number
      duration: number
      stops: string[]
    }>
    stops: Array<{
      id: string
      name: string
      address: string
      city: string
      state: string
      pincode: string
      coordinates?: {
        lat: number
        lng: number
      }
    }>
    fleet: Array<{
      id: string
      registrationNumber: string
      busTypeId: string
      capacity: number
      status: 'active' | 'maintenance' | 'inactive'
      purchaseDate: string
      lastServiceDate: string
    }>
    drivers: Array<{
      id: string
      name: string
      phone: string
      email: string
      licenseNumber: string
      licenseExpiry: string
      address: string
      emergencyContact: string
    }>
    workers: Array<{
      id: string
      name: string
      phone: string
      email: string
      role: string
      address: string
      emergencyContact: string
    }>
  }
  isComplete: boolean
  createdAt: Date
  updatedAt: Date
}

// Mock database operations - replace with actual MongoDB/Cosmos DB implementation
class DatabaseService {
  private users: User[] = []
  private organizations: Organization[] = []
  private onboardingData: OnboardingData[] = []

  async createUser(userData: Partial<User>): Promise<User> {
    const user: User = {
      _id: `user_${Date.now()}`,
      userId: userData.userId || `user_${Date.now()}`,
      email: userData.email || '',
      name: userData.name || '',
      onboardingComplete: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    this.users.push(user)
    return user
  }

  async getUserByUserId(userId: string): Promise<User | null> {
    return this.users.find(user => user.userId === userId) || null
  }

  async createOrganization(orgData: Partial<Organization>): Promise<Organization> {
    const organization: Organization = {
      _id: `org_${Date.now()}`,
      userId: orgData.userId || '',
      name: orgData.name || '',
      address: orgData.address || '',
      regOffice: orgData.regOffice || '',
      phone: orgData.phone || '',
      phone2: orgData.phone2,
      email: orgData.email || '',
      website: orgData.website,
      gstNumber: orgData.gstNumber,
      panNumber: orgData.panNumber,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    this.organizations.push(organization)
    return organization
  }

  async getOrganizationByUserId(userId: string): Promise<Organization | null> {
    return this.organizations.find(org => org.userId === userId) || null
  }

  async saveOnboardingData(data: Partial<OnboardingData>): Promise<OnboardingData> {
    const existingIndex = this.onboardingData.findIndex(item => item.userId === data.userId)
    
    if (existingIndex >= 0) {
      // Update existing
      this.onboardingData[existingIndex] = {
        ...this.onboardingData[existingIndex],
        ...data,
        updatedAt: new Date()
      }
      return this.onboardingData[existingIndex]
    } else {
      // Create new
      const onboardingData: OnboardingData = {
        _id: `onboarding_${Date.now()}`,
        userId: data.userId || '',
        organization: data.organization || {
          _id: '',
          userId: '',
          name: '',
          address: '',
          regOffice: '',
          phone: '',
          email: '',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        business: data.business || {
          busTypes: [],
          routes: [],
          stops: [],
          fleet: [],
          drivers: [],
          workers: []
        },
        isComplete: data.isComplete || false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      this.onboardingData.push(onboardingData)
      return onboardingData
    }
  }

  async getOnboardingDataByUserId(userId: string): Promise<OnboardingData | null> {
    return this.onboardingData.find(data => data.userId === userId) || null
  }

  async updateUserOnboardingStatus(userId: string, isComplete: boolean): Promise<void> {
    const user = this.users.find(u => u.userId === userId)
    if (user) {
      user.onboardingComplete = isComplete
      user.updatedAt = new Date()
    }
  }
}

// Export singleton instance
export const db = new DatabaseService()

// Example usage:
/*
// Create user
const user = await db.createUser({
  userId: 'user123',
  email: 'admin@routewise.com',
  name: 'Admin User'
})

// Create organization
const org = await db.createOrganization({
  userId: 'user123',
  name: 'RouteWise Bus Company',
  address: '123 Main St, City',
  regOffice: '123 Main St, City',
  phone: '+1234567890',
  email: 'admin@routewise.com'
})

// Save onboarding data
const onboardingData = await db.saveOnboardingData({
  userId: 'user123',
  organization: org,
  business: {
    busTypes: [...],
    routes: [...],
    stops: [...],
    fleet: [...],
    drivers: [...],
    workers: [...]
  },
  isComplete: true
})
*/
