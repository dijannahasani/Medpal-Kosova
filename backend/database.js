const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const config = require('./config');
const mongoUri = config.MONGODB_URI;

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log('📊 Using existing MongoDB connection');
    return;
  }

  try {
    console.log('🔍 Attempting to connect to MongoDB...');
    
    await mongoose.connect(mongoUri);
    
    isConnected = true;
    console.log('✅ MongoDB connected successfully!');
    console.log('📊 Database:', mongoUri.split('/').pop());
    
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    console.error('💡 Please check your MongoDB Atlas connection string');
    console.error('🔗 Get your connection string from: https://cloud.mongodb.com/');
    process.exit(1);
  }
};

module.exports = connectDB;