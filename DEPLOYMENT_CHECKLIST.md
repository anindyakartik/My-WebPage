# ✅ Deployment Checklist - Vercel + Render

Quick checklist to deploy your portfolio. Follow in order!

---

## 📋 STEP 1: MongoDB Atlas (5 minutes)

- [ ] Go to https://www.mongodb.com/cloud/atlas
- [ ] Create free account
- [ ] Create M0 (free) cluster
- [ ] Create database user (save password!)
- [ ] Allow access from anywhere (0.0.0.0/0)
- [ ] Get connection string
- [ ] Replace `<password>` with actual password
- [ ] Add `/portfolio` before the `?`
- [ ] **Save connection string somewhere safe!**

**Your connection string should look like:**
```
mongodb+srv://admin:yourpassword@cluster.xxxxx.mongodb.net/portfolio?retryWrites=true&w=majority
```

---

## 📋 STEP 2: Update Frontend Code (5 minutes)

Update API URLs in these files to point to Render:

### File: `pages/work.js`
```javascript
// Line 3: Change from
const API_BASE = 'http://localhost:3000/api';

// To (we'll update the URL after Render deployment)
const API_BASE = 'https://YOUR-RENDER-URL.onrender.com/api';
```

### File: `pages/musings.js`
```javascript
// Line 3: Change from
const API_BASE = 'http://localhost:3000/api';

// To
const API_BASE = 'https://YOUR-RENDER-URL.onrender.com/api';
```

### File: `pages/shelf.js`
```javascript
// Line 3: Change from
const API_BASE = 'http://localhost:3000/api';

// To
const API_BASE = 'https://YOUR-RENDER-URL.onrender.com/api';
```

### File: `admin-script.js`
```javascript
// Line 3: Change from
const API_BASE = 'http://localhost:3000/api';

// To
const API_BASE = 'https://YOUR-RENDER-URL.onrender.com/api';
```

> **Note:** We'll come back and update these URLs after deploying to Render

---

## 📋 STEP 3: Push to GitHub (2 minutes)

- [ ] Create GitHub repository (if not done)
- [ ] Commit all changes
- [ ] Push to GitHub

```bash
git init
git add .
git commit -m "Ready for deployment"
git branch -M main
git remote add origin https://github.com/yourusername/your-repo.git
git push -u origin main
```

---

## 📋 STEP 4: Deploy Backend to Render (10 minutes)

- [ ] Go to https://render.com
- [ ] Sign up with GitHub
- [ ] Click "New +" → "Web Service"
- [ ] Connect your GitHub repository
- [ ] Configure:
  - Name: `anindya-portfolio-api`
  - Region: Choose closest to you
  - Branch: `main`
  - Runtime: `Node`
  - Build Command: `npm install`
  - Start Command: `node cms-server.js`
  - Plan: **Free**

- [ ] Add Environment Variables (click "Advanced"):

```
MONGODB_URI = [paste your MongoDB connection string]
ADMIN_USERNAME = admin
ADMIN_PASSWORD = [create strong password]
JWT_SECRET = [random 64-character string]
SESSION_SECRET = [random 64-character string]
EMAIL_USER = your-email@gmail.com
EMAIL_PASS = [your Gmail app password]
NODE_ENV = production
PORT = 10000
ALLOWED_ORIGINS = *
```

> **Generate random strings:** https://www.random.org/strings/

- [ ] Click "Create Web Service"
- [ ] Wait 5-10 minutes for deployment
- [ ] **Copy your Render URL** (e.g., `https://anindya-portfolio-api.onrender.com`)
- [ ] Test: Visit `https://YOUR-URL.onrender.com/api/projects`
- [ ] Should see: `{"success":true,"data":[]}`

✅ **Backend is live!**

---

## 📋 STEP 5: Update Frontend with Render URL (3 minutes)

Now that you have your Render URL, update the frontend:

### Update these files with your actual Render URL:
- [ ] `pages/work.js` - Line 3
- [ ] `pages/musings.js` - Line 3
- [ ] `pages/shelf.js` - Line 3
- [ ] `admin-script.js` - Line 3

Replace `https://YOUR-RENDER-URL.onrender.com` with your actual URL.

### Commit and push:
```bash
git add .
git commit -m "Update API URLs for Render"
git push origin main
```

---

## 📋 STEP 6: Deploy Frontend to Vercel (5 minutes)

- [ ] Go to https://vercel.com
- [ ] Sign up with GitHub
- [ ] Click "Add New..." → "Project"
- [ ] Import your GitHub repository
- [ ] Configure:
  - Project Name: `anindya-portfolio`
  - Framework Preset: Other
  - Root Directory: `./`
  - Build Command: (leave empty)
  - Output Directory: (leave empty)
- [ ] Click "Deploy"
- [ ] Wait 2-3 minutes
- [ ] **Copy your Vercel URL** (e.g., `https://anindya-portfolio.vercel.app`)

✅ **Frontend is live!**

---

## 📋 STEP 7: Update CORS on Render (2 minutes)

- [ ] Go to Render dashboard
- [ ] Click your web service
- [ ] Go to "Environment" tab
- [ ] Find `ALLOWED_ORIGINS`
- [ ] Update to your Vercel URL:
```
ALLOWED_ORIGINS = https://anindya-portfolio.vercel.app
```
- [ ] Click "Save Changes"
- [ ] Service will auto-redeploy (wait 2-3 minutes)

---

## 📋 STEP 8: Test Everything (5 minutes)

### Test Frontend:
- [ ] Visit `https://anindya-portfolio.vercel.app`
- [ ] Home page loads ✅
- [ ] Work page loads ✅
- [ ] Musings page loads ✅
- [ ] Shelf page loads ✅
- [ ] Now page loads ✅
- [ ] Contact page loads ✅

### Test Admin Panel:
- [ ] Go to `https://anindya-portfolio.vercel.app/admin.html`
- [ ] Login with your credentials
- [ ] Add a test project
- [ ] Go to work page
- [ ] Project appears ✅

### Test API:
- [ ] Visit `https://YOUR-RENDER-URL.onrender.com/api/projects`
- [ ] Should see your test project ✅

---

## 🎉 YOU'RE LIVE!

Your portfolio is now deployed!

**URLs:**
- Frontend: `https://anindya-portfolio.vercel.app`
- Backend: `https://anindya-portfolio-api.onrender.com`
- Admin: `https://anindya-portfolio.vercel.app/admin.html`

---

## 🔧 Common Issues

### Issue: Frontend can't connect to backend
**Fix:** Check CORS settings in Render, verify API URLs in frontend

### Issue: Backend takes 30-60 seconds to respond (first time)
**Reason:** Render free tier spins down after 15 min inactivity
**Fix:** Upgrade to paid plan ($7/month) or accept cold starts

### Issue: Admin login fails
**Fix:** Check ADMIN_USERNAME and ADMIN_PASSWORD in Render environment variables

### Issue: MongoDB connection error
**Fix:** Verify MONGODB_URI in Render, check MongoDB Atlas network access

---

## 📱 Next Steps

### Add Custom Domain (Optional):

**Frontend (Vercel):**
1. Vercel Dashboard → Your Project → Settings → Domains
2. Add your domain
3. Update DNS records as instructed

**Backend (Render):**
1. Render Dashboard → Your Service → Settings → Custom Domain
2. Add subdomain (e.g., `api.yourdomain.com`)
3. Update DNS records

### Upgrade Plans (Optional):

**Render ($7/month):**
- No cold starts
- Always-on
- Better performance

**Vercel Pro ($20/month):**
- More bandwidth
- Better analytics

---

## 🎯 Quick Commands

```bash
# Update and redeploy
git add .
git commit -m "Your changes"
git push origin main
# Both Vercel and Render auto-deploy!

# View Render logs
# Go to: https://dashboard.render.com → Your service → Logs

# View Vercel deployments
# Go to: https://vercel.com/dashboard → Your project
```

---

## ✅ Final Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Backend deployed to Render
- [ ] Frontend deployed to Vercel
- [ ] CORS configured
- [ ] All pages working
- [ ] Admin panel accessible
- [ ] Can add content
- [ ] Content appears on pages

---

**Congratulations! Your portfolio is live! 🚀✨**

For detailed instructions, see: **VERCEL_RENDER_DEPLOYMENT.md**
