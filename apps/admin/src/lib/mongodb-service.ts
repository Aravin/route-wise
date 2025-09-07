import { ObjectId } from 'mongodb'
import { 
  getUsersCollection, 
  getOrganizationsCollection, 
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
  onboardingSteps: {
    organizationCreated: boolean
    busTypeCreated: boolean
    routeCreated: boolean
  }
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




class MongoDBService {
  // User operations
  async createUser(userData: Partial<User>): Promise<User> {
    const users = await getUsersCollection()
    const user: User = {
      userId: userData.userId || `user_${Date.now()}`,
      email: userData.email || '',
      name: userData.name || '',
      onboardingComplete: false,
      onboardingSteps: {
        organizationCreated: false,
        busTypeCreated: false,
        routeCreated: false
      },
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




  async updateUser(userId: string, updateData: Partial<User>): Promise<User | null> {
    const users = await getUsersCollection()
    await users.updateOne(
      { userId },
      { 
        $set: { 
          ...updateData,
          updatedAt: new Date()
        }
      }
    )
    return this.getUserByUserId(userId)
  }

  async updateOnboardingStep(userId: string, step: keyof User['onboardingSteps']): Promise<void> {
    const users = await getUsersCollection()
    await users.updateOne(
      { userId },
      { 
        $set: { 
          [`onboardingSteps.${step}`]: true,
          updatedAt: new Date()
        }
      }
    )

    // Check if all steps are complete and update onboardingComplete
    const user = await this.getUserByUserId(userId)
    if (user && user.onboardingSteps) {
      const allStepsComplete = Object.values(user.onboardingSteps).every(step => step === true)
      if (allStepsComplete && !user.onboardingComplete) {
        await this.updateUser(userId, { onboardingComplete: true })
      }
    }
  }

  async getOnboardingProgress(userId: string): Promise<{
    organizationCreated: boolean
    busTypeCreated: boolean
    routeCreated: boolean
    isComplete: boolean
    completedSteps: number
    totalSteps: number
  } | null> {
    const user = await this.getUserByUserId(userId)
    if (!user) {
      return null
    }

    // If user doesn't have onboardingSteps field, initialize it
    if (!user.onboardingSteps) {
      // Check if user has existing data to determine progress
      const [organizations, busTypes, routes] = await Promise.all([
        this.getOrganizationsByUserId(userId),
        this.getBusTypesByUserId(userId),
        this.getRoutesByUserId(userId)
      ])

      const onboardingSteps = {
        organizationCreated: organizations.length > 0,
        busTypeCreated: busTypes.length > 0,
        routeCreated: routes.length > 0
      }

      // Check if all steps are actually complete
      const allStepsComplete = Object.values(onboardingSteps).every(step => step === true)
      
      // Update user with onboarding steps and correct completion status
      await this.updateUser(userId, { 
        onboardingSteps,
        onboardingComplete: allStepsComplete
      })

      const completedSteps = Object.values(onboardingSteps).filter(step => step === true).length
      const totalSteps = Object.keys(onboardingSteps).length
      
      return {
        ...onboardingSteps,
        isComplete: allStepsComplete,
        completedSteps,
        totalSteps
      }
    }

    const steps = user.onboardingSteps
    const completedSteps = Object.values(steps).filter(step => step === true).length
    const totalSteps = Object.keys(steps).length

    // Check if all steps are actually complete
    const allStepsComplete = Object.values(steps).every(step => step === true)

    return {
      ...steps,
      isComplete: allStepsComplete,
      completedSteps,
      totalSteps
    }
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
    const createdOrg = { ...organization, _id: result.insertedId }
    
    // Update onboarding step for organization creation
    await this.updateOnboardingStep(orgData.userId || '', 'organizationCreated')
    
    return createdOrg
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
    const createdBusType = { ...busType, _id: result.insertedId }
    
    // Update onboarding step for bus type creation
    await this.updateOnboardingStep(busTypeData.userId || '', 'busTypeCreated')
    
    return createdBusType
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
    const createdRoute = { ...route, _id: result.insertedId }
    
    // Update onboarding step for route creation
    await this.updateOnboardingStep(routeData.userId || '', 'routeCreated')
    
    return createdRoute
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
