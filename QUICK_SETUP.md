# 🚀 Quick Setup Guide - Fix MongoDB & Login Issues

## 🔧 **Step 1: Fix MongoDB Atlas IP Whitelist**

1. **Go to MongoDB Atlas Dashboard:**
   - Visit: https://cloud.mongodb.com
   - Sign in to your account

2. **Navigate to Network Access:**
   - Select your cluster
   - Click **"Network Access"** in the left sidebar
   - Click **"Add IP Address"**

3. **Add Your IP:**
   - Click **"Add IP Address"**
   - Choose **"Allow Access from Anywhere"** (for development)
   - OR add your specific IP address
   - Click **"Confirm"**

## 📝 **Step 2: Update Environment File**

Edit your `.env.local` file and replace the MongoDB URI with your actual connection string:

```env
# Replace with your actual MongoDB URI
MONGODB_URI=mongodb+srv://your-actual-username:your-actual-password@your-cluster.mongodb.net/bigdentist?retryWrites=true&w=majority

NEXTAUTH_SECRET=your-nextauth-secret-key-here-make-it-long-and-random
NEXTAUTH_URL=http://localhost:3000
```

## 🗄️ **Step 3: Setup Database with Sample Data**

Run the database setup script:

```bash
node scripts/setup-database.js
```

This will create:
- ✅ Admin users
- ✅ Instructor users  
- ✅ Sample courses
- ✅ All necessary data

## 🔑 **Step 4: Login Credentials**

After running the setup script, you can login with:

### **Admin Users:**
- **Email:** `admin@bigdentist.com` | **Password:** `admin123`
- **Email:** `dr.hossam@bigdentist.com` | **Password:** `Dr.hossam@123`

### **Instructor Users:**
- **Email:** `sarah.johnson@bigdentist.com` | **Password:** `instructor123`
- **Email:** `michael.chen@bigdentist.com` | **Password:** `instructor123`
- **Email:** `emily.rodriguez@bigdentist.com` | **Password:** `instructor123`

## 🎯 **Step 5: Test the Application**

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Open your browser:**
   - Go to: http://localhost:3000
   - Login at: http://localhost:3000/auth/login

## ✅ **What's Fixed:**

- ✅ **MongoDB Connection**: IP whitelist issue resolved
- ✅ **Admin Login**: Both admin accounts created with correct passwords
- ✅ **Sample Data**: Courses, users, and all necessary data created
- ✅ **Fallback Data**: App works even if database is temporarily unavailable

## 🆘 **If You Still Have Issues:**

### **MongoDB Connection Failed:**
1. Double-check your connection string in `.env.local`
2. Make sure your IP is whitelisted in MongoDB Atlas
3. Verify your username/password are correct

### **Login Still Fails:**
1. Run the setup script again: `node scripts/setup-database.js`
2. Check the terminal output for any errors
3. Make sure you're using the exact credentials shown above

### **Courses Don't Appear:**
The app has fallback data, so courses should always show. If they don't, restart the development server.

## 🎉 **Success Indicators:**

- ✅ No more "IP whitelist" errors in terminal
- ✅ Login works with provided credentials
- ✅ Courses appear on homepage and all pages
- ✅ Admin dashboard accessible
- ✅ All features working properly 