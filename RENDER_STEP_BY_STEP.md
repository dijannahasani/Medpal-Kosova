# 🚀 Render Deployment - Step-by-Step Guide

## ✅ Pre-Deployment Checklist
- [x] All localhost URLs replaced with dynamic API_BASE_URL
- [x] Environment variables configured
- [x] CORS properly configured
- [x] Security issues fixed
- [x] Backend .env file created
- [x] Frontend .env file created

---

## 📦 Part 1: Backend Deployment (Web Service)

### Your Backend is Already Deployed! ✅
**URL:** `https://medpal-aqpz.onrender.com`

### Update Environment Variables:

1. **Go to Render Dashboard:** https://dashboard.render.com
2. **Find your backend service:** Click on "medpal-aqpz" (or your backend service name)
3. **Click "Environment" in the left sidebar**
4. **Click "Add Environment Variable"**
5. **Add each variable below:**

#### Environment Variables (Add these EXACTLY as shown):

| Key | Value |
|-----|-------|
| `PORT` | `5000` |
| `MONGO_URI` | `mongodb+srv://gentianamehana:303PoGRcuKUr0Pla@medpalprojekti.ahjbgu5.mongodb.net/medpal?retryWrites=true&w=majority&appName=MedPalProjekti` |
| `JWT_SECRET` | `medpal_secret_key` |
| `EMAIL_USER` | `mehanagenta@gmail.com` |
| `EMAIL_PASS` | `fmdqoebuqsoxbrhl` |
| `CLINIC_CODES` | `medpal-kosova,klinika-x,klinika-y` |
| `CLIENT_URL` | `https://medpal-frontend.onrender.com` |
| `ADMIN_SECRET` | `18122002` |

6. **Click "Save Changes"**
7. **Your service will automatically redeploy**

### Verify Backend Settings:

**Settings → Build & Deploy:**
- **Build Command:** `npm install` (or leave empty, Render auto-detects)
- **Start Command:** `npm start`
- **Root Directory:** `backend` (if deploying from monorepo) OR leave empty if backend is at root

---

## 🎨 Part 2: Frontend Deployment (Static Site)

### Step 1: Create New Static Site

1. **Go to Render Dashboard:** https://dashboard.render.com
2. **Click "New +" button** (top right)
3. **Select "Static Site"**

### Step 2: Connect Repository

**If repository is already connected:**
- Select your repository from dropdown

**If repository is NOT connected:**
1. Click "Connect account" for GitHub/GitLab/Bitbucket
2. Authorize Render
3. Select your MedPal repository

### Step 3: Configure Static Site

Fill in these fields EXACTLY as shown:

#### **Name:**
```
medpal-frontend
```
*(Or any name you prefer)*

#### **Branch:**
```
main
```
*(Or your default branch name)*

#### **Root Directory:**
```
frontend
```
*(Leave empty if frontend is at root of repo)*

#### **Build Command:**
```
npm install && npm run build
```

#### **Publish Directory:**
```
dist
```

#### **Auto-Deploy:**
✅ **YES** (Check this box)
*(Auto-deploy on every push to main branch)*

### Step 4: Add Environment Variables

**BEFORE clicking "Create Static Site"**, scroll down to:

**Environment Variables Section:**

Click "Add Environment Variable" and add:

| Key | Value |
|-----|-------|
| `VITE_API_BASE_URL` | `https://medpal-aqpz.onrender.com` |

⚠️ **IMPORTANT:** No trailing slash in the URL!

### Step 5: Create Static Site

1. **Click "Create Static Site"** button at the bottom
2. **Wait for build to complete** (2-5 minutes)
3. **You'll get a URL** like: `https://medpal-frontend.onrender.com` or `https://medpal-frontend-abc123.onrender.com`

---

## 🔄 Part 3: Update Backend with Frontend URL

**After your frontend deploys and you get the URL:**

1. **Go back to Backend service** in Render Dashboard
2. **Click "Environment"**
3. **Find the `CLIENT_URL` variable**
4. **Update it** with your ACTUAL frontend URL (the one you just got)
   ```
   CLIENT_URL=https://medpal-frontend-abc123.onrender.com
   ```
   *(Replace with your actual URL)*
5. **Click "Save Changes"**
6. **Backend will redeploy automatically**

---

## ✅ Part 4: Verification

### Test Backend:
1. Open: `https://medpal-aqpz.onrender.com/`
2. Should see: **"MedPal API is running"** 🚀

### Test Frontend:
1. Open your frontend URL
2. Should load without errors
3. **Open DevTools** (F12) → Console tab
4. Should see NO red errors
5. Should see NO CORS errors

### Test Login:
1. Click "Login"
2. Select role (Patient/Clinic/Doctor)
3. Enter credentials
4. Open **Network tab** in DevTools
5. Watch the API calls
6. Should see requests going to: `https://medpal-aqpz.onrender.com`
7. Should get successful responses (200 status)

### Test Full Flow:
- ✅ Register new account
- ✅ Login
- ✅ Create appointment (if clinic/doctor)
- ✅ Book appointment (if patient)
- ✅ Upload documents
- ✅ View reports

---

## 🎯 Common Field Values Quick Reference

### Backend Service Settings:
```yaml
Service Name: medpal-backend (or medpal-aqpz)
Environment: Node
Region: Oregon (or closest to you)
Branch: main
Root Directory: backend (if monorepo) OR empty
Build Command: npm install
Start Command: npm start
```

### Frontend Static Site Settings:
```yaml
Service Name: medpal-frontend
Branch: main
Root Directory: frontend (if monorepo) OR empty
Build Command: npm install && npm run build
Publish Directory: dist
```

---

## 🔧 Troubleshooting

### ❌ Build Fails on Backend
**Check:**
- Root directory is set correctly
- `package.json` exists in backend folder
- All dependencies are in `package.json`

**Fix:** Go to Settings → Build & Deploy → Root Directory

### ❌ Build Fails on Frontend
**Check:**
- Build command is: `npm install && npm run build`
- Publish directory is: `dist`
- Root directory is: `frontend` (if monorepo)

**Fix:** Go to Settings → Build & Deploy

### ❌ Frontend Loads but API Calls Fail
**Check:**
1. Open DevTools → Network tab
2. Look at failed request URL
3. If it says `http://localhost:5000` → Environment variable not set
4. Go to Frontend service → Environment → Add `VITE_API_BASE_URL`

### ❌ CORS Errors
**Check:**
1. Backend `CLIENT_URL` environment variable
2. Must match EXACT frontend URL
3. No trailing slash
4. Must be HTTPS (not HTTP)

**Fix:** Backend → Environment → Update `CLIENT_URL`

### ❌ 502/503 Errors
**Cause:** Render free tier services sleep after 15 minutes

**Fix:** 
- First request after sleep takes 30-60 seconds
- Just wait and refresh
- Or upgrade to paid plan for always-on service

### ❌ MongoDB Connection Fails
**Check:**
1. MongoDB Atlas → Network Access
2. Should allow `0.0.0.0/0` (anywhere)
3. Or add Render IPs

**Fix:** MongoDB Atlas Dashboard → Network Access → Add IP Address

---

## 📸 Visual Guide: Where to Find Everything

### On Render Dashboard:

```
┌─────────────────────────────────────────┐
│  🏠 Dashboard                           │
│  ┌───────────────────────────────────┐ │
│  │  New +  [Button]                  │ │
│  └───────────────────────────────────┘ │
│                                         │
│  Your Services:                         │
│  ┌───────────────────────────────────┐ │
│  │ 🟢 medpal-aqpz (Backend)         │ │
│  │    https://medpal-aqpz.on...     │ │
│  │    [Settings] [Environment]      │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ 🟢 medpal-frontend               │ │
│  │    https://medpal-front...       │ │
│  │    [Settings] [Environment]      │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### In Service Settings:

```
Left Sidebar:
├─ 📊 Metrics
├─ 📝 Logs  ← Check here for errors
├─ 🎛️  Environment  ← Add variables here
├─ ⚙️  Settings
│  ├─ Build & Deploy  ← Commands here
│  ├─ Root Directory  ← Set path here
│  └─ Auto-Deploy
└─ 🔗 Custom Domains
```

---

## 📝 Deployment Checklist

### Before Clicking "Create":
- [ ] Repository connected
- [ ] Correct branch selected (main)
- [ ] Root directory set (if needed)
- [ ] Build command correct
- [ ] Publish directory correct (for frontend)
- [ ] Environment variables added
- [ ] Auto-deploy enabled

### After Deployment:
- [ ] Build completed successfully
- [ ] Service is live (green dot)
- [ ] Backend health check works
- [ ] Frontend loads
- [ ] No console errors
- [ ] API calls work
- [ ] Login works
- [ ] All features functional

---

## 🎉 Success Indicators

When everything is working:

✅ **Backend Logs show:**
```
✅ MongoDB connected successfully!
🔄 All services initialized successfully
🚀 Server running on port 5000
```

✅ **Frontend shows:**
- No red errors in console
- Login page loads
- API calls return data
- Features work

✅ **Network Tab shows:**
- Status: 200 OK
- Request URL: https://medpal-aqpz.onrender.com/api/...
- Response: JSON data

---

## 💰 Pricing Note

**Free Tier Limits:**
- ✅ Backend: 750 hours/month (enough for 24/7 for 1 month)
- ✅ Frontend: Unlimited
- ⚠️ Services sleep after 15 min inactivity
- ⚠️ First request after sleep: ~30-60 seconds

**Upgrade Benefits ($7/month per service):**
- ⚡ Always-on (no sleep)
- ⚡ Faster cold starts
- ⚡ More resources

---

## 🚀 You're Ready to Deploy!

Follow the steps above in order, and your MedPal application will be live on the internet!

**Estimated Time:** 10-15 minutes total

**Questions?** Check `DEPLOYMENT_GUIDE.md` for more details.

Good luck! 🎉

