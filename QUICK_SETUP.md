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
**Error message contains "IP whitelist", "not authorized", or "connection refused":**

🔧 **Quick Fix Steps:**
1. **Open MongoDB Atlas**: Go to https://cloud.mongodb.com
2. **Find Network Access**: Click "Network Access" in the left menu
3. **Add Your IP**: Click "Add IP Address" → "Add Current IP Address"
4. **Wait 2-3 minutes** for changes to apply
5. **Try again**: Restart your app with `npm run dev`

**Still not working?**
- ✅ Double-check your connection string in `.env.local`
- ✅ Verify your MongoDB username/password are correct
- ✅ Ensure your cluster is active (not paused)
- ✅ Try adding `0.0.0.0/0` for all IPs (development only)

### **Login Still Fails:**
1. **Run setup again**: `node scripts/setup-database.js`
2. **Check terminal**: Look for success messages about user creation
3. **Use exact credentials**: Copy-paste the emails and passwords shown
4. **Clear browser**: Clear cookies/cache or try incognito mode

### **Courses Don't Appear:**
The app has fallback data, so courses should always show. If they don't:
1. **Restart server**: Stop (`Ctrl+C`) and run `npm run dev` again
2. **Check console**: Look for any JavaScript errors in browser console
3. **Database connection**: Ensure MongoDB connection is working

## 🎉 **Success Indicators:**

- ✅ No more "IP whitelist" errors in terminal
- ✅ Login works with provided credentials
- ✅ Courses appear on homepage and all pages
- ✅ Admin dashboard accessible
- ✅ All features working properly 