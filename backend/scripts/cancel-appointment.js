#!/usr/bin/env node
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const Appointment = require('../models/Appointment');

async function main() {
  const id = process.argv[2];
  if (!id) {
    console.error('Usage: node scripts/cancel-appointment.js <appointmentId>');
    process.exit(1);
  }

  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/medpal';
  await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    const appt = await Appointment.findById(id);
    if (!appt) {
      console.error('Appointment not found');
      process.exit(1);
    }
    appt.status = 'canceled';
    await appt.save();
    console.log('Appointment canceled:', id);
  } catch (err) {
    console.error('Error:', err.message || err);
  } finally {
    await mongoose.connection.close();
  }
}

main();
