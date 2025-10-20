const mongoose = require("mongoose");
const User = require("../models/User");
const Appointment = require("../models/Appointment");
const VisitReport = require("../models/VisitReport");
const Document = require("../models/Document");

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/medpal", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function deleteUser(email) {
  try {
    console.log(`🔍 Looking for user with email: ${email}`);
    
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log("❌ No user found with this email");
      return;
    }
    
    console.log("\n📋 User found:");
    console.log(`   Name: ${user.name}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Verified: ${user.isVerified}`);
    console.log(`   Created: ${user.createdAt}`);
    
    // Ask for confirmation
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    const answer = await new Promise((resolve) => {
      rl.question('\n⚠️  Are you sure you want to delete this user? (yes/no): ', resolve);
    });
    
    rl.close();
    
    if (answer.toLowerCase() !== 'yes') {
      console.log("❌ Operation cancelled");
      return;
    }
    
    console.log("\n🗑️  Starting deletion process...");
    
    // Delete all related data first
    console.log("📅 Deleting related appointments...");
    const deletedAppointments = await Appointment.deleteMany({ 
      $or: [
        { patientId: user._id },
        { doctorId: user._id }
      ]
    });
    console.log(`   Deleted ${deletedAppointments.deletedCount} appointments`);
    
    console.log("📋 Deleting visit reports...");
    const deletedReports = await VisitReport.deleteMany({ 
      $or: [
        { patientId: user._id },
        { doctorId: user._id }
      ]
    });
    console.log(`   Deleted ${deletedReports.deletedCount} visit reports`);
    
    console.log("📄 Deleting documents...");
    const deletedDocuments = await Document.deleteMany({ patientId: user._id });
    console.log(`   Deleted ${deletedDocuments.deletedCount} documents`);
    
    console.log("👤 Deleting user account...");
    await User.findByIdAndDelete(user._id);
    
    console.log(`\n✅ Successfully deleted user: ${user.name} (${user.email})`);
    
  } catch (error) {
    console.error("❌ Error deleting user:", error);
  } finally {
    mongoose.connection.close();
  }
}

// Get email from command line argument
const email = process.argv[2];
if (!email) {
  console.log("Usage: node deleteUser.js <email>");
  console.log("Example: node deleteUser.js user@example.com");
  process.exit(1);
}

deleteUser(email);
