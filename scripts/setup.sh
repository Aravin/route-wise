#!/bin/bash

# RouteWise Setup Script
echo "🚀 Setting up RouteWise - Multi-Tenant Bus Ticket Booking Platform"
echo "=================================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ and try again."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check if MongoDB is running (optional)
if command -v mongod &> /dev/null; then
    if pgrep -x "mongod" > /dev/null; then
        echo "✅ MongoDB is running"
    else
        echo "⚠️  MongoDB is not running. Please start MongoDB or use a cloud instance."
    fi
else
    echo "⚠️  MongoDB not found. Please install MongoDB or use a cloud instance."
fi

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd apps/api
npm install
cd ../..

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd apps/web
npm install
cd ../..

# Install shared package dependencies
echo "📦 Installing shared package dependencies..."
cd packages/shared
npm install
cd ../..

# Create environment files if they don't exist
echo "⚙️  Setting up environment files..."

if [ ! -f "apps/api/.env" ]; then
    echo "📝 Creating backend environment file..."
    cp apps/api/env.example apps/api/.env
    echo "✅ Created apps/api/.env - Please update with your configuration"
fi

if [ ! -f "apps/web/.env.local" ]; then
    echo "📝 Creating frontend environment file..."
    cp apps/web/env.example apps/web/.env.local
    echo "✅ Created apps/web/.env.local - Please update with your configuration"
fi

# Build shared package
echo "🔨 Building shared package..."
cd packages/shared
npm run build
cd ../..

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Update environment files with your configuration:"
echo "   - apps/api/.env"
echo "   - apps/web/.env.local"
echo ""
echo "2. Start MongoDB (if using local instance):"
echo "   mongod"
echo ""
echo "3. Start the development servers:"
echo "   npm run dev"
echo ""
echo "4. Access the application:"
echo "   - Frontend: http://localhost:3000"
echo "   - Backend API: http://localhost:5000"
echo "   - API Documentation: http://localhost:5000/api-docs"
echo ""
echo "📚 Documentation:"
echo "   - README.md - Project overview and setup"
echo "   - TECHNICAL_SPECS.md - Technical specifications"
echo "   - API Docs: http://localhost:5000/api-docs"
echo ""
echo "🚀 Happy coding with RouteWise!"
