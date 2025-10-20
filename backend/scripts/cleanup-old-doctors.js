const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');

async function cleanupOldDoctors() {
  try {
    // Lidhu me MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Gjej të gjithë mjekët përveç "Mjeku 1"
    const doctorsToDelete = await User.find({
      role: 'doctor',
      name: { $ne: 'Mjeku 1' } // $ne = not equal (jo baraz)
    });

    console.log(`🔍 Found ${doctorsToDelete.length} doctors to delete:`);
    doctorsToDelete.forEach(doc => {
      console.log(`- ${doc.name} (${doc.email || doc.doctorCode})`);
    });

    if (doctorsToDelete.length === 0) {
      console.log('✅ No doctors to delete. Only "Mjeku 1" exists.');
      return;
    }

    // Konfirmim
    console.log('\n⚠️  This will DELETE all doctors except "Mjeku 1"');
    console.log('Press Ctrl+C to cancel, or wait 5 seconds to continue...');
    
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Fshij mjekët
    const result = await User.deleteMany({
      role: 'doctor',
      name: { $ne: 'Mjeku 1' }
    });

    console.log(`✅ Deleted ${result.deletedCount} doctors successfully!`);

    // Shfaq mjekët që kanë mbetur
    const remainingDoctors = await User.find({ role: 'doctor' });
    console.log(`\n📋 Remaining doctors (${remainingDoctors.length}):`);
    remainingDoctors.forEach(doc => {
      console.log(`- ${doc.name} (${doc.email || doc.doctorCode})`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

cleanupOldDoctors();