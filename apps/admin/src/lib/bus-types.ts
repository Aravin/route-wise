// Bus Type Enums and Utilities

export enum ACType {
  AC = 'AC',
  NON_AC = 'NON_AC'
}

export enum SeatingType {
  SEATER = 'SEATER',
  SLEEPER = 'SLEEPER',
  SEATER_SLEEPER = 'SEATER_SLEEPER'
}

export enum Amenity {
  // Essential amenities (most important)
  CHARGING_POINT = 'CHARGING_POINT',
  USB_PORT = 'USB_PORT',
  TYPE_C_PORT = 'TYPE_C_PORT',
  TOILET = 'TOILET',
  
  // Comfort amenities
  WIFI = 'WIFI',
  WATER_BOTTLE = 'WATER_BOTTLE',
  BLANKETS = 'BLANKETS',
  BED_SHEET = 'BED_SHEET',
  
  // Entertainment amenities
  TV = 'TV'
}

// Helper functions for bus types
export const getACTypeLabel = (acType: ACType): string => {
  switch (acType) {
    case ACType.AC:
      return 'AC'
    case ACType.NON_AC:
      return 'Non-AC'
    default:
      return acType
  }
}

export const getSeatingTypeLabel = (seatingType: SeatingType): string => {
  switch (seatingType) {
    case SeatingType.SEATER:
      return 'Seater'
    case SeatingType.SLEEPER:
      return 'Sleeper'
    case SeatingType.SEATER_SLEEPER:
      return 'Seater + Sleeper'
    default:
      return seatingType
  }
}

export const getBusTypeDisplayName = (acType: ACType, seatingType: SeatingType): string => {
  return `${getACTypeLabel(acType)} ${getSeatingTypeLabel(seatingType)}`
}

// Helper function to get pricing display text
export const getPricingDisplayText = (pricing: {
  lowerSeaterPrice: number
  upperSeaterPrice: number
  lowerSleeperPrice: number
  upperSleeperPrice: number
}, seatingType: SeatingType): string => {
  switch (seatingType) {
    case SeatingType.SEATER:
      return `Lower: ₹${pricing.lowerSeaterPrice}, Upper: ₹${pricing.upperSeaterPrice}`
    case SeatingType.SLEEPER:
      return `Lower: ₹${pricing.lowerSleeperPrice}, Upper: ₹${pricing.upperSleeperPrice}`
    case SeatingType.SEATER_SLEEPER:
      return `Lower Seater: ₹${pricing.lowerSeaterPrice}, Upper Seater: ₹${pricing.upperSeaterPrice}, Lower Sleeper: ₹${pricing.lowerSleeperPrice}, Upper Sleeper: ₹${pricing.upperSleeperPrice}`
    default:
      return 'Not set'
  }
}

// Helper functions for amenities
export const getAmenityLabel = (amenity: Amenity): string => {
  switch (amenity) {
    case Amenity.WIFI:
      return 'WiFi'
    case Amenity.WATER_BOTTLE:
      return 'Water Bottle'
    case Amenity.BLANKETS:
      return 'Blankets (Warm)'
    case Amenity.CHARGING_POINT:
      return 'Charging Point'
    case Amenity.TOILET:
      return 'Toilet'
    case Amenity.BED_SHEET:
      return 'Bed Sheet (Clean)'
    case Amenity.TV:
      return 'TV'
    case Amenity.USB_PORT:
      return 'USB Port'
    case Amenity.TYPE_C_PORT:
      return 'Type-C Port'
    default:
      return amenity
  }
}

export const getAmenityIcon = (amenity: Amenity): string => {
  switch (amenity) {
    case Amenity.WIFI:
      return '📶'
    case Amenity.WATER_BOTTLE:
      return '💧'
    case Amenity.BLANKETS:
      return '🛌'
    case Amenity.CHARGING_POINT:
      return '🔌'
    case Amenity.TOILET:
      return '🚻'
    case Amenity.BED_SHEET:
      return '🛏️'
    case Amenity.TV:
      return '📺'
    case Amenity.USB_PORT:
      return '🔌'
    case Amenity.TYPE_C_PORT:
      return '🔌'
    default:
      return '✨'
  }
}

// Common bus type configurations
export const COMMON_BUS_TYPES = [
  {
    name: 'AC Seater',
    acType: ACType.AC,
    seatingType: SeatingType.SEATER,
    capacity: 40,
    amenities: [Amenity.CHARGING_POINT, Amenity.USB_PORT, Amenity.TYPE_C_PORT, Amenity.WIFI, Amenity.WATER_BOTTLE],
    pricing: {
      lowerSeaterPrice: 550,
      upperSeaterPrice: 450,
      lowerSleeperPrice: 0,
      upperSleeperPrice: 0
    }
  },
  {
    name: 'AC Sleeper',
    acType: ACType.AC,
    seatingType: SeatingType.SLEEPER,
    capacity: 30,
    amenities: [Amenity.CHARGING_POINT, Amenity.USB_PORT, Amenity.TYPE_C_PORT, Amenity.WIFI, Amenity.BLANKETS, Amenity.BED_SHEET, Amenity.WATER_BOTTLE],
    pricing: {
      lowerSeaterPrice: 0,
      upperSeaterPrice: 0,
      lowerSleeperPrice: 900,
      upperSleeperPrice: 700
    }
  },
  {
    name: 'Non-AC Seater',
    acType: ACType.NON_AC,
    seatingType: SeatingType.SEATER,
    capacity: 45,
    amenities: [Amenity.CHARGING_POINT, Amenity.USB_PORT],
    pricing: {
      lowerSeaterPrice: 350,
      upperSeaterPrice: 250,
      lowerSleeperPrice: 0,
      upperSleeperPrice: 0
    }
  },
  {
    name: 'Non-AC Sleeper',
    acType: ACType.NON_AC,
    seatingType: SeatingType.SLEEPER,
    capacity: 35,
    amenities: [Amenity.CHARGING_POINT, Amenity.USB_PORT, Amenity.BLANKETS],
    pricing: {
      lowerSeaterPrice: 0,
      upperSeaterPrice: 0,
      lowerSleeperPrice: 600,
      upperSleeperPrice: 400
    }
  },
  {
    name: 'AC Seater + Sleeper',
    acType: ACType.AC,
    seatingType: SeatingType.SEATER_SLEEPER,
    capacity: 50,
    amenities: [Amenity.CHARGING_POINT, Amenity.USB_PORT, Amenity.TYPE_C_PORT, Amenity.WIFI, Amenity.BLANKETS, Amenity.BED_SHEET, Amenity.TV, Amenity.WATER_BOTTLE],
    pricing: {
      lowerSeaterPrice: 400,
      upperSeaterPrice: 350,
      lowerSleeperPrice: 700,
      upperSleeperPrice: 600
    }
  }
]

// All available amenities
export const ALL_AMENITIES = Object.values(Amenity)

// Validation helpers
export const validateBusType = (busType: {
  name: string
  acType: ACType
  seatingType: SeatingType
  capacity: number
  basePrice: number
}): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []

  if (!busType.name.trim()) {
    errors.push('Bus type name is required')
  }

  if (busType.capacity <= 0) {
    errors.push('Capacity must be greater than 0')
  }

  if (busType.basePrice < 0) {
    errors.push('Base price cannot be negative')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}
