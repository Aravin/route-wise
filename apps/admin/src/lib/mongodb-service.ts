import { ObjectId } from 'mongodb'
import { 
  getUsersCollection, 
  getOrganizationsCollection, 
  getOnboardingCollection,
  getBusTypesCollection,
  getRoutesCollection
} from './mongodb'
import { Amenity } from './bus-types'

export interface User {
  _id?: ObjectId
  userId: string
  email: string
  name: string
  organizationId?: ObjectId
  onboardingComplete: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Organization {
  _id?: ObjectId
  userId: string
  name: string
  address: string
  regOffice?: string
  phone: string
  phone2?: string
  email: string
  website?: string
  gstNumber?: string
  panNumber?: string
  createdAt: Date
  updatedAt: Date
}

export enum ACType {
  AC = 'AC',
  NON_AC = 'NON_AC'
}

export enum SeatingType {
  SEATER = 'SEATER',
  SLEEPER = 'SLEEPER',
  SEATER_SLEEPER = 'SEATER_SLEEPER'
}

export interface BusType {
  _id?: ObjectId
  organizationId: ObjectId
  name: string
  acType: ACType
  seatingType: SeatingType
  capacity: number
  amenities: Amenity[]
  pricing: {
    // For SEATER - lower and upper deck pricing
    lowerSeaterPrice: number
    upperSeaterPrice: number
    // For SLEEPER - lower and upper deck pricing
    lowerSleeperPrice: number
    upperSleeperPrice: number
  }
  createdAt: Date
  updatedAt: Date
}

export interface Route {
  _id?: ObjectId
  organizationId: ObjectId
  name: string
  from: string
  to: string
  distance: number
  duration: number
  stops: string[]
  createdAt: Date
  updatedAt: Date
}


export interface OnboardingData {
  _id?: ObjectId
  userId: string
  userEmail?: string
  organization: Organization
  business: {
    busTypes: Omit<BusType, '_id' | 'organizationId' | 'createdAt' | 'updatedAt'>[]
    routes: Omit<Route, '_id' | 'organizationId' | 'createdAt' | 'updatedAt'>[]
  }
  isComplete: boolean
  createdAt: Date
  updatedAt: Date
}

class MongoDBService {
  // User operations
  async createUser(userData: Partial<User>): Promise<User> {
    const users = await getUsersCollection()
    const user: User = {
      userId: userData.userId || `user_${Date.now()}`,
      email: userData.email || '',
      name: userData.name || '',
      onboardingComplete: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const result = await users.insertOne(user)
    return { ...user, _id: result.insertedId }
  }

  async getUserByUserId(userId: string): Promise<User | null> {
    const users = await getUsersCollection()
    const result = await users.findOne({ userId })
    return result as User | null
  }

  async updateUserOnboardingStatus(userId: string, isComplete: boolean): Promise<void> {
    const users = await getUsersCollection()
    await users.updateOne(
      { userId },
      { 
        $set: { 
          onboardingComplete: isComplete,
          updatedAt: new Date()
        }
      }
    )
  }

  // Organization operations
  async createOrganization(orgData: Partial<Organization>): Promise<Organization> {
    const organizations = await getOrganizationsCollection()
    const organization: Organization = {
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
    
    const result = await organizations.insertOne(organization)
    return { ...organization, _id: result.insertedId }
  }

  async getOrganizationByUserId(userId: string): Promise<Organization | null> {
    const organizations = await getOrganizationsCollection()
    const result = await organizations.findOne({ userId })
    return result as Organization | null
  }

  // Onboarding operations
  async saveOnboardingData(data: Partial<OnboardingData>): Promise<OnboardingData> {
    const onboarding = await getOnboardingCollection()
    
    const onboardingData: OnboardingData = {
      userId: data.userId || '',
      userEmail: data.userEmail,
      organization: data.organization || {
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
        routes: []
      },
      isComplete: data.isComplete || false,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // Check if onboarding data already exists
    const existing = await onboarding.findOne({ userId: data.userId })
    
    if (existing) {
      // Update existing
      await onboarding.updateOne(
        { userId: data.userId },
        { 
          $set: {
            ...onboardingData,
            _id: existing._id,
            createdAt: existing.createdAt,
            updatedAt: new Date()
          }
        }
      )
      return { ...onboardingData, _id: existing._id }
    } else {
      // Create new
      const result = await onboarding.insertOne(onboardingData)
      return { ...onboardingData, _id: result.insertedId }
    }
  }

  async getOnboardingDataByUserId(userId: string): Promise<OnboardingData | null> {
    const onboarding = await getOnboardingCollection()
    const result = await onboarding.findOne({ userId })
    return result as OnboardingData | null
  }

  // Business data operations
  async saveBusTypes(organizationId: ObjectId, busTypes: Omit<BusType, '_id' | 'organizationId' | 'createdAt' | 'updatedAt'>[]): Promise<BusType[]> {
    const busTypesCollection = await getBusTypesCollection()
    
    // Delete existing bus types for this organization
    await busTypesCollection.deleteMany({ organizationId })
    
    // Insert new bus types
    const busTypesWithMeta = busTypes.map(bt => ({
      ...bt,
      organizationId,
      createdAt: new Date(),
      updatedAt: new Date()
    }))
    
    const result = await busTypesCollection.insertMany(busTypesWithMeta)
    return busTypesWithMeta.map((bt, index) => ({
      ...bt,
      _id: result.insertedIds[index]
    }))
  }

  async saveRoutes(organizationId: ObjectId, routes: Omit<Route, '_id' | 'organizationId' | 'createdAt' | 'updatedAt'>[]): Promise<Route[]> {
    const routesCollection = await getRoutesCollection()
    
    // Delete existing routes for this organization
    await routesCollection.deleteMany({ organizationId })
    
    // Insert new routes
    const routesWithMeta = routes.map(route => ({
      ...route,
      organizationId,
      createdAt: new Date(),
      updatedAt: new Date()
    }))
    
    const result = await routesCollection.insertMany(routesWithMeta)
    return routesWithMeta.map((route, index) => ({
      ...route,
      _id: result.insertedIds[index]
    }))
  }


  // Get business data for organization
  async getBusinessData(organizationId: ObjectId) {
    const [busTypes, routes] = await Promise.all([
      (await getBusTypesCollection()).find({ organizationId }).toArray(),
      (await getRoutesCollection()).find({ organizationId }).toArray()
    ])

    return {
      busTypes,
      routes
    }
  }
}

// Export singleton instance
export const mongoDBService = new MongoDBService()
