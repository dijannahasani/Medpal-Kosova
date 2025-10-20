const mongoose = require("mongoose");
const User = require("../models/User");

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/medpal", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function checkUser(email) {
  try {
    console.log(`🔍 Checking for user with email: ${email}`);
    
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log("✅ No user found with this email - you can register!");
      return;
    }
    
    console.log("\n📋 User found:");
    console.log(`   Name: ${user.name}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Verified: ${user.isVerified}`);
    console.log(`   Created: ${user.createdAt}`);
    
    if (user.role === "patient" && !user.isVerified) {
      console.log("\n💡 This is an unverified patient account.");
      console.log("   You can either:");
      console.log("   1. Use 'Forgot Password' to reset the password");
      console.log("   2. Delete this account and register again");
    } else {
      console.log("\n💡 This account is already verified.");
      console.log("   You should use 'Forgot Password' to reset the password.");
    }
    
  } catch (error) {
    console.error("❌ Error checking user:", error);
  } finally {
    mongoose.connection.close();
  }
}

// Get email from command line argument
const email = process.argv[2];
if (!email) {
  console.log("Usage: node checkUser.js <email>");
  console.log("Example: node checkUser.js user@example.com");
  process.exit(1);
}

checkUser(email);
