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

async function dbConnect() {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error(
      'Please define the MONGODB_URI environment variable inside .env'
    );
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    
    // Check for IP whitelist related errors
    const error = e as Error;
    const errorMessage = error.message?.toLowerCase() || '';
    const isIPWhitelistError = 
      errorMessage.includes('ip whitelist') ||
      errorMessage.includes('not authorized') ||
      errorMessage.includes('authentication failed') ||
      errorMessage.includes('network access') ||
      (errorMessage.includes('connection') && errorMessage.includes('refused')) ||
      (errorMessage.includes('enotfound') && errorMessage.includes('mongodb.net'));

    if (isIPWhitelistError) {
      console.error('🚨 MongoDB Connection Failed - Possible IP Whitelist Issue');
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.error('');
      console.error('🔧 To fix this MongoDB Atlas connection issue:');
      console.error('');
      console.error('1. 🌐 Go to MongoDB Atlas Dashboard:');
      console.error('   → https://cloud.mongodb.com');
      console.error('');
      console.error('2. 🎯 Select your cluster and navigate to "Network Access"');
      console.error('');
      console.error('3. ➕ Click "Add IP Address" and choose ONE of these options:');
      console.error('   → Add your current IP address (recommended for production)');
      console.error('   → Add 0.0.0.0/0 to allow all IPs (for development only)');
      console.error('');
      console.error('4. ✅ Click "Confirm" and wait for the changes to apply');
      console.error('');
      console.error('5. 📝 Verify your .env.local file has the correct MONGODB_URI');
      console.error('');
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.error('💡 Original error:', error.message);
      console.error('');
    }
    
    throw e;
  }

  return cached.conn;
}

export default dbConnect;