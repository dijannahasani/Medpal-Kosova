# MedPal Clean Setup Instructions

## 🚀 Quick Start Guide

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file (copy from env-config.txt)
copy env-config.txt .env

# Edit .env file with your settings:
# - MONGODB_URI: Your MongoDB connection string
# - EMAIL_USER: Your Gmail address
# - EMAIL_PASS: Your Gmail app password
# - JWT_SECRET: Any random string
# - CLINIC_CODES: Optional clinic codes

# Start the backend server
npm start
```

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies (already done)
npm install

# Start the frontend server
npm start
```

### 3. Database Setup

Make sure you have MongoDB running:
- Local: `mongodb://localhost:27017/medpal`
- Cloud: Update MONGODB_URI in .env file

### 4. Email Configuration (Optional)

For forgot password and email verification:

1. **Enable 2-Factor Authentication** in your Google Account
2. **Generate App Password**:
   - Go to Google Account → Security → 2-Step Verification
   - Scroll to "App passwords"
   - Generate password for "Mail"
   - Copy the 16-character password
3. **Update .env file**:
   ```
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_16_character_app_password
   ```

## 🎯 Features Included

### ✅ Backend Features
- User authentication (login/register/forgot password)
- Role-based access (patient, doctor, clinic, admin)
- Email verification and password reset
- JWT token authentication
- MongoDB integration
- RESTful API endpoints

### ✅ Frontend Features
- React with Bootstrap UI
- Role-based routing
- Login/Register pages
- Dashboard for each role
- Responsive design
- Protected routes

### ✅ User Roles
- **Patient**: Book appointments, view reports, manage profile
- **Doctor**: Manage appointments, create reports, set working hours
- **Clinic**: Manage doctors, patients, services
- **Admin**: User management, system overview

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `POST /api/auth/verify-email` - Verify email

### Health Check
- `GET /api/health` - Check if API is running

## 🚨 Troubleshooting

### Common Issues:

1. **"Email already in use"**
   - Use forgot password instead of registering
   - Or delete existing user from database

2. **"Forgot password not working"**
   - Check EMAIL_USER and EMAIL_PASS in .env
   - Make sure Gmail app password is correct

3. **"Database connection failed"**
   - Check MONGODB_URI in .env
   - Make sure MongoDB is running

4. **"Token invalid"**
   - Clear localStorage and login again
   - Check JWT_SECRET in .env

## 📱 Usage

1. **Start Backend**: `cd backend && npm start`
2. **Start Frontend**: `cd frontend && npm start`
3. **Open Browser**: http://localhost:3000
4. **Register/Login** and start using the system!

## 🎉 You're Ready!

The clean MedPal project is now set up with all the essential features working. You can:
- Register as patient/clinic
- Login with any role
- Use forgot password (if email configured)
- Access role-specific dashboards
- Extend with additional features as needed

Happy coding! 🚀
