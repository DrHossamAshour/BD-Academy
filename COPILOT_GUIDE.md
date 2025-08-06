# 🤖 GitHub Copilot Guide - BigDentist Application

## 📋 Project Overview

**BigDentist** is a comprehensive dental education platform built with Next.js 14, MongoDB, and NextAuth.js. This guide helps GitHub Copilot understand the project structure, patterns, and best practices.

## 🏗️ Architecture Overview

```
BigDentist/
├── app/                    # Next.js 14 App Router
│   ├── api/               # API Routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # User dashboards
│   ├── courses/           # Course pages
│   └── globals.css        # Global styles
├── components/            # Reusable UI components
├── lib/                   # Utility libraries
├── types/                 # TypeScript type definitions
├── utils/                 # Helper functions
├── public/                # Static assets
└── scripts/               # Build and analysis scripts
```

## 🔧 Technology Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library

### Backend
- **Next.js API Routes** - Server-side API endpoints
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **NextAuth.js** - Authentication framework
- **bcryptjs** - Password hashing

### Development
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

## 🎯 Key Features

### Authentication System
- **Multi-role authentication** (Admin, Instructor, Student)
- **JWT-based sessions**
- **Credential-based login**
- **Protected routes**

### Course Management
- **Course creation and editing**
- **Video content management**
- **Resource uploads**
- **Progress tracking**

### User Dashboards
- **Admin Dashboard** - User management, analytics
- **Instructor Dashboard** - Course management, earnings
- **Student Dashboard** - Learning progress, certificates

### Payment Integration
- **Stripe payment processing**
- **Webhook handling**
- **Order management**

## 📁 File Structure Deep Dive

### `/app` Directory (Next.js 14 App Router)

#### API Routes (`/app/api/`)
```typescript
// Authentication
app/api/auth/[...nextauth]/route.ts

// Course Management
app/api/courses/public/route.ts
app/api/courses/public/[id]/route.ts

// Admin Functions
app/api/admin/users/route.ts
app/api/admin/orders/route.ts

// File Upload
app/api/upload/image/route.ts
```

#### Pages (`/app/`)
```typescript
// Public Pages
app/page.tsx                    # Homepage
app/courses/page.tsx            # Course listing
app/courses/[id]/page.tsx       # Course details

// Authentication
app/auth/login/page.tsx
app/auth/signup/page.tsx

// Dashboards
app/dashboard/admin/page.tsx
app/dashboard/instructor/page.tsx
app/dashboard/student/page.tsx
```

### `/components` Directory

#### UI Components
```typescript
// Layout Components
components/layout/Header.tsx
components/layout/Footer.tsx
components/layout/Sidebar.tsx

// Form Components
components/ui/Button.tsx
components/ui/Input.tsx
components/ui/Form.tsx

// Course Components
components/courses/CourseCard.tsx
components/courses/CourseList.tsx
components/courses/VideoPlayer.tsx
```

### `/lib` Directory

#### Database Connection
```typescript
lib/db.ts                      # MongoDB connection
lib/models/                    # Mongoose models
lib/models/User.ts
lib/models/Course.ts
lib/models/Order.ts
```

#### Authentication
```typescript
lib/auth.ts                    # NextAuth configuration
lib/auth-utils.ts              # Auth helper functions
```

### `/types` Directory

#### TypeScript Definitions
```typescript
types/index.ts                 # Global type definitions
types/user.ts                  # User-related types
types/course.ts                # Course-related types
types/api.ts                   # API response types
```

## 🔐 Authentication Patterns

### User Roles
```typescript
enum UserRole {
  ADMIN = 'admin',
  INSTRUCTOR = 'instructor',
  STUDENT = 'student'
}
```

### Protected Routes
```typescript
// Middleware for route protection
export function withAuth(Component: React.ComponentType, allowedRoles: UserRole[]) {
  return function ProtectedComponent(props: any) {
    const { data: session, status } = useSession();
    
    if (status === 'loading') return <LoadingSpinner />;
    if (!session) return <SignIn />;
    if (!allowedRoles.includes(session.user.role)) return <AccessDenied />;
    
    return <Component {...props} />;
  };
}
```

### API Route Protection
```typescript
// API route with authentication
export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Route logic here
}
```

## 🗄️ Database Patterns

### Mongoose Models
```typescript
// User Model Example
const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['admin', 'instructor', 'student'], default: 'student' },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});
```

### Database Operations
```typescript
// CRUD Operations
export async function createUser(userData: CreateUserData) {
  const hashedPassword = await bcrypt.hash(userData.password, 12);
  return await User.create({ ...userData, password: hashedPassword });
}

export async function findUserByEmail(email: string) {
  return await User.findOne({ email });
}

export async function updateUser(id: string, updates: Partial<User>) {
  return await User.findByIdAndUpdate(id, updates, { new: true });
}
```

## 🎨 UI/UX Patterns

### Component Structure
```typescript
// Standard component pattern
interface ComponentProps {
  // Props definition
}

export default function Component({ prop1, prop2 }: ComponentProps) {
  // State management
  const [state, setState] = useState();
  
  // Event handlers
  const handleClick = () => {
    // Handler logic
  };
  
  // Render
  return (
    <div className="component-container">
      {/* Component content */}
    </div>
  );
}
```

### Styling Patterns
```typescript
// Tailwind CSS classes
const buttonVariants = {
  primary: "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded",
  secondary: "bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded",
  danger: "bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
};
```

## 🔄 State Management

### Client-Side State
```typescript
// React hooks for local state
const [courses, setCourses] = useState<Course[]>([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
```

### Server-Side State
```typescript
// Server components for data fetching
async function getCourses() {
  const courses = await Course.find({ published: true });
  return courses;
}
```

## 🛡️ Security Patterns

### Input Validation
```typescript
// Zod schema validation
const courseSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(10).max(1000),
  price: z.number().min(0).max(1000)
});
```

### Password Security
```typescript
// Password hashing
const hashedPassword = await bcrypt.hash(password, 12);
const isValid = await bcrypt.compare(password, hashedPassword);
```

### API Security
```typescript
// Rate limiting and validation
export async function POST(request: Request) {
  // Validate input
  const body = await request.json();
  const validatedData = courseSchema.parse(body);
  
  // Check permissions
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'instructor') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
  
  // Process request
}
```

## 🚀 Performance Patterns

### Image Optimization
```typescript
// Next.js Image component
import Image from 'next/image';

<Image
  src="/course-image.jpg"
  alt="Course thumbnail"
  width={300}
  height={200}
  priority={true}
/>
```

### Code Splitting
```typescript
// Dynamic imports for lazy loading
const DynamicComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <LoadingSpinner />,
  ssr: false
});
```

### Database Optimization
```typescript
// Indexed queries
const courses = await Course.find({ published: true })
  .select('title description price image')
  .limit(10)
  .sort({ createdAt: -1 });
```

## 🧪 Testing Patterns

### Component Testing
```typescript
// Jest + React Testing Library
describe('CourseCard', () => {
  it('renders course information correctly', () => {
    render(<CourseCard course={mockCourse} />);
    expect(screen.getByText(mockCourse.title)).toBeInTheDocument();
  });
});
```

### API Testing
```typescript
// API route testing
describe('/api/courses', () => {
  it('returns published courses', async () => {
    const response = await fetch('/api/courses/public');
    const data = await response.json();
    expect(data.courses).toBeDefined();
  });
});
```

## 📝 Code Style Guidelines

### Naming Conventions
- **Files**: `kebab-case` (e.g., `course-card.tsx`)
- **Components**: `PascalCase` (e.g., `CourseCard`)
- **Functions**: `camelCase` (e.g., `getCourses`)
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `API_BASE_URL`)

### Import Organization
```typescript
// 1. React imports
import React, { useState, useEffect } from 'react';

// 2. Next.js imports
import { useRouter } from 'next/router';
import Image from 'next/image';

// 3. Third-party libraries
import { useSession } from 'next-auth/react';

// 4. Local imports
import { Button } from '@/components/ui/Button';
import { Course } from '@/types/course';
```

### Error Handling
```typescript
// Consistent error handling pattern
try {
  const result = await riskyOperation();
  return result;
} catch (error) {
  console.error('Operation failed:', error);
  throw new Error('User-friendly error message');
}
```

## 🔧 Development Workflow

### Environment Setup
```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run development server
npm run dev

# Run analysis script
node scripts/copilot-analysis.js
```

### Git Workflow
```bash
# Feature development
git checkout -b feature/new-feature
# Make changes
git add .
git commit -m "feat: add new feature"
git push origin feature/new-feature
```

## 🎯 Copilot Best Practices

### When Writing Code
1. **Follow established patterns** in the codebase
2. **Use TypeScript** for all new code
3. **Include proper error handling**
4. **Add JSDoc comments** for complex functions
5. **Consider accessibility** in UI components

### When Reviewing Code
1. **Check for security vulnerabilities**
2. **Ensure proper validation**
3. **Verify error handling**
4. **Test edge cases**
5. **Consider performance implications**

### When Suggesting Improvements
1. **Reference existing patterns**
2. **Explain the reasoning**
3. **Consider backward compatibility**
4. **Suggest tests if applicable**
5. **Check for breaking changes**

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB Atlas Guide](https://docs.atlas.mongodb.com)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

---

**Remember**: This application follows modern React/Next.js patterns with a focus on type safety, security, and performance. Always prioritize user experience and code maintainability. 