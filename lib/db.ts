import mongoose from 'mongoose';

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

/**
 * Enhanced error handler for MongoDB Atlas connection issues
 */
function createMongoDBError(error: any): Error {
  const errorMessage = error.message || error.toString();
  
  // Check for authentication issues first (more specific)
  if (errorMessage.includes('bad auth') ||
      errorMessage.includes('auth fails') ||
      (errorMessage.includes('Authentication failed') && !errorMessage.includes('not authorized'))) {
    return new Error(`
🚨 MongoDB Authentication Error:

Invalid username or password for MongoDB Atlas.

Please check:
1. Your MongoDB Atlas username and password
2. Your MONGODB_URI connection string format
3. Ensure your database user has proper permissions

Expected format: mongodb+srv://username:password@cluster.mongodb.net/database

Original error: ${errorMessage}
    `);
  }

  // Check for MongoDB Atlas IP whitelist issues
  if (errorMessage.includes('not authorized on admin to execute command') || 
      errorMessage.includes('IP not allowed')) {
    return new Error(`
🚨 MongoDB Atlas IP Whitelist Error:

Your IP address is not whitelisted in MongoDB Atlas.

To fix this issue:
1. Go to https://cloud.mongodb.com
2. Select your cluster
3. Click "Network Access" in the left sidebar
4. Click "Add IP Address"
5. Either:
   - Add your current IP address, OR
   - Add 0.0.0.0/0 (allows all IPs - for development only)
6. Click "Confirm" and wait for the changes to apply

Original error: ${errorMessage}
    `);
  }

  // Check for connection timeout issues
  if (errorMessage.includes('timeout') || errorMessage.includes('ETIMEDOUT')) {
    return new Error(`
🚨 MongoDB Connection Timeout:

Unable to connect to MongoDB Atlas. This could be due to:
1. Network connectivity issues
2. IP not whitelisted in MongoDB Atlas
3. Incorrect connection string

Please check:
1. Your internet connection
2. MongoDB Atlas IP whitelist settings
3. Your MONGODB_URI in the .env file

Original error: ${errorMessage}
    `);
  }

  // Check for connection string format issues
  if (errorMessage.includes('Invalid connection string') || 
      errorMessage.includes('URI malformed')) {
    return new Error(`
🚨 MongoDB Connection String Error:

Your MONGODB_URI format is invalid.

Expected format: mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority

Please check your .env file and ensure the connection string is correct.

Original error: ${errorMessage}
    `);
  }

  // Return original error with helpful context
  return new Error(`
🚨 MongoDB Connection Error:

${errorMessage}

Common solutions:
1. Check if MongoDB Atlas cluster is running
2. Verify your IP is whitelisted
3. Confirm your connection string is correct
4. Ensure your database user has proper permissions
  `);
}

async function dbConnect() {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error(`
🚨 Missing MongoDB Configuration:

Please define the MONGODB_URI environment variable in your .env file.

Example:
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bigdentist?retryWrites=true&w=majority

To get your connection string:
1. Go to https://cloud.mongodb.com
2. Select your cluster
3. Click "Connect" → "Connect your application"
4. Copy the connection string and update the password
    `);
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      // Add connection timeout and retry options
      serverSelectionTimeoutMS: 10000, // 10 seconds
      connectTimeoutMS: 10000, // 10 seconds
      maxPoolSize: 10, // Maintain up to 10 socket connections
      retryWrites: true,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('✅ Successfully connected to MongoDB Atlas');
      return mongoose;
    }).catch((error) => {
      console.error('❌ MongoDB connection failed:', error.message);
      throw createMongoDBError(error);
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    // Re-throw the enhanced error
    throw e;
  }

  return cached.conn;
}

export default dbConnect;