# Email Configuration Setup

## Problems Fixed:
1. **"Keni harruar fjalekalimin" not working** - Email configuration missing
2. **Registration 400 Bad Request** - CLINIC_CODES environment variable missing

## 1. Create .env file in backend directory

Create a `.env` file in the `backend` directory with the following content:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/medpal

# JWT Secret
JWT_SECRET=your_jwt_secret_here

# Email Configuration (Gmail)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password_here

# Client URL
CLIENT_URL=http://localhost:3000

# Server Port
PORT=5000

# Clinic Registration Codes (optional)
# If not set, clinic registration will work without codes
# If set, clinics need one of these codes to register
CLINIC_CODES=CLINIC001,CLINIC002,CLINIC003
```

## 2. Gmail Setup

### Step 1: Enable 2-Factor Authentication
1. Go to your Google Account settings
2. Enable 2-Factor Authentication

### Step 2: Generate App Password
1. Go to Google Account → Security → 2-Step Verification
2. Scroll down to "App passwords"
3. Generate a new app password for "Mail"
4. Copy the 16-character password

### Step 3: Update .env file
Replace `your_app_password_here` with the generated app password.

## 3. Test the Configuration

Basic environment/config test:
```bash
cd backend
node test-setup.js
```

Optional: Send a real test email (after configuring EMAIL_USER and EMAIL_PASS):
```bash
cd backend
node scripts/send-test-email.js your.address@example.com
```

## 4. Alternative Email Services

If Gmail doesn't work, you can use other services by modifying `backend/utils/sendEmail.js`:

### Outlook/Hotmail
```javascript
const transporter = nodemailer.createTransport({
  service: "hotmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
```

### Custom SMTP
```javascript
const transporter = nodemailer.createTransport({
  host: "smtp.your-provider.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
```

## 5. Troubleshooting

### Common Issues:
1. **"Email already in use"** - This means the email exists but forgot password isn't working due to email config
2. **"Gabim gjatë dërgimit të emailit"** - Email configuration issue
3. **No email received** - Check spam folder, verify email config

### Debug Steps:
1. Check if .env file exists and has correct values
2. Verify Gmail app password is correct
3. Check server logs for email errors
4. Test with a simple email first
