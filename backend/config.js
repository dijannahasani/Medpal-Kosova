// Database configuration
const config = {
  // Use MongoDB Atlas connection string
  // Support both MONGODB_URI and MONGO_URI for flexibility
  MONGODB_URI: process.env.MONGODB_URI || process.env.MONGO_URI || "mongodb+srv://username:password@cluster.mongodb.net/medpal?retryWrites=true&w=majority",
  
  // JWT Secret
  JWT_SECRET: process.env.JWT_SECRET || "medpal_super_secret_key_2024",
  
  // Server Port
  PORT: process.env.PORT || 5000
};

module.exports = config;
