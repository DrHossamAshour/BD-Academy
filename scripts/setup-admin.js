const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

// Admin user data
const adminUser = {
  name: 'Admin User',
  email: 'admin@bigdentist.com',
  password: 'admin123',
  role: 'admin',
  avatar: '/avatars/admin.jpg'
};

async function setupAdmin() {
  try {
    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://your-username:your-password@your-cluster.mongodb.net/bigdentist?retryWrites=true&w=majority';
    
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully!');

    // Import User model
    const User = require('../lib/models/User');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminUser.email });
    
    if (existingAdmin) {
      console.log('Admin user already exists!');
      console.log('Email:', adminUser.email);
      console.log('Password:', adminUser.password);
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(adminUser.password, 12);

    // Create admin user
    const newAdmin = new User({
      ...adminUser,
      password: hashedPassword
    });

    await newAdmin.save();
    
    console.log('✅ Admin user created successfully!');
    console.log('📧 Email:', adminUser.email);
    console.log('🔑 Password:', adminUser.password);
    console.log('👤 Role: Admin');
    
  } catch (error) {
    console.error('❌ Error setting up admin:', error.message);
    if (error.message.includes('IP whitelist')) {
      console.log('\n🔧 To fix MongoDB connection:');
      console.log('1. Go to MongoDB Atlas Dashboard');
      console.log('2. Navigate to Network Access');
      console.log('3. Add your current IP address to the IP whitelist');
      console.log('4. Or add 0.0.0.0/0 to allow all IPs (for development)');
    }
  } finally {
    await mongoose.disconnect();
  }
}

setupAdmin(); 