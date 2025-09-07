# RouteWise Admin

The admin application for RouteWise - a comprehensive dashboard for bus operators to manage their business operations.

## Overview

This is the B2B (Business-to-Business) application that allows bus operators to:

- Manage their bus fleet
- Create and manage routes
- Schedule trips
- Handle bookings and customer support
- View analytics and reports
- Manage drivers and conductors
- Configure multi-tenant settings

## Features

### Fleet Management
- Add, edit, and manage bus fleet
- Track bus status (active, maintenance, inactive)
- Service scheduling and maintenance tracking
- Driver and conductor assignments

### Route & Trip Management
- Create and manage bus routes
- Schedule trips with seat maps
- Real-time trip status updates
- Recurring trip management

### Booking Management
- View and manage customer bookings
- Handle cancellations and refunds
- Customer support tools
- Booking analytics

### Analytics Dashboard
- Revenue tracking
- Occupancy rates
- Performance metrics
- Custom reports

### Multi-tenant Support
- Custom branding
- Payment gateway configuration
- Notification settings
- User role management

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB
- Redis (optional)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Copy environment variables:
```bash
cp env.example .env.local
```

3. Update environment variables in `.env.local`

4. Start development server:
```bash
npm run dev
```

The admin app will be available at `http://localhost:3001`

## User Roles

- **Admin**: Full access to all features
- **Operator**: Manage buses, routes, trips
- **Dispatcher**: Manage trips and bookings
- **Driver**: View assigned trips
- **Conductor**: Manage onboard bookings

## API Integration

The admin app communicates with the shared API backend for all data operations. Make sure the API server is running on the configured port.

## Deployment

The admin app is containerized and can be deployed using Docker Compose or any container orchestration platform.

## Development

### Project Structure
```
src/
├── app/                 # Next.js app directory
├── components/          # React components
│   ├── admin/          # Admin-specific components
│   └── layout/         # Layout components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
└── types/              # TypeScript type definitions
```

### Key Components
- `AdminDashboard`: Main dashboard with overview metrics
- `FleetManagement`: Bus fleet management interface
- `AdminHeader`: Top navigation bar
- `AdminSidebar`: Side navigation menu

## Contributing

Please follow the project's coding standards and submit pull requests for any improvements.
