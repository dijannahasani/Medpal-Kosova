require('dotenv').config();
const nodemailer = require('nodemailer');

async function main() {
  const to = process.argv[2];
  if (!to) {
    console.error('Usage: node scripts/send-test-email.js <recipient@example.com>');
    process.exit(1);
  }

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('EMAIL_USER or EMAIL_PASS not set in .env');
    process.exit(1);
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: `MedPal <${process.env.EMAIL_USER}>`,
      to,
      subject: 'MedPal test email',
      html: '<p>This is a test email from MedPal backend.</p>',
    });
    console.log('Sent:', info.messageId || info.response);
  } catch (err) {
    console.error('Failed to send:', err.message);
    process.exit(1);
  }
}

main();
