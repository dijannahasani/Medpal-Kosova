const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const User = require("../models/User");
const mongoose = require("mongoose");

// ⏱️ POST /api/working-hours → Shto ose përditëso orarin e mjekut
router.post("/", verifyToken, async (req, res) => {
  if (req.user.role !== "doctor") {
    return res.status(403).json({ message: "Vetëm mjekët mund të vendosin orarin." });
  }

  const { workingHours } = req.body;

  try {
    const doctor = await User.findById(req.user.id);
    if (!doctor || doctor.role !== "doctor") {
      return res.status(404).json({ message: "Mjeku nuk u gjet." });
    }

    doctor.workingHours = workingHours;
    await doctor.save();

    res.json({ message: "Orari u ruajt me sukses", workingHours: doctor.workingHours });
  } catch (err) {
    console.error("❌ Gabim në ruajtjen e orarit:", err.message);
    res.status(500).json({ message: "Gabim në server." });
  }
});

// � GET /api/working-hours/me → Merr orarin e mjekut të kyçur
router.get("/me", verifyToken, async (req, res) => {
  if (req.user.role !== "doctor") {
    return res.status(403).json({ message: "Vetëm mjekët kanë qasje." });
  }

  try {
    const doctor = await User.findById(req.user.id);
    if (!doctor) return res.status(404).json({ message: "Mjeku nuk u gjet." });

    res.json({ workingHours: doctor.workingHours || {} });
  } catch (err) {
    console.error("❌ Gabim:", err.message);
    res.status(500).json({ message: "Gabim në server." });
  }
});

// � GET /api/working-hours/:doctorId → Merr orarin e mjekut
router.get("/:doctorId", async (req, res) => {
  try {
    const { doctorId } = req.params;
    if (!mongoose.isValidObjectId(doctorId)) {
      return res.status(400).json({ message: "doctorId i pavlefshëm." });
    }

    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== "doctor") {
      return res.status(404).json({ message: "Mjeku nuk u gjet." });
    }

    res.json(doctor.workingHours || {});
  } catch (err) {
    console.error("❌ Gabim në marrjen e orarit:", err.message);
    res.status(500).json({ message: "Gabim në server." });
  }
});
// POST /api/working-hours/:doctorId → Vendos ose përditëso orarin nga klinika
router.post("/:doctorId", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "clinic") {
      return res.status(403).json({ message: "Vetëm klinika mund të vendosë orarin e mjekut." });
    }

    const { doctorId } = req.params;
    const { workingHours } = req.body;

    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== "doctor") {
      return res.status(404).json({ message: "Mjeku nuk u gjet." });
    }

    doctor.workingHours = workingHours;
    await doctor.save();

    res.json({ message: "✅ Orari u vendos me sukses!" });
  } catch (err) {
    console.error("❌ Gabim:", err);
    res.status(500).json({ message: "Gabim në server." });
  }
});


module.exports = router;
