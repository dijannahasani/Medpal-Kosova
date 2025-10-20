#!/usr/bin/env node
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const User = require('../models/User');

async function main() {
  const [doctorIdent, clinicIdent] = process.argv.slice(2);
  if (!doctorIdent || !clinicIdent) {
    console.log('Usage: node scripts/link-doctor-to-clinic.js <doctorId|email|doctorCode> <clinicId|email>');
    process.exit(1);
  }
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/medpal';
  await mongoose.connect(mongoUri);
  try {
    let doctor = null;
    if (/^[0-9a-fA-F]{24}$/.test(doctorIdent)) doctor = await User.findById(doctorIdent);
    if (!doctor) doctor = await User.findOne({ email: doctorIdent });
    if (!doctor) doctor = await User.findOne({ doctorCode: doctorIdent });
    if (!doctor || doctor.role !== 'doctor') throw new Error('Doctor not found or not a doctor');

    let clinic = null;
    if (/^[0-9a-fA-F]{24}$/.test(clinicIdent)) clinic = await User.findById(clinicIdent);
    if (!clinic) clinic = await User.findOne({ email: clinicIdent });
    if (!clinic || clinic.role !== 'clinic') throw new Error('Clinic not found or not a clinic');

    doctor.clinicId = clinic._id;
    await doctor.save();

    console.log('✅ Linked doctor to clinic');
    console.log('   Doctor:', doctor.name, doctor._id.toString(), doctor.doctorCode || '(no code)');
    console.log('   Clinic:', clinic.name, clinic._id.toString());
  } catch (err) {
    console.error('❌ Error:', err.message || err);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
}

main();
