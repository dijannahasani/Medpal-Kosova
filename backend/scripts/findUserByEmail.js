const mongoose = require("mongoose");
const User = require("../models/User");

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/medpal", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function findUserByEmail(email) {
  try {
    console.log(`🔍 Searching for user with email: ${email}`);
    
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log("❌ No user found with this email");
      console.log("💡 This means you need to register first, not use forgot password");
      return;
    }
    
    console.log("\n📋 User found:");
    console.log(`   Name: ${user.name}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Verified: ${user.isVerified}`);
    console.log(`   Created: ${user.createdAt}`);
    
    console.log("\n💡 For forgot password to work:");
    console.log(`   You must select role: "${user.role}"`);
    console.log(`   Not: "patient", "clinic", "doctor", or "admin"`);
    
    if (user.role === "patient" && !user.isVerified) {
      console.log("\n⚠️  This is an unverified patient account.");
      console.log("   You should use email verification first, not forgot password.");
    }
    
  } catch (error) {
    console.error("❌ Error finding user:", error);
  } finally {
    mongoose.connection.close();
  }
}

// Get email from command line argument
const email = process.argv[2];
if (!email) {
  console.log("Usage: node findUserByEmail.js <email>");
  console.log("Example: node findUserByEmail.js user@example.com");
  process.exit(1);
}

findUserByEmail(email);
