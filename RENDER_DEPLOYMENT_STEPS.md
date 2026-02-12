# 🚀 Deploy Backend to Render - Step by Step

Follow these exact steps to deploy your backend on Render.

---

## ✅ PREREQUISITES

Before starting, you need:
1. GitHub account (you already have this)
2. Your code pushed to GitHub (we'll do this)
3. MongoDB Atlas connection string (we'll set this up)

---

## STEP 1: Setup MongoDB Atlas (5 minutes)

### 1.1 Create Account
1. Go to: https://www.mongodb.com/cloud/atlas
2. Click "Try Free"
3. Sign up with Google or Email

### 1.2 Create Cluster
1. After login, click "Build a Database"
2. Choose "M0 FREE" tier
3. Select a cloud provider (AWS recommended)
4. Choose region closest to you
5. Cluster Name: `Cluster0` (default is fine)
6. Click "Create"

### 1.3 Create Database User
1. You'll see "Security Quickstart"
2. Choose "Username and Password"
3. Username: `admin`
4. Password: Click "Autogenerate Secure Password" (COPY THIS PASSWORD!)
5. Click "Create User"

### 1.4 Setup Network Access
1. Click "Add My Current IP Address"
2. Then click "Add a Different IP Address"
3. Enter: `0.0.0.0/0` (allows access from anywhere)
4. Description: `Allow all`
5. Click "Add Entry"
6. Click "Finish and Close"

### 1.5 Get Connection String
1. Click "Database" in left sidebar
2. Click "Connect" button on your cluster
3. Click "Drivers"
4. Copy the connection string (looks like this):
   ```
   mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` with the password you copied earlier
6. Add `/portfolio` before the `?`:
   ```
   mongodb+srv://admin:yourpassword@cluster0.xxxxx.mongodb.net/portfolio?retryWrites=true&w=majority
   ```

**SAVE THIS CONNECTION STRING - YOU'LL NEED IT!**

---

## STEP 2: Push Code to GitHub (2 minutes)

Open your terminal and run:

```bash
# Add all files
git add .

# Commit changes
git commit -m "Prepare backend for Render deployment"

# Push to GitHub
git push origin main
```

---

## STEP 3: Deploy on Render (10 minutes)

### 3.1 Create Render Account
1. Go to: https://render.com
2. Click "Get Started"
3. Sign up with GitHub (recommended)
4. Authorize Render to access your GitHub

### 3.2 Create Web Service
1. Click "New +" button (top right)
2. Select "Web Service"
3. Click "Connect" next to your repository
   - If you don't see it, click "Configure account" and grant access
4. You'll see the configuration page

### 3.3 Configure Service
Fill in these settings:

**Basic Settings:**
- **Name**: `anindya-portfolio-api` (or any name you like)
- **Region**: Choose closest to you (e.g., Oregon, Frankfurt, Singapore)
- **Branch**: `main`
- **Root Directory**: Leave empty
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `node cms-server.js`

**Instance Type:**
- Select: **Free** (scroll down to find it)

### 3.4 Add Environment Variables
Scroll down to "Environment Variables" section and click "Add Environment Variable" for each:

```
MONGODB_URI
Value: [paste your MongoDB connection string from Step 1.5]

ADMIN_USERNAME
Value: admin

ADMIN_PASSWORD
Value: [create a strong password - this is for logging into your admin panel]

JWT_SECRET
Value: [random 64-character string - see below]

SESSION_SECRET
Value: [another random 64-character string - see below]

EMAIL_USER
Value: your-email@gmail.com

EMAIL_PASS
Value: [your Gmail app password - see below]

NODE_ENV
Value: production

PORT
Value: 10000

ALLOWED_ORIGINS
Value: https://anindya-portfoloi.vercel.app
```

**How to generate random strings for JWT_SECRET and SESSION_SECRET:**
- Go to: https://www.random.org/strings/
- Set: 64 characters, 1 string
- Click "Get Strings"
- Copy and paste

**How to get Gmail App Password:**
1. Go to: https://myaccount.google.com/security
2. Enable 2-Step Verification (if not enabled)
3. Search for "App passwords"
4. Select "Mail" and "Other (Custom name)"
5. Name it "Portfolio Backend"
6. Click "Generate"
7. Copy the 16-character password (no spaces)

### 3.5 Deploy
1. Click "Create Web Service" button at the bottom
2. Wait 5-10 minutes for deployment
3. You'll see logs scrolling - this is normal
4. Wait for "Your service is live 🎉" message

### 3.6 Copy Your Backend URL
1. At the top of the page, you'll see your URL
2. It looks like: `https://anindya-portfolio-api.onrender.com`
3. **COPY THIS URL - YOU'LL NEED IT!**

---

## STEP 4: Test Your Backend (2 minutes)

### 4.1 Test API Endpoint
1. Open a new browser tab
2. Go to: `https://YOUR-RENDER-URL.onrender.com/api/projects`
3. You should see:
   ```json
   {"success":true,"data":[]}
   ```

If you see this, your backend is working! ✅

### 4.2 Test Admin Login
1. Go to: `https://YOUR-RENDER-URL.onrender.com/api/admin/verify`
2. You should see:
   ```json
   {"success":false,"message":"Not authenticated"}
   ```

This is correct - it means the auth system is working! ✅

---

## STEP 5: Update Frontend API URLs (5 minutes)

Now update your frontend to use the Render backend URL.

### 5.1 Update pages/shelf.js
Open `pages/shelf.js` and change line 3:
```javascript
const API_BASE = 'https://YOUR-RENDER-URL.onrender.com/api';
```

### 5.2 Update pages/work.js
Open `pages/work.js` and change line 8:
```javascript
const API_BASE = 'https://YOUR-RENDER-URL.onrender.com/api';
```

### 5.3 Update pages/musings.js
Open `pages/musings.js` and change line 8:
```javascript
const API_BASE = 'https://YOUR-RENDER-URL.onrender.com/api';
```

### 5.4 Update frontend/admin-script.js
Open `frontend/admin-script.js` and change line 8:
```javascript
const API_BASE = 'https://YOUR-RENDER-URL.onrender.com/api';
```

### 5.5 Move pages folder to frontend
```bash
mv pages frontend/
```

### 5.6 Push changes
```bash
git add .
git commit -m "Update API URLs to Render backend"
git push origin main
```

Vercel will automatically redeploy your frontend with the new API URLs!

---

## STEP 6: Final Test (5 minutes)

### 6.1 Test Frontend
1. Go to: `https://anindya-portfoloi.vercel.app`
2. All pages should load without errors

### 6.2 Test Admin Panel
1. Go to: `https://anindya-portfoloi.vercel.app/admin.html`
2. Login with:
   - Username: `admin`
   - Password: [the ADMIN_PASSWORD you set in Render]
3. You should see the admin dashboard ✅

### 6.3 Add Test Content
1. Click "Projects" tab
2. Click "Add Project" button
3. Fill in:
   - Title: "Test Project"
   - Description: "This is a test"
   - Status: "Completed"
   - Published: ✓ (checked)
4. Click "Save"
5. Go to: `https://anindya-portfoloi.vercel.app/work.html`
6. You should see your test project! ✅

---

## 🎉 CONGRATULATIONS!

Your portfolio is now fully deployed:

- ✅ Frontend: Vercel
- ✅ Backend: Render
- ✅ Database: MongoDB Atlas
- ✅ Admin Panel: Working
- ✅ Dynamic Content: Loading

**Your URLs:**
- Frontend: `https://anindya-portfoloi.vercel.app`
- Backend: `https://YOUR-RENDER-URL.onrender.com`
- Admin: `https://anindya-portfoloi.vercel.app/admin.html`

---

## 🔧 Troubleshooting

### Backend takes 30-60 seconds to respond (first time)
**Reason:** Render free tier "spins down" after 15 minutes of inactivity
**Solution:** This is normal. First request wakes it up. Upgrade to paid plan ($7/month) to avoid this.

### CORS Error
**Fix:** Make sure `ALLOWED_ORIGINS` in Render includes your Vercel URL

### MongoDB Connection Error
**Fix:** 
1. Check `MONGODB_URI` in Render environment variables
2. Verify MongoDB Atlas network access allows 0.0.0.0/0
3. Check MongoDB Atlas user password is correct

### Admin Login Fails
**Fix:** Check `ADMIN_USERNAME` and `ADMIN_PASSWORD` in Render environment variables

### Frontend can't load data
**Fix:** 
1. Verify API URLs in frontend files point to Render
2. Check Render logs for errors
3. Test backend directly: `https://YOUR-RENDER-URL.onrender.com/api/projects`

---

## 📱 View Render Logs

To see what's happening on your backend:
1. Go to: https://dashboard.render.com
2. Click your service
3. Click "Logs" tab
4. You'll see real-time logs

---

## 🚀 Next Steps

1. Add your own content through the admin panel
2. Customize the design
3. Add a custom domain (optional)
4. Share your portfolio with the world!

---

**Need help? Check the logs in Render dashboard or test each endpoint individually.**
