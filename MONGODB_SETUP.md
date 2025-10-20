# 🚀 MongoDB Setup Guide

## Quick Solution: MongoDB Atlas (Free Cloud Database)

### Step 1: Create MongoDB Atlas Account
1. Go to: https://www.mongodb.com/atlas
2. Click "Try Free" and create an account
3. Create a new cluster (choose the free M0 tier)

### Step 2: Get Connection String
1. In your Atlas dashboard, click "Connect"
2. Choose "Connect your application"
3. Copy the connection string (it will look like: `mongodb+srv://username:password@cluster.mongodb.net/medpal`)

### Step 3: Update Configuration
1. Open `backend/config.js`
2. Replace the MONGODB_URI with your Atlas connection string:
   ```javascript
   MONGODB_URI: "mongodb+srv://your-username:your-password@your-cluster.mongodb.net/medpal?retryWrites=true&w=majority"
   ```

### Step 4: Restart Backend
```bash
cd backend
npm start
```

### Step 5: Test the Application
- The clinic profile update should now work
- All database operations will be stored in your cloud MongoDB

## Alternative: Local MongoDB Installation

If you prefer to install MongoDB locally:

### Windows:
1. Download MongoDB Community Server from: https://www.mongodb.com/try/download/community
2. Install and start the MongoDB service
3. Update `backend/config.js` to use: `mongodb://localhost:27017/medpal`

### Using Docker:
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

## Verification
Once MongoDB is connected, you should see:
```
✅ MongoDB connected successfully!
📊 Database: medpal
```

The clinic profile update will work without errors! 🎉
