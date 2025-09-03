# RouteWise - Multi-Tenant Bus Ticket Booking Platform

> **Your Journey, Simplified** - Smart Bus Booking for Smarter Travel

RouteWise is a comprehensive, scalable, and multi-tenant platform for managing and booking bus tickets. The system caters to multiple tenants (bus operators), who can manage their own sub-tenants (organizations or branches), depots, and diverse bus fleets.

## 🚀 Features

### Core Functionality
- **Multi-Tenancy**: Complete data isolation between tenants with configurable settings
- **Real-time Booking**: Interactive seat selection with instant confirmation
- **Payment Integration**: Secure payment processing with multiple gateways
- **Notification System**: Automated notifications via email, SMS, and push
- **Review System**: User ratings and feedback for buses and depots
- **Analytics Dashboard**: Comprehensive reporting and insights

### Technical Features
- **TypeScript**: Full-stack TypeScript implementation
- **Modern UI**: Built with Next.js 14 and shadcn/ui components
- **RESTful API**: Level 3 REST maturity with HATEOAS
- **Cloud-Ready**: NoSQL database with cloud provider flexibility
- **Authentication**: JWT-based auth with refresh tokens
- **API Documentation**: Comprehensive Swagger/OpenAPI documentation

## 🏗️ Architecture

### Tech Stack

**Backend:**
- Node.js with Express.js and TypeScript
- MongoDB with Mongoose ODM
- JWT authentication with refresh tokens
- Swagger/OpenAPI documentation
- Winston logging
- Rate limiting and security middleware

**Frontend:**
- Next.js 14 with TypeScript
- shadcn/ui components with Tailwind CSS
- React Query for state management
- NextAuth.js for authentication
- React Hook Form with Zod validation

**Database:**
- MongoDB (cloud provider agnostic)
- Redis for caching (optional)
- Cloud storage for files (AWS S3, Google Cloud)

## 📁 Project Structure

```
route-wise/
├── apps/
│   ├── web/                 # Next.js frontend
│   │   ├── src/
│   │   │   ├── app/         # App router pages
│   │   │   ├── components/  # React components
│   │   │   ├── hooks/       # Custom hooks
│   │   │   ├── lib/         # Utilities and configurations
│   │   │   └── types/       # TypeScript types
│   │   └── package.json
│   └── api/                 # Express.js backend
│       ├── src/
│       │   ├── controllers/ # Route controllers
│       │   ├── middleware/  # Express middleware
│       │   ├── models/      # MongoDB models
│       │   ├── routes/      # API routes
│       │   ├── services/    # Business logic
│       │   └── utils/       # Utility functions
│       └── package.json
├── packages/
│   └── shared/              # Shared types and utilities
│       ├── src/
│       │   ├── types/       # Shared TypeScript types
│       │   └── utils/       # Shared utility functions
│       └── package.json
├── docs/                    # API documentation
├── scripts/                 # Build and deployment scripts
└── docker/                  # Docker configurations
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm 9+
- MongoDB (local or cloud)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd route-wise
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Environment Setup**
   ```bash
   # Backend
   cd apps/api
   cp env.example .env
   # Edit .env with your configuration
   
   # Frontend
   cd ../web
   cp env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start Development Servers**
   ```bash
   # From root directory
   npm run dev
   ```

   This will start:
   - Backend API: http://localhost:5000
   - Frontend: http://localhost:3000
   - API Documentation: http://localhost:5000/api-docs

### Environment Variables

**Backend (.env):**
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/routewise
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=http://localhost:3000
```

**Frontend (.env.local):**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret
```

## 📚 API Documentation

The API follows REST maturity model Level 3 with HATEOAS. Complete documentation is available at:
- **Swagger UI**: http://localhost:5000/api-docs
- **OpenAPI Spec**: http://localhost:5000/api-docs.json

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

## 🏢 Multi-Tenancy

RouteWise implements a hybrid multi-tenancy approach:

- **Database per tenant**: For large tenants requiring complete isolation
- **Schema-based**: Single database with tenant_id in collections
- **Configurable**: Based on tenant size and requirements

### Tenant Management

Each tenant can:
- Configure branding (logo, colors, favicon)
- Set up payment gateways (Stripe, Razorpay)
- Configure notification settings
- Define user roles and permissions
- Set booking policies and cancellation rules

## 🔐 Authentication & Authorization

- **JWT-based**: Access tokens (15min) + refresh tokens (7 days)
- **Role-based**: User, Admin, Operator, Driver, Conductor roles
- **Multi-tenant**: Tenant-specific access control
- **Secure**: Password hashing with bcrypt, rate limiting

## 💳 Payment Integration

Supported payment gateways:
- **Stripe**: Credit/debit cards, digital wallets
- **Razorpay**: UPI, net banking, wallets
- **Cash**: For offline bookings

## 📱 Features

### User Features
- Search and book buses
- Interactive seat selection
- Real-time booking confirmation
- Booking history and management
- Review and rating system
- Profile management

### Admin Features
- Tenant management
- Route and bus management
- Booking analytics
- User management
- Payment tracking
- Notification management

### Operator Features
- Trip management
- Real-time tracking
- Passenger management
- Revenue reporting

## 🧪 Testing

```bash
# Run all tests
npm test

# Run backend tests
cd apps/api && npm test

# Run frontend tests
cd apps/web && npm test
```

## 🚀 Deployment

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d
```

### Cloud Deployment

The application is designed to be cloud-native and can be deployed on:
- **AWS**: ECS, Lambda, RDS, S3
- **Google Cloud**: Cloud Run, Cloud SQL, Cloud Storage
- **Azure**: Container Instances, SQL Database, Blob Storage
- **Vercel**: For frontend deployment
- **Railway/Render**: For full-stack deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [API Docs](http://localhost:5000/api-docs)
- **Issues**: [GitHub Issues](https://github.com/your-org/route-wise/issues)
- **Email**: support@routewise.com

## 🎯 Roadmap

- [ ] Mobile app (React Native)
- [ ] Real-time tracking with GPS
- [ ] AI-powered route optimization
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Integration with travel aggregators
- [ ] Loyalty program
- [ ] Corporate booking portal

---

**RouteWise** - *The Wise Way to Go* 🚌✨