# RouteWise - Technical Specifications

## Project Overview
RouteWise is a multi-tenant bus ticket booking platform designed for scalability, maintainability, and cloud-native deployment. The platform follows a B2B2C model with separate applications for operators (admin) and customers (web).

## Architecture Overview

### B2B2C Model
- **Admin App**: For bus operators to manage their business (routes, buses, bookings, analytics)
- **Web App**: For customers to search and book tickets (public-facing)
- **API**: Shared backend serving both applications
- **Multi-tenant**: Each operator has isolated data and branding

## Tech Stack

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js with TypeScript
- **Database**: MongoDB (NoSQL) with Mongoose ODM
- **Authentication**: JWT with refresh tokens (Auth0 integration planned)
- **API Documentation**: Swagger/OpenAPI 3.0
- **Validation**: Joi or Zod for request validation
- **Testing**: Jest with Supertest

### Frontend Applications
#### Admin App (B2B - Operators)
- **Framework**: Next.js 14 with TypeScript
- **UI Library**: shadcn/ui with Tailwind CSS
- **State Management**: Zustand or React Query
- **Authentication**: NextAuth.js with role-based access
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts or Chart.js for analytics
- **Styling**: Tailwind CSS with CSS Modules

#### Web App (B2C - Customers)
- **Framework**: Next.js 14 with TypeScript
- **UI Library**: shadcn/ui with Tailwind CSS
- **State Management**: Zustand or React Query
- **Authentication**: NextAuth.js (optional - supports guest bookings)
- **Forms**: React Hook Form with Zod validation
- **Styling**: Tailwind CSS with CSS Modules

### Database
- **Primary**: MongoDB (cloud provider agnostic)
- **Caching**: Redis (optional)
- **File Storage**: Cloud storage (AWS S3, Google Cloud, etc.)

## Architecture Principles

### REST API Maturity Model
Following Level 3 REST maturity:
- **Level 0**: HTTP as transport
- **Level 1**: Resources (proper endpoints)
- **Level 2**: HTTP verbs (GET, POST, PUT, DELETE)
- **Level 3**: Hypermedia controls (HATEOAS)

### API Response Format
```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
    timestamp: string;
    requestId: string;
  };
  links?: {
    self: string;
    next?: string;
    prev?: string;
  };
}
```

### Design Principles
1. **Single Responsibility**: Each module has one reason to change
2. **Open/Closed**: Open for extension, closed for modification
3. **Liskov Substitution**: Derived classes must be substitutable for base classes
4. **Interface Segregation**: No client should depend on methods it doesn't use
5. **Dependency Inversion**: Depend on abstractions, not concretions

### Multi-Tenancy Strategy
- **Database per tenant**: Isolated data with shared application logic
- **Schema-based**: Single database with tenant_id in each collection
- **Hybrid approach**: Combination based on tenant size and requirements

## Project Structure
```
route-wise/
├── apps/
│   ├── admin/               # Next.js admin app (B2B - Operators)
│   ├── web/                 # Next.js web app (B2C - Customers)
│   └── api/                 # Express.js backend (Shared)
├── packages/
│   ├── shared/              # Shared types and utilities
│   ├── database/            # Database models and migrations
│   └── ui/                  # Shared UI components
├── docs/                    # API documentation
├── scripts/                 # Build and deployment scripts
└── docker/                  # Docker configurations
```

### Application Separation

#### Admin App (`/apps/admin/`)
**Purpose**: Bus operators manage their business
**Features**:
- Operator registration and onboarding
- Bus fleet management
- Route planning and scheduling
- Trip management
- Booking management and analytics
- Revenue reporting
- Driver and conductor management
- Customer support tools
- Multi-tenant settings and branding

**User Roles**:
- `admin`: Full access to all features
- `operator`: Manage buses, routes, trips
- `dispatcher`: Manage trips and bookings
- `driver`: View assigned trips
- `conductor`: Manage onboard bookings

#### Web App (`/apps/web/`)
**Purpose**: Customers search and book tickets
**Features**:
- Public bus search and booking
- Guest booking (no registration required)
- User registration and login (optional)
- Booking management
- Payment processing
- Booking history
- Reviews and ratings
- Multi-operator support

**User Types**:
- `guest`: Can book without registration
- `registered_user`: Full booking management
- `premium_user`: Additional features and discounts

## Key Features

### Admin App Features (B2B)
- **Operator Onboarding**: Registration, verification, and setup
- **Fleet Management**: Add, edit, and manage bus fleet
- **Route Planning**: Create and manage bus routes and schedules
- **Trip Management**: Schedule trips, manage seat maps, assign drivers
- **Booking Management**: View, manage, and process bookings
- **Analytics Dashboard**: Revenue, occupancy, performance metrics
- **Driver Management**: Driver profiles, assignments, and tracking
- **Customer Support**: Handle customer queries and refunds
- **Multi-tenant Settings**: Custom branding, payment gateways, notifications
- **Real-time Updates**: Live trip status, seat availability

### Web App Features (B2C)
- **Public Search**: Search buses across all operators
- **Guest Booking**: Book tickets without registration
- **User Accounts**: Optional registration for booking management
- **Seat Selection**: Interactive seat map with real-time availability
- **Payment Processing**: Multiple payment methods (cards, UPI, wallets)
- **Booking Management**: View, modify, cancel bookings
- **Reviews & Ratings**: Rate operators and trips
- **Notifications**: Booking confirmations, trip updates
- **Mobile Responsive**: Optimized for all devices

### Shared Features
- **Multi-tenant Architecture**: Data isolation per operator
- **Real-time Updates**: Live seat availability and trip status
- **Payment Gateway Integration**: Stripe, Razorpay support
- **Notification System**: Email, SMS, push notifications
- **Analytics & Reporting**: Comprehensive business intelligence
- **Cloud-native Deployment**: Scalable and maintainable

## Deployment Architecture

### URLs and Domains
- **API**: `https://api.routewise.com` (Shared Backend) - Port 3000
- **Web App**: `https://routewise.com` (B2C - Customers) - Port 3010
- **Admin App**: `https://admin.routewise.com` (B2B - Operators) - Port 3020
- **Docs**: `https://docs.routewise.com` (API Documentation)

### Environment Configuration
- **Development**: Local development with Docker Compose
- **Staging**: Staging environment for testing
- **Production**: Cloud-native deployment (AWS/GCP/Azure)

### Docker Services
```yaml
services:
  mongodb:          # Database
  redis:           # Caching
  api:             # Backend API (Port 3000)
  web:             # Web app (B2C) (Port 3010)
  admin:           # Admin app (B2B) (Port 3020)
  nginx:           # Reverse proxy
```

## Security Considerations
- JWT-based authentication with refresh tokens
- Role-based access control (RBAC) for admin app
- Guest booking support for web app
- Input validation and sanitization
- Rate limiting and CORS protection
- Data encryption at rest and in transit
- Audit logging for sensitive operations
- Multi-tenant data isolation
