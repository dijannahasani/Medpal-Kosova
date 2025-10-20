// Database configuration
const config = {
  // Use MongoDB Atlas connection string
  // Replace with your actual Atlas connection string
  MONGODB_URI: process.env.MONGODB_URI || "mongodb+srv://username:password@cluster.mongodb.net/medpal?retryWrites=true&w=majority",
  
  // JWT Secret
  JWT_SECRET: process.env.JWT_SECRET || "medpal_super_secret_key_2024",
  
  // Server Port
  PORT: process.env.PORT || 5000
};

module.exports = config;
