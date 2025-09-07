# RouteWise Architecture - B2B2C Model

## Overview

RouteWise has been restructured to follow a B2B2C (Business-to-Business-to-Consumer) model with separate applications for different user types:

- **Admin App** (`/apps/admin/`) - For bus operators (B2B)
- **Web App** (`/apps/web/`) - For customers (B2C)
- **API** (`/apps/api/`) - Shared backend serving both applications

## Application Separation

### 1. Admin App (B2B - Operators)
**URL**: `https://admin.routewise.com` (Port: 3001)
**Purpose**: Bus operators manage their business operations

**Key Features**:
- Operator registration and onboarding
- Bus fleet management
- Route planning and scheduling
- Trip management with seat maps
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

### 2. Web App (B2C - Customers)
**URL**: `https://routewise.com` (Port: 3000)
**Purpose**: Customers search and book tickets

**Key Features**:
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

### 3. API (Shared Backend)
**URL**: `https://api.routewise.com` (Port: 5000)
**Purpose**: Shared backend serving both applications

**Key Features**:
- Multi-tenant data isolation
- Authentication and authorization
- Business logic and data processing
- Payment gateway integration
- Notification services
- Analytics and reporting

## Database Architecture

### MongoDB Collections
- `users`: User accounts (both operators and customers)
- `tenants`: Bus operator companies
- `buses`: Bus fleet information
- `routes`: Bus routes and schedules
- `trips`: Individual trip instances
- `bookings`: Customer bookings
- `drivers`: Driver information
- `depots`: Bus stations and stops

### Multi-tenancy Strategy
- **Schema-based**: Single database with `tenantId` in each collection
- **Data Isolation**: Each operator's data is isolated by tenant
- **Shared Resources**: Common data like cities, routes shared across tenants

## Authentication & Authorization

### Admin App
- Role-based access control (RBAC)
- JWT tokens with refresh mechanism
- Multi-tenant user management
- Operator-specific permissions

### Web App
- Optional authentication for enhanced features
- Guest booking support
- Social login integration (planned)
- Customer account management

## Deployment Architecture

### Development
```bash
# Start all services
docker-compose up

# Individual services
npm run dev:admin    # Admin app on :3001
npm run dev:web      # Web app on :3000
npm run dev:api      # API on :5000
```

### Production URLs
- **Admin**: `https://admin.routewise.com`
- **Web**: `https://routewise.com`
- **API**: `https://api.routewise.com`
- **Docs**: `https://docs.routewise.com`

### Docker Services
```yaml
services:
  mongodb:          # Database
  redis:           # Caching
  api:             # Backend API
  admin:           # Admin app (B2B)
  web:             # Web app (B2C)
  nginx:           # Reverse proxy
```

## Development Workflow

### 1. Setting Up Development Environment
```bash
# Clone repository
git clone <repository-url>
cd route-wise

# Install dependencies
npm run install-all

# Start all services
npm run dev
```

### 2. Working with Admin App
```bash
cd apps/admin
npm run dev
# Access at http://localhost:3001
```

### 3. Working with Web App
```bash
cd apps/web
npm run dev
# Access at http://localhost:3000
```

### 4. Working with API
```bash
cd apps/api
npm run dev
# Access at http://localhost:5000
```

## Key Benefits of This Architecture

### 1. Clear Separation of Concerns
- Admin app focuses on business operations
- Web app focuses on customer experience
- Shared API ensures consistency

### 2. Scalability
- Each app can be scaled independently
- Microservices-ready architecture
- Cloud-native deployment

### 3. Security
- Role-based access control
- Multi-tenant data isolation
- Separate authentication flows

### 4. Maintainability
- Clear code organization
- Independent development cycles
- Shared components and utilities

### 5. User Experience
- Optimized interfaces for each user type
- Mobile-responsive design
- Fast loading times

## Migration from Previous Architecture

The previous single web app has been split into:

1. **Admin functionality** → Moved to `/apps/admin/`
2. **Customer functionality** → Remains in `/apps/web/`
3. **Shared components** → Available in `/packages/shared/`
4. **API** → Remains in `/apps/api/`

## Next Steps

1. **Complete Admin App Features**:
   - Route management
   - Trip scheduling
   - Booking management
   - Analytics dashboard

2. **Enhance Web App**:
   - Guest booking flow
   - Payment integration
   - Mobile optimization

3. **API Enhancements**:
   - Real-time updates
   - Advanced analytics
   - Notification system

4. **Deployment**:
   - Production environment setup
   - CI/CD pipeline
   - Monitoring and logging

## Support

For questions or issues with the new architecture, please refer to:
- Admin App: `/apps/admin/README.md`
- Web App: `/apps/web/README.md`
- API: `/apps/api/README.md`
- Technical Specs: `TECHNICAL_SPECS.md`
