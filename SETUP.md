# BigDentist Setup Guide

## 🔧 **Fix MongoDB Connection Issues**

### **Step 1: Create Environment File**
Create a `.env.local` file in the root directory with your MongoDB credentials:

```env
# MongoDB Connection String
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/bigdentist?retryWrites=true&w=majority

# NextAuth Configuration
NEXTAUTH_SECRET=your-nextauth-secret-key-here-make-it-long-and-random
NEXTAUTH_URL=http://localhost:3002
```

### **Step 2: Fix MongoDB Atlas IP Whitelist**
1. Go to [MongoDB Atlas Dashboard](https://cloud.mongodb.com)
2. Select your cluster
3. Click **"Network Access"** in the left sidebar
4. Click **"Add IP Address"**
5. Add your current IP address OR add `0.0.0.0/0` to allow all IPs (for development)
6. Click **"Confirm"**

### **Step 3: Create Admin User**
Run the admin setup script:

```bash
node scripts/setup-admin.js
```

**Default Admin Credentials:**
- Email: `admin@bigdentist.com`
- Password: `admin123`

## 🚀 **Start the Application**

```bash
npm run dev
```

## ✅ **What's Fixed**

1. **Slider/Carousel**: Now shows fallback courses when database is unavailable
2. **Admin Login**: Admin user will be created automatically
3. **All Pages**: Have fallback data to prevent loading issues
4. **Brand Colors**: All pages now use consistent golden/brown branding

## 🔍 **Troubleshooting**

### **If MongoDB still doesn't connect:**
1. Check your MongoDB Atlas connection string
2. Ensure your IP is whitelisted
3. Verify your username/password are correct
4. Check if your cluster is active

### **If admin login fails:**
1. Run the setup script: `node scripts/setup-admin.js`
2. Use the exact credentials: `admin@bigdentist.com` / `admin123`
3. Check the terminal for any error messages

### **If courses don't appear:**
The app now has fallback data, so courses will always show even without database connection. 