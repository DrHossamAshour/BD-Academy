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

⚠️ **Common Issue**: If you see errors like "IP whitelist", "not authorized", or "connection refused", you need to configure network access.

**Step-by-step fix:**

1. **Open MongoDB Atlas Dashboard**
   - Go to: https://cloud.mongodb.com
   - Sign in to your MongoDB account

2. **Navigate to Network Access**
   - Select your cluster from the dashboard
   - Click **"Network Access"** in the left sidebar menu

3. **Add Your IP Address**
   - Click the **"Add IP Address"** button
   - Choose one of these options:
     - **"Add Current IP Address"** (recommended for production)
     - **"Allow Access from Anywhere"** (0.0.0.0/0 - for development only)
   - Click **"Confirm"**

4. **Wait for Changes to Apply**
   - MongoDB Atlas takes 2-3 minutes to apply IP whitelist changes
   - You'll see a status indicator showing when it's ready

5. **Verify Your Connection String**
   - Make sure your `.env.local` has the correct MONGODB_URI
   - The format should be: `mongodb+srv://username:password@cluster.mongodb.net/database`

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

### **MongoDB Connection Issues**

**❌ Error: "IP whitelist", "not authorized", or "connection refused"**
- **Cause**: Your IP address is not whitelisted in MongoDB Atlas
- **Solution**: Follow Step 2 above to add your IP to the whitelist
- **Wait**: Allow 2-3 minutes for changes to take effect
- **Test**: Try connecting again

**❌ Error: "Authentication failed"**
- **Cause**: Incorrect username/password in connection string
- **Solution**: 
  1. Go to MongoDB Atlas → Database Access
  2. Verify your database user credentials
  3. Update your `.env.local` with correct credentials

**❌ Error: "ENOTFOUND" or "Network timeout"**
- **Cause**: DNS resolution issues or network connectivity
- **Solutions**:
  1. Check your internet connection
  2. Verify the cluster URL in your connection string
  3. Ensure your cluster is active (not paused)

### **Application Issues**

**❌ Admin login fails:**
1. **Run setup**: Execute `node scripts/setup-admin.js`
2. **Check output**: Look for success messages in terminal
3. **Use exact credentials**: Copy-paste the provided email/password
4. **Clear cache**: Clear browser cookies or try incognito mode

**❌ Courses don't appear:**
- The app has fallback data, so courses should always show
- If not appearing:
  1. Restart development server (`Ctrl+C` then `npm run dev`)
  2. Check browser console for JavaScript errors
  3. Verify MongoDB connection is working

### **Success Indicators**

✅ **MongoDB Connected Successfully:**
- No error messages in terminal when starting the app
- Setup scripts complete without errors
- Login works with provided credentials

✅ **Application Working Properly:**
- Homepage loads with course listings
- Login redirects to admin dashboard
- All pages load without errors
- No console errors in browser 