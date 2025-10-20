const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendVerificationEmail = async (to, code, link = null, name = null, clinicName = null) => {
  const subject = link
    ? `📩 Ftesë nga Klinika ${clinicName} për MedPal`
    : "Verifikimi i Emailit - MedPal";

  const html = `
    <!DOCTYPE html>
    <html lang="sq">
    <head>
      <meta charset="UTF-8" />
      <title>${subject}</title>
    </head>
    <body style="font-family: Arial, sans-serif; color: #333;">
      ${
        link
          ? `
        <h2>Përshëndetje ${name},</h2>
        <p>Klinika <strong>${clinicName}</strong> ju ka ftuar të regjistroheni në platformën <strong>MedPal</strong>.</p>
        <p><strong>Kodi juaj i verifikimit:</strong> <span style="color: #007bff; font-size: 18px; font-weight: bold;">${code}</span></p>
        <p>Kliko butonin më poshtë për të regjistruar llogarinë tuaj:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${link}" style="display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #D9A299, #DCC5B2); color: white; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 15px rgba(217, 162, 153, 0.3);">
            🎉 Regjistrohu në MedPal
          </a>
        </div>
        <p style="margin-top: 20px; color: #666;">Nëse nuk e keni kërkuar këtë ftesë, thjesht injoroni këtë email.</p>
        `
          : `
        <h2>Përshëndetje,</h2>
        <p>Faleminderit që u regjistruat në <strong>MedPal</strong>.</p>
        <p><strong>Kodi juaj i verifikimit është:</strong> <span style="color: #007bff; font-size: 18px;">${code}</span></p>
        <p>Fusni këtë kod në aplikacion për të aktivizuar llogarinë tuaj.</p>
        `
      }
    </body>
    </html>
  `;

  const text = link
    ? `Përshëndetje ${name}, Klinika ${clinicName} ju fton në MedPal. Kodi: ${code}. Verifiko llogarinë: ${link}`
    : `Përshëndetje, kodi juaj i verifikimit në MedPal është: ${code}`;

  const mailOptions = {
    from: `"MedPal" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = sendVerificationEmail;
