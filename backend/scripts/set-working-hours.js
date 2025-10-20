#!/usr/bin/env node
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const User = require('../models/User');

const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/medpal';

function defaultHours() {
  return {
    monday: { start: '09:00', end: '17:00' },
    tuesday: { start: '09:00', end: '17:00' },
    wednesday: { start: '09:00', end: '17:00' },
    thursday: { start: '09:00', end: '17:00' },
    friday: { start: '09:00', end: '17:00' },
    saturday: { start: '', end: '' },
    sunday: { start: '', end: '' },
  };
}

async function main() {
  const identifier = process.argv[2];
  const hoursJson = process.argv[3];
  if (!identifier) {
    console.error('Usage: node scripts/set-working-hours.js <doctorId_or_email> [hoursJson]');
    process.exit(1);
  }

  let hours;
  if (hoursJson) {
    try { hours = JSON.parse(hoursJson); } catch (e) { console.error('Invalid hoursJson'); process.exit(1); }
  } else {
    hours = defaultHours();
  }

  await mongoose.connect(mongoUri);
  try {
    let doctor;
    if (/^[0-9a-fA-F]{24}$/.test(identifier)) {
      doctor = await User.findById(identifier);
    }
    if (!doctor) {
      doctor = await User.findOne({ email: identifier });
    }
    if (!doctor) {
      doctor = await User.findOne({ doctorCode: identifier });
    }
    if (!doctor || doctor.role !== 'doctor') {
      console.error('Doctor not found or not a doctor role');
      process.exit(1);
    }

    doctor.workingHours = hours;
    await doctor.save();
  console.log('✅ Working hours set for', doctor.name);
  console.log('   _id:', doctor._id.toString());
  console.log('   doctorCode:', doctor.doctorCode || '(none)');
  console.log(JSON.stringify(doctor.workingHours, null, 2));
  } catch (err) {
    console.error('Error:', err.message || err);
  } finally {
    await mongoose.connection.close();
  }
}

main();
