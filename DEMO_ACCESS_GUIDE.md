# 📋 MedPal Demo Access Guide

## 🎯 How to Login and Test Each Role

### 🔑 Demo Login Credentials

#### 🏥 **CLINIC ADMIN**
```
Email: admin@demo.medpal.com
Password: Demo123!
URL: http://localhost:5173/clinic
```
**What you can do:**
- View all doctors and departments
- Manage appointments across the clinic
- See patient reports and statistics
- Add new doctors and services
- Manage clinic profile and settings

---

#### 👨‍⚕️ **DOCTORS** (12 available)
```
Dr. Alban Krasniqi:     alban.krasniqi@demo.medpal.com     / Doctor123!
Dr. Fatmira Hoxha:      fatmira.hoxha@demo.medpal.com      / Doctor123!
Dr. Ardit Berisha:      ardit.berisha@demo.medpal.com      / Doctor123!
Dr. Teuta Gashi:        teuta.gashi@demo.medpal.com        / Doctor123!
Dr. Flamur Kastrati:    flamur.kastrati@demo.medpal.com    / Doctor123!
Dr. Valdete Salihi:     valdete.salihi@demo.medpal.com     / Doctor123!
```
**URL:** http://localhost:5173/doctor

**What you can do:**
- View your appointments (past & upcoming)
- Create visit reports for completed appointments
- See your patient list and history
- Manage your working hours
- Update your profile

---

#### 👥 **PATIENTS** (20 available)
```
Agron Berisha:      agron.berisha@demo.medpal.com      / Patient123!
Lindita Kastrati:   lindita.kastrati@demo.medpal.com   / Patient123!
Fatmir Gashi:       fatmir.gashi@demo.medpal.com       / Patient123!
Valdete Salihi:     valdete.salihi@demo.medpal.com     / Patient123!
Driton Ahmeti:      driton.ahmeti@demo.medpal.com      / Patient123!
Vjollca Malaj:      vjollca.malaj@demo.medpal.com      / Patient123!
```
**URL:** http://localhost:5173/patient

**What you can do:**
- Book new appointments with doctors
- View your appointment history
- See your visit reports and medical records
- Upload documents (prescriptions, tests)
- Update your profile

---

## 🚀 Quick Testing Guide

### **Step 1: Start the Application**
```bash
# Backend (Terminal 1)
cd backend
npm start

# Frontend (Terminal 2) 
cd frontend
npm run dev
```

### **Step 2: Test Each Role**

#### **🏥 Test Clinic Dashboard:**
1. Go to: http://localhost:5173/login
2. Login: admin@demo.medpal.com / Demo123!
3. **You'll see:**
   - Professional clinic dashboard
   - 6 departments with services
   - 12 doctors listed
   - 40+ appointments (past & future)
   - Patient reports and statistics

#### **👨‍⚕️ Test Doctor Dashboard:**
1. Go to: http://localhost:5173/login  
2. Login: alban.krasniqi@demo.medpal.com / Doctor123!
3. **You'll see:**
   - Your specific appointments
   - Patients you've seen
   - Option to create visit reports
   - Your working hours settings

#### **👥 Test Patient Dashboard:**
1. Go to: http://localhost:5173/login
2. Login: agron.berisha@demo.medpal.com / Patient123!
3. **You'll see:**
   - Your appointment history
   - Visit reports from doctors
   - Option to book new appointments
   - Your uploaded documents

---

## 📊 Demo Data Summary

**Created for you:**
- ✅ 1 Professional clinic: "Klinika MedLife Prishtinë"
- ✅ 6 Medical departments
- ✅ 30 Medical services  
- ✅ 12 Doctors with Albanian names
- ✅ 20 Patients with Albanian names
- ✅ 40 Appointments (25 past + 15 future)
- ✅ ~20 Visit reports with medical details
- ✅ Complete working hours for all doctors

---

## 🎭 Multi-Tab Testing

**Test different roles simultaneously:**
1. **Tab 1:** Login as clinic admin
2. **Tab 2:** Login as doctor
3. **Tab 3:** Login as patient

This lets you see how actions in one role affect others!

---

## 🧹 Clean Up (When Ready)

```bash
# Remove ALL demo data safely
node scripts/clean-demo-data.js
```

**This will remove ONLY demo data - your real data stays safe!**