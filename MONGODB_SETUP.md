# MongoDB Atlas Setup Guide

This guide will help you set up MongoDB Atlas and configure IP whitelisting for the BigDentist application.

## 1. MongoDB Atlas Setup

### Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Create a new cluster (Free Tier M0 is sufficient for development)

### Create Database User
1. In Atlas Dashboard, go to "Database Access"
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Create a username and secure password
5. Grant "Read and write to any database" privileges
6. Click "Add User"

### Configure Network Access (IP Whitelist)
1. In Atlas Dashboard, go to "Network Access"
2. Click "Add IP Address"
3. For development:
   - Choose "Allow Access from Anywhere" (0.0.0.0/0)
   - **WARNING**: This is NOT secure for production!
4. For production:
   - Add your server's specific IP address
   - Or use VPC/Private Link for better security

### Get Connection String
1. Go to "Clusters" in Atlas Dashboard
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Select "Node.js" and version "4.1 or later"
5. Copy the connection string

## 2. Environment Configuration

### Update .env.local
Replace the placeholders in your `.env.local` file:

```env
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/bigdentist?retryWrites=true&w=majority&appName=BigDentist
```

Replace:
- `your-username` with your database username
- `your-password` with your database password  
- `your-cluster` with your cluster name (e.g., cluster0.abc123)

### NextAuth Secret
Generate a secure NextAuth secret:
```bash
openssl rand -base64 32
```

Add this to your `.env.local`:
```env
NEXTAUTH_SECRET=your-generated-secret-here
```

## 3. Production Security Best Practices

### IP Whitelisting
- Never use 0.0.0.0/0 in production
- Add only your server's IP addresses
- Use VPC peering for AWS/Google Cloud deployments
- Consider MongoDB Atlas Private Link

### Connection Security
- Use strong database passwords
- Rotate credentials regularly
- Enable MongoDB Atlas encryption at rest
- Use SSL/TLS connections (already included in connection string)

### Environment Variables
- Never commit .env.local to version control
- Use secure environment variable management in production
- Consider using services like AWS Secrets Manager or HashiCorp Vault

## 4. Troubleshooting

### Common Connection Issues

#### "Authentication failed"
- Check username and password in connection string
- Ensure user has correct database privileges

#### "IP not whitelisted"
- Add your IP to Network Access in Atlas
- Check if your IP changed (dynamic IPs)
- Verify firewall isn't blocking connections

#### "Connection timeout"
- Check if cluster is paused (free tier auto-pauses)
- Verify network connectivity
- Check if using correct connection string

#### "Database not found"
- MongoDB will create the database automatically on first write
- Ensure correct database name in connection string

### Testing Connection
Run the application and check the console logs:
```bash
npm run dev
```

Look for:
- ✅ "Connected to MongoDB Atlas" (success)
- ❌ Connection error messages with troubleshooting tips

## 5. Monitoring

### Atlas Monitoring
- Use Atlas Real Time Performance Panel
- Monitor connection metrics
- Set up alerts for connection issues

### Application Monitoring
- Check application logs for connection errors
- Monitor response times for database operations
- Set up health checks for database connectivity

---

For more information, see the [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/).