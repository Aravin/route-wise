# MongoDB Setup Guide for RouteWise Admin

## Option 1: Direct MongoDB Connection (Recommended)

### Local MongoDB Setup

1. **Install MongoDB locally:**
   ```bash
   # macOS with Homebrew
   brew install mongodb-community
   
   # Start MongoDB service
   brew services start mongodb-community
   
   # Or start manually
   mongod --config /usr/local/etc/mongod.conf
   ```

2. **Create environment file:**
   ```bash
   cp env.example .env.local
   ```

3. **Configure environment variables:**
   ```env
   MONGODB_URI=mongodb://localhost:27017/routewise
   MONGODB_DATABASE=routewise
   ```

### MongoDB Atlas (Cloud) Setup

1. **Create MongoDB Atlas account:**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Sign up for free account
   - Create a new cluster

2. **Configure database access:**
   - Create database user
   - Whitelist your IP address
   - Get connection string

3. **Update environment variables:**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/routewise?retryWrites=true&w=majority
   MONGODB_DATABASE=routewise
   ```

### Database Collections

The application will automatically create these collections:

- `users` - User accounts and authentication
- `organizations` - Organization information
- `onboarding` - Onboarding progress and data
- `busTypes` - Bus type configurations
- `routes` - Route definitions
- `stops` - Bus stop locations
- `fleet` - Fleet management
- `drivers` - Driver information
- `workers` - Staff information

## Option 2: API-Based Connection

If you prefer to use a separate API service:

### Create API Service

1. **Create separate API service** (Express.js, Fastify, etc.)
2. **Implement MongoDB operations** in the API service
3. **Update Next.js app** to call API endpoints instead of direct DB

### Example API Service Structure

```
api-service/
├── src/
│   ├── controllers/
│   │   ├── users.controller.js
│   │   ├── organizations.controller.js
│   │   └── onboarding.controller.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Organization.js
│   │   └── Onboarding.js
│   ├── routes/
│   │   ├── users.routes.js
│   │   ├── organizations.routes.js
│   │   └── onboarding.routes.js
│   └── app.js
├── package.json
└── .env
```

### Update Next.js App

Replace direct MongoDB calls with API calls:

```typescript
// Instead of direct DB call
const user = await mongoDBService.getUserByUserId(userId)

// Use API call
const response = await fetch(`${API_BASE_URL}/api/users/${userId}`)
const user = await response.json()
```

## Installation Steps

### 1. Install MongoDB Driver

```bash
npm install mongodb
npm install @types/mongodb --save-dev
```

### 2. Environment Setup

```bash
# Copy environment file
cp env.example .env.local

# Edit with your MongoDB connection string
nano .env.local
```

### 3. Test Connection

Create a test script to verify MongoDB connection:

```typescript
// test-mongodb.js
import { mongoDBService } from './src/lib/mongodb-service'

async function testConnection() {
  try {
    const user = await mongoDBService.createUser({
      userId: 'test_user',
      email: 'test@example.com',
      name: 'Test User'
    })
    console.log('✅ MongoDB connection successful!', user)
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error)
  }
}

testConnection()
```

### 4. Run the Application

```bash
npm run dev
```

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  userId: String, // Unique user identifier
  email: String,
  name: String,
  organizationId: ObjectId, // Reference to organizations
  onboardingComplete: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Organizations Collection
```javascript
{
  _id: ObjectId,
  userId: String, // Reference to users
  name: String,
  address: String,
  regOffice: String,
  phone: String,
  phone2: String,
  email: String,
  website: String,
  gstNumber: String,
  panNumber: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Onboarding Collection
```javascript
{
  _id: ObjectId,
  userId: String,
  organization: Object, // Embedded organization data
  business: {
    busTypes: Array,
    routes: Array,
    stops: Array,
    fleet: Array,
    drivers: Array,
    workers: Array
  },
  isComplete: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## Production Considerations

### 1. Connection Pooling
- MongoDB driver handles connection pooling automatically
- Configure pool size based on your needs

### 2. Indexing
```javascript
// Create indexes for better performance
db.users.createIndex({ "userId": 1 }, { unique: true })
db.organizations.createIndex({ "userId": 1 })
db.onboarding.createIndex({ "userId": 1 })
```

### 3. Security
- Use environment variables for connection strings
- Enable MongoDB authentication
- Use SSL/TLS for production connections
- Implement proper access controls

### 4. Monitoring
- Set up MongoDB monitoring
- Monitor connection pool usage
- Track query performance

## Troubleshooting

### Common Issues

1. **Connection refused:**
   - Check if MongoDB is running
   - Verify connection string
   - Check firewall settings

2. **Authentication failed:**
   - Verify username/password
   - Check database user permissions
   - Ensure IP is whitelisted (Atlas)

3. **Database not found:**
   - MongoDB creates databases automatically
   - Check database name in connection string

### Debug Mode

Enable MongoDB debug logging:

```env
DEBUG=mongodb:*
```

## Migration from Mock Database

The application is already set up to use the real MongoDB service. The mock database service (`src/lib/database.ts`) can be removed once you confirm MongoDB is working properly.

## Support

- [MongoDB Documentation](https://docs.mongodb.com/)
- [MongoDB Node.js Driver](https://docs.mongodb.com/drivers/node/)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
