# RouteWise Admin - Onboarding System

## Overview

The onboarding system guides new users through setting up their bus operations management system. It consists of multiple steps to collect organization information and configure business operations.

## Features

### Step 1: Business Setup
- **Business Details**: Name, address, registered office (optional)
- **Contact Information**: Primary/secondary phone, email, website
- **Legal Information**: GST number, PAN number (optional)
- **Validation**: Form validation with error handling

### Step 2: Fleet Configuration
- **Bus Types**: Define different bus types with AC/Non-AC options, seating types (Seater/Sleeper/Seater+Sleeper), capacity, amenities (organized by importance: Charging Point, USB Port, Type-C Port, Toilet, WiFi, Water Bottle, Blankets, Bed Sheet, TV), and flexible pricing structure
- **Pricing Structure**: 
  - **Seater**: Lower deck seater price + Upper deck seater price (Lower is default)
  - **Sleeper**: Lower deck sleeper price + Upper deck sleeper price (Lower is default)
  - **Seater+Sleeper**: 4 different prices (Lower Seater, Upper Seater, Lower Sleeper, Upper Sleeper)
- **Routes**: Create routes with stops, distance, duration

### Step 3: Completion
- **Summary**: Display configured information
- **Statistics**: Show counts of configured items
- **Next Steps**: Guide users to dashboard

## Technical Implementation

### Components

```
src/components/onboarding/
├── onboarding-flow.tsx          # Main onboarding container
├── organization-setup.tsx       # Step 1: Organization form
├── business-setup.tsx          # Step 2: Business configuration
├── onboarding-complete.tsx     # Step 3: Completion screen
└── index.ts                    # Export file
```

### API Endpoints

```
src/app/api/onboarding/
├── status/route.ts             # GET: Check onboarding status
└── save/route.ts               # POST: Save onboarding data
```

### Database Schema

```typescript
// User Collection
interface User {
  _id: string
  userId: string
  email: string
  name: string
  organizationId?: string
  onboardingComplete: boolean
  createdAt: Date
  updatedAt: Date
}

// Organization Collection
interface Organization {
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

// Onboarding Data Collection
interface OnboardingData {
  _id: string
  userId: string
  organization: Organization
  business: {
    busTypes: BusType[]
    routes: Route[]
    stops: Stop[]
    fleet: Fleet[]
    drivers: Driver[]
    workers: Worker[]
  }
  isComplete: boolean
  createdAt: Date
  updatedAt: Date
}
```

## Usage

### Navigation Flow

1. **User logs in** → Check onboarding status
2. **If incomplete** → Redirect to `/onboarding`
3. **If complete** → Redirect to `/dashboard`

### State Management

- **Local State**: Form data managed with React useState
- **Persistence**: Data saved to database on each step
- **Validation**: Client-side validation with error display
- **Progress**: Visual progress indicator across steps

### Database Integration

The system includes a mock database service (`src/lib/database.ts`) that can be replaced with actual MongoDB/Cosmos DB integration:

```typescript
// Example usage
import { db } from '@/lib/database'

// Create user
const user = await db.createUser({
  userId: 'user123',
  email: 'admin@routewise.com',
  name: 'Admin User'
})

// Save onboarding data
const onboardingData = await db.saveOnboardingData({
  userId: 'user123',
  organization: { /* org data */ },
  business: { /* business data */ },
  isComplete: true
})
```

## Customization

### Adding New Steps

1. Create new component in `src/components/onboarding/`
2. Add to steps array in `onboarding-flow.tsx`
3. Update navigation logic
4. Add validation as needed

### Modifying Forms

1. Update form fields in respective component
2. Add validation rules
3. Update database schema if needed
4. Test form submission flow

### Database Integration

1. Replace mock database service with actual MongoDB/Cosmos DB client
2. Update API endpoints to use real database operations
3. Add proper error handling and transactions
4. Implement data migration if needed

## Security Considerations

- **Authentication**: All API endpoints check for valid session
- **Validation**: Client and server-side validation
- **Data Sanitization**: Input sanitization before database storage
- **Error Handling**: Proper error messages without sensitive data exposure

## Future Enhancements

- **File Uploads**: Organization logo, documents
- **Advanced Validation**: Real-time validation with API calls
- **Progress Persistence**: Save progress even if user leaves
- **Multi-language Support**: Internationalization
- **Analytics**: Track onboarding completion rates
- **A/B Testing**: Different onboarding flows
