#!/usr/bin/env node
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const Appointment = require('../models/Appointment');
const User = require('../models/User');

async function main() {
  const argv = yargs(hideBin(process.argv))
    .option('doctor', { type: 'string', demandOption: true, desc: 'Doctor ID or doctorCode' })
    .option('date', { type: 'string', demandOption: true, desc: 'Date YYYY-MM-DD' })
    .help()
    .argv;

  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/medpal';
  await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    let doctor;
    if (/^[0-9a-fA-F]{24}$/.test(argv.doctor)) {
      doctor = await User.findById(argv.doctor);
    } else {
      doctor = await User.findOne({ doctorCode: argv.doctor });
    }
    if (!doctor) {
      console.error('Doctor not found');
      process.exit(1);
    }

    const appts = await Appointment.find({ doctorId: doctor._id, date: argv.date, status: { $ne: 'canceled' } })
      .select('_id date time status patientId')
      .populate('patientId', 'name email');

    if (!appts.length) {
      console.log('No non-canceled appointments found for that doctor/date.');
    } else {
      console.log(`Found ${appts.length} appointment(s):`);
      appts.forEach(a => {
        console.log(`- ${a._id} | ${a.date} ${a.time} | status=${a.status} | patient=${a.patientId?.name || 'N/A'} (${a.patientId?.email || ''})`);
      });
    }
  } catch (err) {
    console.error('Error:', err.message || err);
  } finally {
    await mongoose.connection.close();
  }
}

main();
