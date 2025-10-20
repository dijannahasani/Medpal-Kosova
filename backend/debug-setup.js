const mongoose = require("mongoose");
const User = require("./models/User");

console.log("🔍 MedPal Debug Setup");
console.log("====================");

// Check environment variables
console.log("\n📋 Environment Variables:");
console.log(`   MONGODB_URI: ${process.env.MONGODB_URI ? "✅ Set" : "❌ Missing"}`);
console.log(`   JWT_SECRET: ${process.env.JWT_SECRET ? "✅ Set" : "❌ Missing"}`);
console.log(`   EMAIL_USER: ${process.env.EMAIL_USER ? "✅ Set" : "❌ Missing"}`);
console.log(`   EMAIL_PASS: ${process.env.EMAIL_PASS ? "✅ Set" : "❌ Missing"}`);
console.log(`   CLINIC_CODES: ${process.env.CLINIC_CODES ? "✅ Set" : "❌ Missing"}`);

// Test database connection
async function testDatabase() {
  try {
    console.log("\n🗄️  Testing Database Connection...");
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/medpal", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Database connected successfully");
    
    // Test a simple query
    const userCount = await User.countDocuments();
    console.log(`📊 Total users in database: ${userCount}`);
    
    // List all users
    const users = await User.find({}).select("name email role isVerified createdAt");
    console.log("\n👥 All users in database:");
    users.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.name} (${user.email}) - Role: ${user.role} - Verified: ${user.isVerified} - Created: ${user.createdAt}`);
    });
    
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
  } finally {
    mongoose.connection.close();
  }
}

// Test email configuration
async function testEmail() {
  try {
    console.log("\n📧 Testing Email Configuration...");
    const { sendVerificationEmail } = require("./utils/sendEmail");
    
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log("❌ Email configuration missing");
      return;
    }
    
    console.log("✅ Email configuration found");
    console.log(`   EMAIL_USER: ${process.env.EMAIL_USER}`);
    
    // Test sending email (commented out to avoid spam)
    // await sendVerificationEmail("test@example.com", "TEST123", null, null, null, true);
    // console.log("✅ Test email sent successfully");
    
  } catch (error) {
    console.error("❌ Email test failed:", error.message);
  }
}

// Run all tests
async function runTests() {
  await testDatabase();
  await testEmail();
  
  console.log("\n🎯 Next Steps:");
  console.log("1. If database connection failed, check your MONGODB_URI");
  console.log("2. If email test failed, check your EMAIL_USER and EMAIL_PASS");
  console.log("3. If users exist, use the correct role for forgot password");
  console.log("4. If no users exist, register first");
}

runTests();
