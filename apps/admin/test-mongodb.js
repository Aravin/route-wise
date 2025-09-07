// Test MongoDB connection
// Run with: node test-mongodb.js

const { MongoClient } = require('mongodb')

async function testConnection() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/routewise'
  
  console.log('🔌 Testing MongoDB connection...')
  console.log('URI:', uri.replace(/\/\/.*@/, '//***:***@')) // Hide credentials
  
  try {
    const client = new MongoClient(uri)
    await client.connect()
    
    console.log('✅ Connected to MongoDB successfully!')
    
    // Test database operations
    const db = client.db(process.env.MONGODB_DATABASE || 'routewise')
    
    // Create a test collection
    const testCollection = db.collection('test')
    
    // Insert a test document
    const testDoc = {
      message: 'Hello MongoDB!',
      timestamp: new Date()
    }
    
    const result = await testCollection.insertOne(testDoc)
    console.log('✅ Test document inserted:', result.insertedId)
    
    // Find the test document
    const foundDoc = await testCollection.findOne({ _id: result.insertedId })
    console.log('✅ Test document found:', foundDoc)
    
    // Clean up test document
    await testCollection.deleteOne({ _id: result.insertedId })
    console.log('✅ Test document cleaned up')
    
    // List collections
    const collections = await db.listCollections().toArray()
    console.log('📁 Available collections:', collections.map(c => c.name))
    
    await client.close()
    console.log('✅ Connection closed successfully!')
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:')
    console.error('Error:', error.message)
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('\n💡 Troubleshooting tips:')
      console.log('1. Make sure MongoDB is running locally')
      console.log('2. Check if the port 27017 is available')
      console.log('3. For macOS: brew services start mongodb-community')
      console.log('4. For Linux: sudo systemctl start mongod')
    }
    
    if (error.message.includes('authentication failed')) {
      console.log('\n💡 Authentication tips:')
      console.log('1. Check your username and password')
      console.log('2. Verify the database name')
      console.log('3. Check if the user has proper permissions')
    }
    
    if (error.message.includes('network')) {
      console.log('\n💡 Network tips:')
      console.log('1. Check your internet connection (for Atlas)')
      console.log('2. Verify the connection string')
      console.log('3. Check if your IP is whitelisted (for Atlas)')
    }
  }
}

// Load environment variables
require('dotenv').config({ path: '.env.local' })

testConnection()
