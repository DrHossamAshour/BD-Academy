const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

// Sample data
const adminUsers = [
  {
    name: 'Admin User',
    email: 'admin@bigdentist.com',
    password: 'admin123',
    role: 'admin',
    avatar: '/avatars/admin.jpg'
  },
  {
    name: 'Dr. Hossam',
    email: 'dr.hossam@bigdentist.com',
    password: 'Dr.hossam@123',
    role: 'admin',
    avatar: '/avatars/dr-hossam.jpg'
  }
];

const instructorUsers = [
  {
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@bigdentist.com',
    password: 'instructor123',
    role: 'instructor',
    avatar: '/avatars/sarah.jpg'
  },
  {
    name: 'Dr. Michael Chen',
    email: 'michael.chen@bigdentist.com',
    password: 'instructor123',
    role: 'instructor',
    avatar: '/avatars/michael.jpg'
  },
  {
    name: 'Dr. Emily Rodriguez',
    email: 'emily.rodriguez@bigdentist.com',
    password: 'instructor123',
    role: 'instructor',
    avatar: '/avatars/emily.jpg'
  }
];

const sampleCourses = [
  {
    title: 'Dental Anatomy Fundamentals',
    description: 'Learn the essential anatomy of teeth and oral structures. This comprehensive course covers everything from basic tooth morphology to complex anatomical relationships.',
    image: '/images/course-1.jpg',
    instructor: 'Dr. Sarah Johnson',
    instructorId: 'sarah-johnson-id',
    price: 99,
    originalPrice: 129,
    rating: 4.8,
    reviews: 1250,
    students: 1250,
    duration: '8 hours',
    category: 'Anatomy',
    level: 'Beginner',
    isFeatured: true,
    status: 'published',
    sections: [
      {
        title: 'Introduction to Dental Anatomy',
        lessons: [
          {
            title: 'Overview of Tooth Structure',
            description: 'Understanding the basic components of teeth',
            duration: '15 min',
            isPublic: true,
            vimeoUrl: 'https://player.vimeo.com/video/123456789?h=abc123&title=0&byline=0&portrait=0'
          },
          {
            title: 'Tooth Surfaces and Landmarks',
            description: 'Identifying key anatomical landmarks',
            duration: '20 min',
            isPublic: false,
            vimeoUrl: 'https://player.vimeo.com/video/123456790?h=abc123&title=0&byline=0&portrait=0'
          }
        ]
      }
    ]
  },
  {
    title: 'Advanced Restorative Techniques',
    description: 'Master modern restorative dentistry procedures including composite restorations, crowns, and bridges.',
    image: '/images/course-2.jpg',
    instructor: 'Dr. Michael Chen',
    instructorId: 'michael-chen-id',
    price: 149,
    originalPrice: 199,
    rating: 4.9,
    reviews: 890,
    students: 890,
    duration: '12 hours',
    category: 'Restorative',
    level: 'Advanced',
    isFeatured: true,
    status: 'published',
    sections: [
      {
        title: 'Composite Restorations',
        lessons: [
          {
            title: 'Material Selection',
            description: 'Choosing the right composite materials',
            duration: '25 min',
            isPublic: true,
            vimeoUrl: 'https://player.vimeo.com/video/123456791?h=abc123&title=0&byline=0&portrait=0'
          },
          {
            title: 'Preparation Techniques',
            description: 'Proper cavity preparation methods',
            duration: '30 min',
            isPublic: false,
            vimeoUrl: 'https://player.vimeo.com/video/123456792?h=abc123&title=0&byline=0&portrait=0'
          }
        ]
      }
    ]
  },
  {
    title: 'Orthodontics for Beginners',
    description: 'Introduction to orthodontic principles and practices for dental professionals.',
    image: '/images/course-3.jpg',
    instructor: 'Dr. Emily Rodriguez',
    instructorId: 'emily-rodriguez-id',
    price: 129,
    originalPrice: 159,
    rating: 4.7,
    reviews: 1100,
    students: 1100,
    duration: '10 hours',
    category: 'Orthodontics',
    level: 'Beginner',
    isFeatured: true,
    status: 'published',
    sections: [
      {
        title: 'Basic Orthodontic Concepts',
        lessons: [
          {
            title: 'Malocclusion Types',
            description: 'Understanding different types of malocclusion',
            duration: '20 min',
            isPublic: true,
            vimeoUrl: 'https://player.vimeo.com/video/123456793?h=abc123&title=0&byline=0&portrait=0'
          },
          {
            title: 'Treatment Planning',
            description: 'Developing comprehensive treatment plans',
            duration: '35 min',
            isPublic: false,
            vimeoUrl: 'https://player.vimeo.com/video/123456794?h=abc123&title=0&byline=0&portrait=0'
          }
        ]
      }
    ]
  }
];

async function setupDatabase() {
  try {
    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://your-username:your-password@your-cluster.mongodb.net/bigdentist?retryWrites=true&w=majority';
    
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully!');

    // Import models
    const User = require('../lib/models/User');
    const Course = require('../lib/models/Course');

    console.log('\n👥 Setting up users...');

    // Create admin users
    for (const adminData of adminUsers) {
      const existingAdmin = await User.findOne({ email: adminData.email });
      
      if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash(adminData.password, 12);
        const newAdmin = new User({
          ...adminData,
          password: hashedPassword
        });
        await newAdmin.save();
        console.log(`✅ Created admin: ${adminData.email} (${adminData.password})`);
      } else {
        console.log(`ℹ️  Admin already exists: ${adminData.email}`);
      }
    }

    // Create instructor users
    for (const instructorData of instructorUsers) {
      const existingInstructor = await User.findOne({ email: instructorData.email });
      
      if (!existingInstructor) {
        const hashedPassword = await bcrypt.hash(instructorData.password, 12);
        const newInstructor = new User({
          ...instructorData,
          password: hashedPassword
        });
        await newInstructor.save();
        console.log(`✅ Created instructor: ${instructorData.email} (${instructorData.password})`);
      } else {
        console.log(`ℹ️  Instructor already exists: ${instructorData.email}`);
      }
    }

    console.log('\n📚 Setting up courses...');

    // Create sample courses
    for (const courseData of sampleCourses) {
      const existingCourse = await Course.findOne({ title: courseData.title });
      
      if (!existingCourse) {
        const newCourse = new Course(courseData);
        await newCourse.save();
        console.log(`✅ Created course: ${courseData.title}`);
      } else {
        console.log(`ℹ️  Course already exists: ${courseData.title}`);
      }
    }

    console.log('\n🎉 Database setup completed successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    adminUsers.forEach(admin => {
      console.log(`👑 Admin: ${admin.email} | Password: ${admin.password}`);
    });
    
    instructorUsers.forEach(instructor => {
      console.log(`👨‍🏫 Instructor: ${instructor.email} | Password: ${instructor.password}`);
    });

    console.log('\n🔗 You can now login at: http://localhost:3000/auth/login');
    
  } catch (error) {
    console.error('❌ Error setting up database:', error.message);
    
    if (error.message.includes('IP whitelist')) {
      console.log('\n🔧 To fix MongoDB connection:');
      console.log('1. Go to MongoDB Atlas Dashboard: https://cloud.mongodb.com');
      console.log('2. Select your cluster');
      console.log('3. Click "Network Access" in the left sidebar');
      console.log('4. Click "Add IP Address"');
      console.log('5. Add your current IP OR add 0.0.0.0/0 (for development)');
      console.log('6. Click "Confirm"');
      console.log('\n📝 Then update your .env.local file with the correct MONGODB_URI');
    }
  } finally {
    await mongoose.disconnect();
  }
}

setupDatabase(); 