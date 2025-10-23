# MedPal Deployment Guide

## 🚀 Issues Fixed

### 1. ✅ Hardcoded localhost URLs (85+ instances)
- Created `frontend/src/config/api.js` to centralize API configuration
- Replaced all `http://localhost:5000` with `${API_BASE_URL}` across all frontend files
- Now uses environment variable `VITE_API_BASE_URL`

### 2. ✅ CORS Configuration
- Fixed CORS to accept frontend domain from Render
- Added proper origin configuration with credentials support
- Removed insecure TLS rejection bypass

### 3. ✅ Environment Variables
- Created `backend/.env` with all necessary credentials
- Created `frontend/.env` with Render backend URL

### 4. ✅ Security Issues
- Removed `NODE_TLS_REJECT_UNAUTHORIZED = "0"` security bypass
- Implemented proper CORS configuration

---

## 📋 Backend Deployment (Render)

### Your Current Backend URL:
```
https://medpal-aqpz.onrender.com
```

### Environment Variables to Set on Render:

Go to your Render dashboard → Backend service → Environment → Add Environment Variables:

```
PORT=5000
MONGO_URI=mongodb+srv://gentianamehana:303PoGRcuKUr0Pla@medpalprojekti.ahjbgu5.mongodb.net/medpal?retryWrites=true&w=majority&appName=MedPalProjekti
JWT_SECRET=medpal_secret_key
EMAIL_USER=mehanagenta@gmail.com
EMAIL_PASS=fmdqoebuqsoxbrhl
CLINIC_CODES=medpal-kosova,klinika-x,klinika-y
CLIENT_URL=https://medpal-frontend.onrender.com
ADMIN_SECRET=18122002
```

### Build & Start Commands:
- **Build Command:** `npm install`
- **Start Command:** `npm start`

### Root Directory:
Make sure to set the root directory to `backend` if deploying from the monorepo.

---

## 🎨 Frontend Deployment (Render/Vercel/Netlify)

### Option 1: Render Static Site

1. **Create New Static Site** on Render
2. **Settings:**
   - Build Command: `cd frontend && npm install && npm run build`
   - Publish Directory: `frontend/dist`
   
3. **Environment Variables:**
   ```
   VITE_API_BASE_URL=https://medpal-aqpz.onrender.com
   ```

### Option 2: Vercel

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   cd frontend
   vercel
   ```

3. **Environment Variables in Vercel Dashboard:**
   ```
   VITE_API_BASE_URL=https://medpal-aqpz.onrender.com
   ```

### Option 3: Netlify

1. **Install Netlify CLI:**
   ```bash
   npm i -g netlify-cli
   ```

2. **Deploy:**
   ```bash
   cd frontend
   netlify deploy --prod
   ```

3. **Environment Variables in Netlify Dashboard:**
   ```
   VITE_API_BASE_URL=https://medpal-aqpz.onrender.com
   ```

---

## 🔧 Local Development

### Backend:
```bash
cd backend
npm install
npm start
```

### Frontend:
```bash
cd frontend
npm install
npm run dev
```

The frontend will automatically use `http://localhost:5000` if `VITE_API_BASE_URL` is not set.

---

## ✅ Verification Checklist

After deployment, verify:

- [ ] Backend health check: Visit `https://medpal-aqpz.onrender.com/` - should show "MedPal API is running"
- [ ] Frontend loads without errors
- [ ] Login functionality works
- [ ] API calls are going to Render backend (check Network tab in DevTools)
- [ ] No CORS errors in browser console
- [ ] All features work (appointments, documents, reports, etc.)

---

## 🐛 Troubleshooting

### Issue: CORS errors
**Solution:** Verify that `CLIENT_URL` environment variable on Render matches your frontend URL exactly.

### Issue: API calls failing
**Solution:** 
1. Check browser console for the actual API URL being called
2. Verify `VITE_API_BASE_URL` is set correctly in frontend deployment
3. Check Render backend logs for errors

### Issue: 502/503 errors
**Solution:** 
1. Render free tier services sleep after inactivity. First request may be slow.
2. Check MongoDB connection string is correct
3. Verify all environment variables are set on Render

### Issue: Build fails
**Solution:**
1. Make sure `package.json` in both frontend and backend have correct dependencies
2. Check Render build logs for specific errors
3. Verify Node version compatibility (use Node 18+)

---

## 📝 Important Notes

1. **Render Free Tier:** Services sleep after 15 minutes of inactivity. First request after sleep takes ~30-60 seconds.

2. **Frontend URL:** After deploying frontend, update `CLIENT_URL` environment variable in backend Render service to match your frontend URL.

3. **HTTPS:** Always use HTTPS URLs in production. HTTP URLs will cause mixed content errors.

4. **MongoDB:** Your MongoDB Atlas cluster must allow connections from anywhere (0.0.0.0/0) or specifically from Render IPs.

5. **Email Service:** Gmail may block less secure apps. Consider using app-specific passwords or services like SendGrid.

---

## 🎉 Success!

If all checks pass, your MedPal application is successfully deployed and ready to use!

**Backend:** https://medpal-aqpz.onrender.com
**Frontend:** [Your frontend URL here]

---

## 📞 Support

If you encounter issues:
1. Check Render logs (Dashboard → Service → Logs)
2. Check browser console for frontend errors
3. Verify all environment variables are set correctly
4. Check MongoDB Atlas network access settings

