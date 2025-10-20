const cron = require("node-cron");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const moment = require("moment");
const path = require("path");
const Appointment = require("./models/Appointment");
const User = require("./models/User");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

console.log("📅 Reminder job initialized - using existing MongoDB connection");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: { rejectUnauthorized: process.env.EMAIL_REJECT_UNAUTHORIZED === "true" }
});

// Kontrollo çdo 10 sekonda (vetëm për testim, pastaj bëje 1 herë në ditë në 08:00)
cron.schedule("0 8 * *  *", async () => {
  console.log("⏰ Kontroll duke u bërë...");

  const now = moment().startOf("day");

  // -------------------- Sot --------------------
  const todayStart = now.clone();
  const todayEnd = now.clone().endOf("day");

  const appointmentsToday = await Appointment.find({
    date: { $gte: todayStart.toDate(), $lte: todayEnd.toDate() },
    status: "approved",
  });

  for (const appt of appointmentsToday) {
    const patient = await User.findById(appt.patientId);
    const readableDate = moment(appt.date).format("YYYY-MM-DD");
    const time = appt.time;

    if (patient?.email) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: patient.email,
        subject: "📅 Kujtesë për Terminin Sot",
        text: `Përshëndetje ${patient.name},\n\nSot (${readableDate}) keni një vizitë te mjeku në ora ${time}.\nJu lutem mos harroni!\n\nFaleminderit,\nMedPal`,
      });
      console.log(`📧 Kujtesë për sot dërguar për: ${patient.email}`);
    }
  }

  // -------------------- Nesër --------------------
  const tomorrowStart = now.clone().add(1, "day").startOf("day");
  const tomorrowEnd = now.clone().add(1, "day").endOf("day");

  const appointmentsTomorrow = await Appointment.find({
    date: { $gte: tomorrowStart.toDate(), $lte: tomorrowEnd.toDate() },
    status: "approved",
  });

  for (const appt of appointmentsTomorrow) {
    const patient = await User.findById(appt.patientId);
    const readableDate = moment(appt.date).format("DD/MM/YYYY");
    const time = appt.time;

    if (patient?.email) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: patient.email,
        subject: "📅 Kujtesë për Terminin Nesër",
        text: `Përshëndetje ${patient.name},\n\nNesër (${readableDate}) keni një vizitë te mjeku në ora ${time}.\nJu lutem mos harroni!\n\nFaleminderit,\nMedPal`,
      });
      console.log(`📧 Kujtesë për nesër dërguar për: ${patient.email}`);
    }
  }

  // -------------------- Pasnesër --------------------
  const dayAfterTomorrowStart = now.clone().add(2, "day").startOf("day");
  const dayAfterTomorrowEnd = now.clone().add(3, "day").startOf("day");

  const appointmentsDayAfterTomorrow = await Appointment.find({
    date: { $gte: dayAfterTomorrowStart.toDate(), $lt: dayAfterTomorrowEnd.toDate() },
    status: "approved",
  });

  for (const appt of appointmentsDayAfterTomorrow) {
    const patient = await User.findById(appt.patientId);
    const readableDate = moment(appt.date).format("DD/MM/YYYY");
    const time = appt.time;

    if (patient?.email) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: patient.email,
        subject: "📅 Kujtesë për Terminin Pasnesër",
        text: `Përshëndetje ${patient.name},\n\nPasnesër (${readableDate}) keni një vizitë te mjeku në ora ${time}.\nJu lutem mos harroni!\n\nFaleminderit,\nMedPal`,
      });
      console.log(`📧 Kujtesë për pasnesër dërguar për: ${patient.email}`);
    }
  }
});
