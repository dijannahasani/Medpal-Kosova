#!/usr/bin/env node
const path = require('path');
const mongoose = require('mongoose');

// Load backend .env reliably
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

const Document = require('../models/Document');
const User = require('../models/User');

async function main() {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!mongoUri) {
    console.error('Missing MONGODB_URI / MONGO_URI in backend/.env');
    process.exit(1);
  }

  await mongoose.connect(mongoUri);
  console.log('Connected to MongoDB');

  try {
    // List all documents
    const documents = await Document.find({}).populate('patientId', 'name email');
    
    console.log(`\n📄 Total documents: ${documents.length}`);
    
    if (documents.length > 0) {
      console.log('\n📋 Documents list:');
      documents.forEach((doc, index) => {
        console.log(`${index + 1}. "${doc.title}" - ${doc.patientId?.name || 'Unknown'} (${doc.fileUrl})`);
      });
    } else {
      console.log('\n📭 No documents found in database');
    }

    // Test delete functionality (uncomment to test)
    // const docId = documents[0]?._id;
    // if (docId) {
    //   await Document.findByIdAndDelete(docId);
    //   console.log(`\n✅ Test: Deleted document ${docId}`);
    // }

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
  }
}

main();