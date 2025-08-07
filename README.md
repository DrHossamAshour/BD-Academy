# BigDentist Academy - Production-Ready Dental Education Platform

A comprehensive dental education platform built with Next.js 14, MongoDB, NextAuth.js, Stripe payments, and Vimeo video integration.

## 🚀 Features

- **Authentication System**: Secure user registration and login with NextAuth.js and bcrypt
- **Course Management**: Complete CRUD operations for courses and lessons
- **Payment Integration**: Stripe-powered payment processing with webhooks
- **Video Lessons**: Vimeo video player integration with secure access control
- **Database**: MongoDB with Mongoose ODM for data persistence
- **Security**: Input validation with Zod, CSRF protection, and secure session management
- **Responsive Design**: Mobile-first design with Tailwind CSS

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Radix UI
- **Backend**: Next.js API Routes, NextAuth.js
- **Database**: MongoDB with Mongoose
- **Payments**: Stripe with webhooks
- **Video**: Vimeo Player API
- **Authentication**: NextAuth.js with JWT sessions
- **Validation**: Zod for type-safe input validation

## 📋 Prerequisites

- Node.js 18+ 
- MongoDB Atlas account or local MongoDB instance
- Stripe account with API keys (for payments)
- Vimeo account with access token (for video content)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/DrHossamAshour/BD-Academy.git
   cd BD-Academy
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your environment variables in `.env.local`:
   ```env
   # MongoDB Atlas (recommended) or local MongoDB
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bigdentist?retryWrites=true&w=majority
   
   # NextAuth (generate secret with: openssl rand -base64 32)
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secure-nextauth-secret-here
   
   # Stripe (optional - for payments)
   STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   
   # Vimeo (optional - for video content)
   VIMEO_ACCESS_TOKEN=your-vimeo-access-token
   ```

   **📚 For detailed MongoDB Atlas setup with IP whitelisting, see [MONGODB_SETUP.md](MONGODB_SETUP.md)**

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Models

### User Model
- Authentication credentials
- Enrolled courses
- Completed lessons
- Certificates

### Course Model
- Course metadata (title, description, pricing)
- Instructor information
- Lesson references
- Enrollment statistics

### Lesson Model
- Lesson content and ordering
- Vimeo video URLs and IDs
- Resources and materials
- Preview settings

### Order Model
- Payment information
- Course enrollment tracking
- Stripe integration data

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/[...nextauth]` - NextAuth.js authentication

### Courses
- `GET /api/courses` - List courses with filtering
- `POST /api/courses` - Create new course (instructor/admin only)
- `GET /api/courses/[id]` - Get course details with lessons
- `PUT /api/courses/[id]` - Update course (owner/admin only)
- `DELETE /api/courses/[id]` - Delete course (owner/admin only)

### Lessons
- `GET /api/lessons?courseId=...` - Get lessons for a course
- `POST /api/lessons` - Create new lesson (instructor/admin only)

### Orders
- `GET /api/orders` - User's order history
- `POST /api/orders` - Create new order
- `PATCH /api/orders` - Update order status (webhook)

### Payments
- `POST /api/payments/intent` - Create Stripe payment intent
- `POST /api/payments/webhook` - Handle Stripe webhooks

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **Input Validation**: Zod schemas for API validation
- **Authentication**: JWT-based sessions with NextAuth.js
- **Authorization**: Role-based access control
- **CORS Protection**: Configured for production security
- **Environment Variables**: Sensitive data protection

## 🎥 Vimeo Integration

The platform uses Vimeo for video hosting with:
- Secure video URLs stored in database
- Responsive video player component
- Access control for enrolled users only
- Video ID extraction from Vimeo URLs

## 💳 Stripe Payment Flow

1. User selects course and proceeds to checkout
2. Order is created in pending status
3. Stripe payment intent is generated
4. User completes payment on frontend
5. Stripe webhook confirms payment
6. User is enrolled in course automatically

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository to Vercel**
2. **Set environment variables** in Vercel dashboard
3. **Configure Stripe webhook endpoint**: `https://yourdomain.com/api/payments/webhook`
4. **Deploy**: Vercel will handle the build and deployment

### Environment Variables for Production
- Set `NEXTAUTH_URL` to your production domain
- Use production Stripe keys
- Configure MongoDB connection string
- Set secure `NEXTAUTH_SECRET`

## 📝 Development Notes

### Adding New Courses
Courses can be added through the API or by seeding the database. Instructors need appropriate permissions.

### Lesson Management
Lessons support Vimeo video URLs in the format: `https://player.vimeo.com/video/[VIDEO_ID]`

### User Roles
- `student`: Default role, can enroll and view courses
- `instructor`: Can create and manage courses
- `admin`: Full system access

## 🧪 Testing

```bash
# Run linting
npm run lint

# Build for production
npm run build

# Start production server
npm start
```

## 🔧 Troubleshooting

### MongoDB Connection Issues

If you see MongoDB connection errors:

1. **Check environment variables**: Ensure `MONGODB_URI` is correctly set in `.env.local`
2. **Verify MongoDB Atlas setup**: See [MONGODB_SETUP.md](MONGODB_SETUP.md) for detailed instructions
3. **IP Whitelist**: Make sure your IP address is whitelisted in MongoDB Atlas
4. **Credentials**: Verify username and password are correct in the connection string

Common error messages:
- `querySrv ETIMEOUT`: DNS/network issue, check your internet connection
- `Authentication failed`: Wrong username/password in connection string  
- `IP not whitelisted`: Add your IP to MongoDB Atlas Network Access

### Build Issues

If the build fails:
- Run `npm install` to ensure all dependencies are installed
- Check that Node.js version is 18 or higher
- Verify environment variables are properly set

### Development Server Issues

If `npm run dev` doesn't start:
- Ensure port 3000 is available
- Check for any syntax errors in your code
- Clear Next.js cache: `rm -rf .next`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the documentation
- Open an issue on GitHub
- Contact the development team

---

Built with ❤️ for dental education professionals.