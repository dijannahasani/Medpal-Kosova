const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const verifyToken = require("../middleware/verifyToken");
const Document = require("../models/Document");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + file.originalname;
    cb(null, unique);
  }
});

const upload = multer({ storage });

// 📤 POST /api/documents/upload
router.post("/upload", verifyToken, upload.single("file"), async (req, res) => {
  try {
    const { title } = req.body;
    const fileUrl = "/uploads/" + req.file.filename;

    const doc = new Document({
      patientId: req.user.id,
      title,
      fileUrl
    });

    await doc.save();
    res.status(201).json({ message: "Dokumenti u ngarkua me sukses.", document: doc });
  } catch (err) {
    console.error("❌ Gabim në upload:", err);
    res.status(500).json({ message: "Gabim gjatë ngarkimit të dokumentit." });
  }
});

// 📥 GET /api/documents/mine
router.get("/mine", verifyToken, async (req, res) => {
  try {
    const documents = await Document.find({ patientId: req.user.id });
    res.json(documents);
  } catch (err) {
    res.status(500).json({ message: "Gabim gjatë marrjes së dokumenteve." });
  }
});

// 🧪 GET /api/documents/test - Test route
router.get("/test", (req, res) => {
  res.json({ message: "✅ Documents routes are working!", timestamp: new Date() });
});

// 🧪 DELETE /api/documents/test - Test DELETE method
router.delete("/test", (req, res) => {
  res.json({ message: "✅ DELETE method is working!", timestamp: new Date() });
});

// 🗑️ DELETE /api/documents/:id
router.delete("/:id", verifyToken, async (req, res) => {
  console.log('🗑️ DELETE request received for ID:', req.params.id);
  try {
    const { id } = req.params;
    
    // Gjej dokumentin
    const document = await Document.findById(id);
    console.log('Document found:', document ? 'Yes' : 'No');
    
    if (!document) {
      return res.status(404).json({ message: "Dokumenti nuk u gjet." });
    }
    
    // Kontrollo nëse përdoruesi ka të drejtë ta fshijë
    console.log('User ID:', req.user.id, 'Document patientId:', document.patientId.toString());
    if (document.patientId.toString() !== req.user.id && req.user.role !== "doctor") {
      return res.status(403).json({ message: "S'keni të drejtë të fshini këtë dokument." });
    }
    
    // Fshi dokumentin nga databaza
    await Document.findByIdAndDelete(id);
    
    // Mundësisht fshi edhe fajlin fizik nga uploads/ (opsionale)
    const filePath = path.join(__dirname, '..', document.fileUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    console.log('✅ Document deleted successfully');
    res.json({ message: "✅ Dokumenti u fshi me sukses." });
  } catch (err) {
    console.error("❌ Gabim në fshirjen e dokumentit:", err);
    res.status(500).json({ message: "Gabim gjatë fshirjes së dokumentit." });
  }
});

module.exports = router;
