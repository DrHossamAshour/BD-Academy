import dbConnect from './db';
import Course from './models/Course';
import User from './models/User';
import Order from './models/Order';
import cache, { CACHE_KEYS, CACHE_TTL } from './cache';

// Course Database Operations
export const courseDB = {
  // Get all courses for an instructor
  async getInstructorCourses(instructorId: string) {
    const cacheKey = CACHE_KEYS.INSTRUCTOR_COURSES(instructorId);
    const cached = cache.get(cacheKey);
    
    if (cached) {
      console.log('Cache hit for instructor courses:', instructorId);
      return cached;
    }

    try {
      await dbConnect();
      console.log('Getting courses for instructor:', instructorId);
      
      const courses = await Course.find({ instructorId }).sort({ createdAt: -1 });
      console.log('Found courses for instructor:', courses.length);
      
      // Cache for 5 minutes
      cache.set(cacheKey, courses, CACHE_TTL.MEDIUM);
      
      return courses;
    } catch (error) {
      console.error('Error getting instructor courses:', error);
      return [];
    }
  },

  // Get all courses (for admin)
  async getAllCourses() {
    const cacheKey = CACHE_KEYS.COURSES_PUBLIC;
    const cached = cache.get(cacheKey);
    
    if (cached) {
      console.log('Cache hit for all courses');
      return cached;
    }

    try {
      await dbConnect();
      console.log('Getting all courses from MongoDB');
      
      const courses = await Course.find({}).sort({ createdAt: -1 });
      console.log('Total courses in MongoDB:', courses.length);
      
      // Cache for 5 minutes
      cache.set(cacheKey, courses, CACHE_TTL.MEDIUM);
      
      return courses;
    } catch (error) {
      console.error('Error getting all courses:', error);
      return [];
    }
  },

  // Get a single course by ID
  async getCourseById(id: string) {
    const cacheKey = CACHE_KEYS.COURSE_BY_ID(id);
    const cached = cache.get(cacheKey);
    
    if (cached) {
      console.log('Cache hit for course:', id);
      return cached;
    }

    try {
      await dbConnect();
      const course = await Course.findById(id);
      
      if (course) {
        // Cache for 30 minutes
        cache.set(cacheKey, course, CACHE_TTL.LONG);
      }
      
      return course;
    } catch (error) {
      console.error('Error getting course by ID:', error);
      return null;
    }
  },

  // Create a new course
  async createCourse(courseData: any) {
    try {
      await dbConnect();
      
      const newCourse = new Course({
        ...courseData,
        status: courseData.isPublished ? 'published' : 'draft'
      });

      const savedCourse = await newCourse.save();
      console.log('Course created in MongoDB:', savedCourse._id);
      
      // Invalidate relevant caches
      cache.delete(CACHE_KEYS.COURSES_PUBLIC);
      cache.delete(CACHE_KEYS.INSTRUCTOR_COURSES(courseData.instructorId));
      
      return savedCourse;
    } catch (error) {
      console.error('Error creating course:', error);
      throw error;
    }
  },

  // Update a course
  async updateCourse(id: string, updateData: any) {
    try {
      await dbConnect();
      
      const updateDoc = {
        ...updateData,
        status: updateData.isPublished ? 'published' : 'draft'
      };

      const updatedCourse = await Course.findByIdAndUpdate(
        id,
        updateDoc,
        { new: true, runValidators: true }
      );

      if (updatedCourse) {
        console.log('Course updated in MongoDB:', id);
        
        // Invalidate relevant caches
        cache.delete(CACHE_KEYS.COURSE_BY_ID(id));
        cache.delete(CACHE_KEYS.COURSES_PUBLIC);
        cache.delete(CACHE_KEYS.INSTRUCTOR_COURSES(updatedCourse.instructorId));
        
        return updatedCourse;
      }
      
      return null;
    } catch (error) {
      console.error('Error updating course:', error);
      return null;
    }
  },

  // Delete a course
  async deleteCourse(id: string) {
    try {
      await dbConnect();
      const course = await Course.findById(id);
      const result = await Course.findByIdAndDelete(id);
      
      if (result) {
        console.log('Course deleted from MongoDB:', id);
        
        // Invalidate relevant caches
        cache.delete(CACHE_KEYS.COURSE_BY_ID(id));
        cache.delete(CACHE_KEYS.COURSES_PUBLIC);
        if (course?.instructorId) {
          cache.delete(CACHE_KEYS.INSTRUCTOR_COURSES(course.instructorId));
        }
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error deleting course:', error);
      return false;
    }
  },

  // Get course statistics
  async getStats(instructorId?: string) {
    const cacheKey = CACHE_KEYS.COURSE_STATS(instructorId);
    const cached = cache.get(cacheKey);
    
    if (cached) {
      console.log('Cache hit for course stats');
      return cached;
    }

    try {
      await dbConnect();
      
      const filter = instructorId ? { instructorId } : {};
      const courses = await Course.find(filter);

      const stats = {
        totalCourses: courses.length,
        publishedCourses: courses.filter(course => course.status === 'published').length,
        draftCourses: courses.filter(course => course.status === 'draft').length,
        totalStudents: courses.reduce((sum, course) => sum + course.students, 0),
        totalRevenue: courses.reduce((sum, course) => sum + course.revenue, 0),
        averageRating: courses.length > 0 
          ? courses.reduce((sum, course) => sum + course.rating, 0) / courses.length 
          : 0
      };
      
      // Cache for 10 minutes
      cache.set(cacheKey, stats, CACHE_TTL.MEDIUM * 2);
      
      return stats;
    } catch (error) {
      console.error('Error getting stats:', error);
      return {
        totalCourses: 0,
        publishedCourses: 0,
        draftCourses: 0,
        totalStudents: 0,
        totalRevenue: 0,
        averageRating: 0
      };
    }
  },

  // Debug function to get database state
  async getDatabaseState() {
    try {
      await dbConnect();
      const totalCourses = await Course.countDocuments();
      const courses = await Course.find({}, '_id title instructorId status').sort({ createdAt: -1 });
      
      return {
        totalCourses,
        courses: courses.map(c => ({
          id: c._id?.toString(),
          title: c.title,
          instructorId: c.instructorId,
          status: c.status
        }))
      };
    } catch (error) {
      console.error('Error getting database state:', error);
      return { totalCourses: 0, courses: [] };
    }
  }
};

// User Database Operations
export const userDB = {
  // Get user by ID
  async getUserById(id: string) {
    const cacheKey = CACHE_KEYS.USER_BY_ID(id);
    const cached = cache.get(cacheKey);
    
    if (cached) {
      console.log('Cache hit for user:', id);
      return cached;
    }

    try {
      await dbConnect();
      const user = await User.findById(id).select('-password');
      
      if (user) {
        // Cache for 30 minutes
        cache.set(cacheKey, user, CACHE_TTL.LONG);
      }
      
      return user;
    } catch (error) {
      console.error('Error getting user by ID:', error);
      return null;
    }
  },

  // Get user by email
  async getUserByEmail(email: string) {
    const cacheKey = CACHE_KEYS.USER_BY_EMAIL(email);
    const cached = cache.get(cacheKey);
    
    if (cached) {
      console.log('Cache hit for user email:', email);
      return cached;
    }

    try {
      await dbConnect();
      const user = await User.findOne({ email });
      
      if (user) {
        // Cache for 30 minutes
        cache.set(cacheKey, user, CACHE_TTL.LONG);
      }
      
      return user;
    } catch (error) {
      console.error('Error getting user by email:', error);
      return null;
    }
  },

  // Create user
  async createUser(userData: any) {
    try {
      await dbConnect();
      const user = new User(userData);
      const savedUser = await user.save();
      
      // Invalidate user stats cache
      cache.delete(CACHE_KEYS.USER_STATS);
      
      return savedUser;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  // Update user
  async updateUser(id: string, updateData: any) {
    try {
      await dbConnect();
      const user = await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
      
      if (user) {
        // Invalidate relevant caches
        cache.delete(CACHE_KEYS.USER_BY_ID(id));
        cache.delete(CACHE_KEYS.USER_BY_EMAIL(user.email));
      }
      
      return user;
    } catch (error) {
      console.error('Error updating user:', error);
      return null;
    }
  },

  // Get all users (for admin)
  async getAllUsers() {
    try {
      await dbConnect();
      const users = await User.find({}).select('-password').sort({ createdAt: -1 });
      return users;
    } catch (error) {
      console.error('Error getting all users:', error);
      return [];
    }
  },

  // Get user statistics
  async getUserStats() {
    try {
      await dbConnect();
      const totalUsers = await User.countDocuments();
      const students = await User.countDocuments({ role: 'student' });
      const instructors = await User.countDocuments({ role: 'instructor' });
      const admins = await User.countDocuments({ role: 'admin' });

      return {
        totalUsers,
        students,
        instructors,
        admins
      };
    } catch (error) {
      console.error('Error getting user stats:', error);
      return {
        totalUsers: 0,
        students: 0,
        instructors: 0,
        admins: 0
      };
    }
  }
};

// Order Database Operations
export const orderDB = {
  // Get orders by user ID
  async getOrdersByUserId(userId: string) {
    try {
      await dbConnect();
      const orders = await Order.find({ userId }).populate('courseId').sort({ createdAt: -1 });
      return orders;
    } catch (error) {
      console.error('Error getting orders by user ID:', error);
      return [];
    }
  },

  // Get all orders (for admin)
  async getAllOrders() {
    try {
      await dbConnect();
      const orders = await Order.find({}).populate('userId courseId').sort({ createdAt: -1 });
      return orders;
    } catch (error) {
      console.error('Error getting all orders:', error);
      return [];
    }
  },

  // Create order
  async createOrder(orderData: any) {
    try {
      await dbConnect();
      const order = new Order(orderData);
      const savedOrder = await order.save();
      return savedOrder;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  // Update order
  async updateOrder(id: string, updateData: any) {
    try {
      await dbConnect();
      const order = await Order.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
      return order;
    } catch (error) {
      console.error('Error updating order:', error);
      return null;
    }
  },

  // Get order statistics
  async getOrderStats() {
    try {
      await dbConnect();
      const totalOrders = await Order.countDocuments();
      const completedOrders = await Order.countDocuments({ status: 'completed' });
      const pendingOrders = await Order.countDocuments({ status: 'pending' });
      const totalRevenue = await Order.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]);

      return {
        totalOrders,
        completedOrders,
        pendingOrders,
        totalRevenue: totalRevenue[0]?.total || 0
      };
    } catch (error) {
      console.error('Error getting order stats:', error);
      return {
        totalOrders: 0,
        completedOrders: 0,
        pendingOrders: 0,
        totalRevenue: 0
      };
    }
  }
}; 