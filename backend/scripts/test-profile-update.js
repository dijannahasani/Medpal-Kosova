#!/usr/bin/env node
const path = require('path');
const mongoose = require('mongoose');

// Load backend .env reliably
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

const User = require('../models/User');

async function main() {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!mongoUri) {
    console.error('Missing MONGODB_URI / MONGO_URI in backend/.env');
    process.exit(1);
  }

  await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to MongoDB');

  try {
    // Gjej një mjek për test
    const doctor = await User.findOne({ role: 'doctor' });
    if (!doctor) {
      console.log('No doctor found for testing');
      return;
    }

    console.log('📋 Current doctor data:');
    console.log('Name:', doctor.name);
    console.log('Email:', doctor.email);
    console.log('Phone:', doctor.phone);
    console.log('Specialization:', doctor.specialization);
    console.log('Bio:', doctor.bio);

    // Test update
    doctor.phone = '+355 69 123 4567';
    doctor.specialization = 'Kardiolog';
    doctor.bio = 'Specialist i zemrës me 10 vjet përvojë';

    await doctor.save();
    console.log('\n✅ Updated successfully');

    // Verify update
    const updatedDoctor = await User.findById(doctor._id);
    console.log('\n📋 After update:');
    console.log('Name:', updatedDoctor.name);
    console.log('Email:', updatedDoctor.email);
    console.log('Phone:', updatedDoctor.phone);
    console.log('Specialization:', updatedDoctor.specialization);
    console.log('Bio:', updatedDoctor.bio);

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
  }
}

main();