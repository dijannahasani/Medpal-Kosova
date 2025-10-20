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

async function deletePastPatients() {
  try {
    console.log("🔍 Checking for patients created before today...");
    
    // Get today's date at 00:00:00
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Find all patient users created before today
    const patientsToDelete = await User.find({
      role: "patient",
      createdAt: { $lt: today }
    });
    
    console.log(`📊 Found ${patientsToDelete.length} patients created before today`);
    
    if (patientsToDelete.length === 0) {
      console.log("✅ No patients to delete");
      return;
    }
    
    // Show patient details before deletion
    console.log("\n📋 Patients to be deleted:");
    patientsToDelete.forEach((patient, index) => {
      console.log(`${index + 1}. ${patient.name} (${patient.email}) - Created: ${patient.createdAt}`);
    });
    
    // Ask for confirmation
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    const answer = await new Promise((resolve) => {
      rl.question('\n⚠️  Are you sure you want to delete these patients? (yes/no): ', resolve);
    });
    
    rl.close();
    
    if (answer.toLowerCase() !== 'yes') {
      console.log("❌ Operation cancelled");
      return;
    }
    
    console.log("\n🗑️  Starting deletion process...");
    
    // Delete all related data first
    const patientIds = patientsToDelete.map(patient => patient._id);
    
    console.log("📅 Deleting related appointments...");
    const deletedAppointments = await Appointment.deleteMany({ patientId: { $in: patientIds } });
    console.log(`   Deleted ${deletedAppointments.deletedCount} appointments`);
    
    console.log("📋 Deleting visit reports...");
    const deletedReports = await VisitReport.deleteMany({ patientId: { $in: patientIds } });
    console.log(`   Deleted ${deletedReports.deletedCount} visit reports`);
    
    console.log("📄 Deleting documents...");
    const deletedDocuments = await Document.deleteMany({ patientId: { $in: patientIds } });
    console.log(`   Deleted ${deletedDocuments.deletedCount} documents`);
    
    console.log("👥 Deleting patient users...");
    const result = await User.deleteMany({
      role: "patient",
      createdAt: { $lt: today }
    });
    
    console.log(`\n✅ Successfully deleted ${result.deletedCount} patients and all their related data`);
    
  } catch (error) {
    console.error("❌ Error during deletion:", error);
  } finally {
    mongoose.connection.close();
    console.log("🔌 Database connection closed");
  }
}

// Run the script
deletePastPatients();
