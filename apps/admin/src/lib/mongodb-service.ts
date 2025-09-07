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
  isPrimary?: boolean
  createdAt: Date
  updatedAt: Date
}

export interface BusType {
  _id?: ObjectId
  userId: string
  organizationId: ObjectId
  name: string
  acType: ACType
  seatingType: SeatingType
  capacity: number
  lowerSeaterPrice: number
  upperSeaterPrice: number
  lowerSleeperPrice: number
  upperSleeperPrice: number
  amenities: Amenity[]
  createdAt: Date
  updatedAt: Date
}

export interface Route {
  _id?: ObjectId
  userId: string
  organizationId: ObjectId
  name: string
  from: string
  to: string
  distance: number
  duration?: number
  description?: string
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
    
    // If this is being set as primary, ensure no other organization is primary
    if (orgData.isPrimary) {
      await organizations.updateMany(
        { userId: orgData.userId },
        { $set: { isPrimary: false, updatedAt: new Date() } }
      )
    }
    
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
      isPrimary: orgData.isPrimary || false,
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

  async getOrganizationsByUserId(userId: string): Promise<Organization[]> {
    const organizations = await getOrganizationsCollection()
    const result = await organizations.find({ userId }).toArray()
    return result as Organization[]
  }

  async getOrganizationById(id: ObjectId): Promise<Organization | null> {
    const organizations = await getOrganizationsCollection()
    const result = await organizations.findOne({ _id: id })
    return result as Organization | null
  }

  async updateOrganization(id: ObjectId, updateData: Partial<Organization>): Promise<Organization | null> {
    const organizations = await getOrganizationsCollection()
    
    // If this is being set as primary, ensure no other organization is primary
    if (updateData.isPrimary) {
      const currentOrg = await this.getOrganizationById(id)
      if (currentOrg) {
        await organizations.updateMany(
          { userId: currentOrg.userId, _id: { $ne: id } },
          { $set: { isPrimary: false, updatedAt: new Date() } }
        )
      }
    }
    
    await organizations.updateOne(
      { _id: id },
      { 
        $set: { 
          ...updateData,
          updatedAt: new Date()
        }
      }
    )
    return this.getOrganizationById(id)
  }

  async deleteOrganization(id: ObjectId): Promise<void> {
    const organizations = await getOrganizationsCollection()
    await organizations.deleteOne({ _id: id })
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

  // Bus Type operations
  async createBusType(busTypeData: Partial<BusType>): Promise<BusType> {
    const busTypes = await getBusTypesCollection()
    const busType: BusType = {
      userId: busTypeData.userId || '',
      organizationId: busTypeData.organizationId || new ObjectId(),
      name: busTypeData.name || '',
      acType: busTypeData.acType || ACType.NON_AC,
      seatingType: busTypeData.seatingType || SeatingType.SEATER,
      capacity: busTypeData.capacity || 0,
      lowerSeaterPrice: busTypeData.lowerSeaterPrice || 0,
      upperSeaterPrice: busTypeData.upperSeaterPrice || 0,
      lowerSleeperPrice: busTypeData.lowerSleeperPrice || 0,
      upperSleeperPrice: busTypeData.upperSleeperPrice || 0,
      amenities: busTypeData.amenities || [],
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const result = await busTypes.insertOne(busType)
    return { ...busType, _id: result.insertedId }
  }

  async getBusTypesByUserId(userId: string): Promise<BusType[]> {
    const busTypes = await getBusTypesCollection()
    const result = await busTypes.find({ userId }).toArray()
    return result as BusType[]
  }

  async getBusTypesByOrganizationId(organizationId: ObjectId): Promise<BusType[]> {
    const busTypes = await getBusTypesCollection()
    const result = await busTypes.find({ organizationId }).toArray()
    return result as BusType[]
  }

  async getBusTypeById(id: ObjectId): Promise<BusType | null> {
    const busTypes = await getBusTypesCollection()
    const result = await busTypes.findOne({ _id: id })
    return result as BusType | null
  }

  async updateBusType(id: ObjectId, updateData: Partial<BusType>): Promise<BusType | null> {
    const busTypes = await getBusTypesCollection()
    await busTypes.updateOne(
      { _id: id },
      { 
        $set: { 
          ...updateData,
          updatedAt: new Date()
        }
      }
    )
    return this.getBusTypeById(id)
  }

  async deleteBusType(id: ObjectId): Promise<void> {
    const busTypes = await getBusTypesCollection()
    await busTypes.deleteOne({ _id: id })
  }

  // Route operations
  async createRoute(routeData: Partial<Route>): Promise<Route> {
    const routes = await getRoutesCollection()
    const route: Route = {
      userId: routeData.userId || '',
      organizationId: routeData.organizationId || new ObjectId(),
      name: routeData.name || '',
      from: routeData.from || '',
      to: routeData.to || '',
      distance: routeData.distance || 0,
      duration: routeData.duration,
      description: routeData.description,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const result = await routes.insertOne(route)
    return { ...route, _id: result.insertedId }
  }

  async getRoutesByUserId(userId: string): Promise<Route[]> {
    const routes = await getRoutesCollection()
    const result = await routes.find({ userId }).toArray()
    return result as Route[]
  }

  async getRoutesByOrganizationId(organizationId: ObjectId): Promise<Route[]> {
    const routes = await getRoutesCollection()
    const result = await routes.find({ organizationId }).toArray()
    return result as Route[]
  }

  async getRouteById(id: ObjectId): Promise<Route | null> {
    const routes = await getRoutesCollection()
    const result = await routes.findOne({ _id: id })
    return result as Route | null
  }

  async updateRoute(id: ObjectId, updateData: Partial<Route>): Promise<Route | null> {
    const routes = await getRoutesCollection()
    await routes.updateOne(
      { _id: id },
      { 
        $set: { 
          ...updateData,
          updatedAt: new Date()
        }
      }
    )
    return this.getRouteById(id)
  }

  async deleteRoute(id: ObjectId): Promise<void> {
    const routes = await getRoutesCollection()
    await routes.deleteOne({ _id: id })
  }

  async deleteBusTypesByOrganizationId(organizationId: ObjectId): Promise<void> {
    const busTypes = await getBusTypesCollection()
    await busTypes.deleteMany({ organizationId })
  }

  async deleteRoutesByOrganizationId(organizationId: ObjectId): Promise<void> {
    const routes = await getRoutesCollection()
    await routes.deleteMany({ organizationId })
  }
}

// Export singleton instance
export const mongoDBService = new MongoDBService()
