# 🚀 Deploy Frontend on Vercel + Backend on Render

Complete step-by-step guide to deploy your portfolio with frontend on Vercel and backend on Render.

---

## 📋 Overview

**Architecture:**
```
Frontend (Vercel)          Backend (Render)         Database (MongoDB Atlas)
┌─────────────────┐       ┌─────────────────┐      ┌─────────────────┐
│  HTML/CSS/JS    │──────→│  Node.js API    │─────→│    MongoDB      │
│  Static Files   │       │  cms-server.js  │      │     Atlas       │
└─────────────────┘       └─────────────────┘      └─────────────────┘
  vercel.app               render.com               mongodb.com
```

**Benefits:**
- ✅ Frontend: Fast CDN delivery, automatic HTTPS
- ✅ Backend: Always-on server, easy scaling
- ✅ Database: Managed MongoDB, automatic backups
- ✅ Free tiers available for all three!

---

## 🎯 PART 1: Setup MongoDB Atlas (Database)

### Step 1: Create MongoDB Atlas Account

1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Try Free"
3. Sign up with email or Google
4. Verify your email

### Step 2: Create a Cluster

1. Click "Build a Database"
2. Choose **FREE** tier (M0 Sandbox)
3. Select cloud provider: **AWS**
4. Choose region closest to you (e.g., US East)
5. Cluster Name: `anindya-portfolio`
6. Click "Create"
7. Wait 3-5 minutes for cluster creation

### Step 3: Create Database User

1. Click "Database Access" in left sidebar
2. Click "Add New Database User"
3. Authentication Method: **Password**
4. Username: `admin` (or your choice)
5. Password: Click "Autogenerate Secure Password" and **SAVE IT**
6. Database User Privileges: **Read and write to any database**
7. Click "Add User"

### Step 4: Configure Network Access

1. Click "Network Access" in left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

> **Note**: For production, you can restrict this to Render's IP addresses later

### Step 5: Get Connection String

1. Click "Database" in left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Driver: **Node.js**, Version: **4.1 or later**
5. Copy the connection string:
   ```
   mongodb+srv://admin:<password>@anindya-portfolio.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Replace `<password>` with your actual password
7. Add database name before the `?`:
   ```
   mongodb+srv://admin:yourpassword@anindya-portfolio.xxxxx.mongodb.net/portfolio?retryWrites=true&w=majority
   ```

**Save this connection string - you'll need it!**

---

## 🎯 PART 2: Deploy Backend on Render

### Step 1: Prepare Your Repository

1. **Create a GitHub repository** (if you haven't already)
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/your-repo.git
   git push -u origin main
   ```

2. **Create `render.yaml`** in your project root:
   ```yaml
   services:
     - type: web
       name: anindya-portfolio-api
       env: node
       buildCommand: npm install
       startCommand: node cms-server.js
       envVars:
         - key: NODE_ENV
           value: production
         - key: PORT
           value: 10000
   ```

### Step 2: Create Render Account

1. Go to https://render.com
2. Click "Get Started"
3. Sign up with GitHub (recommended)
4. Authorize Render to access your repositories

### Step 3: Create Web Service

1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `anindya-portfolio-api`
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: Leave empty
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node cms-server.js`
   - **Plan**: **Free** (or paid for better performance)

### Step 4: Add Environment Variables

Click "Advanced" → "Add Environment Variable" and add these:

```
MONGODB_URI = mongodb+srv://admin:yourpassword@anindya-portfolio.xxxxx.mongodb.net/portfolio?retryWrites=true&w=majority

ADMIN_USERNAME = admin

ADMIN_PASSWORD = YourStrongPassword123!

JWT_SECRET = your-super-secret-jwt-key-min-32-characters-long-random-string

SESSION_SECRET = another-super-secret-session-key-min-32-characters-random

EMAIL_USER = your-email@gmail.com

EMAIL_PASS = your-gmail-app-password

NODE_ENV = production

PORT = 10000

ALLOWED_ORIGINS = https://your-frontend.vercel.app
```

> **Important**: We'll update `ALLOWED_ORIGINS` after deploying frontend

### Step 5: Deploy

1. Click "Create Web Service"
2. Render will:
   - Clone your repository
   - Install dependencies
   - Start your server
3. Wait 5-10 minutes for first deployment
4. You'll get a URL like: `https://anindya-portfolio-api.onrender.com`

**Save this URL - you'll need it for frontend!**

### Step 6: Test Backend

Open in browser:
```
https://anindya-portfolio-api.onrender.com/api/projects
```

You should see:
```json
{
  "success": true,
  "data": []
}
```

✅ Backend is live!

---

## 🎯 PART 3: Prepare Frontend for Vercel

### Step 1: Update API URLs

We need to point frontend to Render backend.

**Update `pages/work.js`:**
```javascript
// Replace this line:
const API_BASE = 'http://localhost:3000/api';

// With this:
const API_BASE = 'https://anindya-portfolio-api.onrender.com/api';
```

**Update `pages/musings.js`:**
```javascript
// Replace this line:
const API_BASE = 'http://localhost:3000/api';

// With this:
const API_BASE = 'https://anindya-portfolio-api.onrender.com/api';
```

**Update `pages/shelf.js`:**
```javascript
// Replace this line:
const API_BASE = 'http://localhost:3000/api';

// With this:
const API_BASE = 'https://anindya-portfolio-api.onrender.com/api';
```

**Update `admin-script.js`:**
```javascript
// Find this line (around line 3):
const API_BASE = 'http://localhost:3000/api';

// Replace with:
const API_BASE = 'https://anindya-portfolio-api.onrender.com/api';
```

**Update `dynamic-content.js`** (if used):
```javascript
// Replace:
const API_BASE = 'http://localhost:3000/api';

// With:
const API_BASE = 'https://anindya-portfolio-api.onrender.com/api';
```

### Step 2: Create vercel.json

Create `vercel.json` in project root:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "*.html",
      "use": "@vercel/static"
    },
    {
      "src": "*.css",
      "use": "@vercel/static"
    },
    {
      "src": "*.js",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ]
}
```

### Step 3: Create .vercelignore

Create `.vercelignore` to exclude backend files:
```
node_modules
cms-server.js
test-backend.js
models/
.env
.env.example
*.md
package-lock.json
```

### Step 4: Commit Changes

```bash
git add .
git commit -m "Configure for Vercel + Render deployment"
git push origin main
```

---

## 🎯 PART 4: Deploy Frontend on Vercel

### Step 1: Create Vercel Account

1. Go to https://vercel.com
2. Click "Sign Up"
3. Sign up with GitHub (recommended)
4. Authorize Vercel

### Step 2: Import Project

1. Click "Add New..." → "Project"
2. Import your GitHub repository
3. Configure:
   - **Project Name**: `anindya-portfolio`
   - **Framework Preset**: Other
   - **Root Directory**: `./`
   - **Build Command**: Leave empty (static site)
   - **Output Directory**: Leave empty
   - **Install Command**: `npm install` (optional)

### Step 3: Deploy

1. Click "Deploy"
2. Wait 2-3 minutes
3. You'll get a URL like: `https://anindya-portfolio.vercel.app`

✅ Frontend is live!

---

## 🎯 PART 5: Connect Frontend & Backend

### Step 1: Update CORS on Backend

1. Go to Render dashboard
2. Click your web service
3. Go to "Environment"
4. Update `ALLOWED_ORIGINS`:
   ```
   ALLOWED_ORIGINS = https://anindya-portfolio.vercel.app,https://anindya-portfolio-git-main-yourusername.vercel.app
   ```
5. Click "Save Changes"
6. Service will automatically redeploy

### Step 2: Test Everything

1. **Visit your frontend**: `https://anindya-portfolio.vercel.app`
2. **Test pages**:
   - Home page loads ✅
   - Work page loads ✅
   - Musings page loads ✅
   - Shelf page loads ✅
   - Now page loads ✅
   - Contact page loads ✅

3. **Test admin panel**:
   - Go to: `https://anindya-portfolio.vercel.app/admin.html`
   - Login with your credentials
   - Add a test project
   - Check if it appears on work page

---

## 🎯 PART 6: Custom Domain (Optional)

### For Frontend (Vercel):

1. Go to Vercel dashboard → Your project → Settings → Domains
2. Add your domain (e.g., `anindyakartik.com`)
3. Update DNS records as instructed:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```
4. Wait for DNS propagation (5-60 minutes)
5. SSL certificate automatically provisioned

### For Backend (Render):

1. Go to Render dashboard → Your service → Settings
2. Scroll to "Custom Domain"
3. Add subdomain (e.g., `api.anindyakartik.com`)
4. Update DNS records:
   ```
   Type: CNAME
   Name: api
   Value: anindya-portfolio-api.onrender.com
   ```
5. Wait for DNS propagation
6. SSL certificate automatically provisioned

### Update API URLs:

If using custom domain for backend, update all API_BASE URLs:
```javascript
const API_BASE = 'https://api.anindyakartik.com/api';
```

Then commit and push:
```bash
git add .
git commit -m "Update API URL to custom domain"
git push origin main
```

Vercel will auto-deploy the changes.

---

## 🔧 Configuration Files Summary

### Files to Update:

1. **pages/work.js** - Update API_BASE
2. **pages/musings.js** - Update API_BASE
3. **pages/shelf.js** - Update API_BASE
4. **admin-script.js** - Update API_BASE
5. **dynamic-content.js** - Update API_BASE (if used)

### Files to Create:

1. **vercel.json** - Vercel configuration
2. **.vercelignore** - Exclude backend files
3. **render.yaml** - Render configuration (optional)

---

## 🧪 Testing Checklist

### Backend (Render):
- [ ] Service is running
- [ ] MongoDB connected
- [ ] Environment variables set
- [ ] API endpoints responding
- [ ] Admin login works
- [ ] CORS configured

Test:
```bash
# Test public endpoint
curl https://anindya-portfolio-api.onrender.com/api/projects

# Test admin login
curl -X POST https://anindya-portfolio-api.onrender.com/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"your-password"}'
```

### Frontend (Vercel):
- [ ] All pages load
- [ ] Images display
- [ ] Styles applied
- [ ] JavaScript works
- [ ] API calls successful
- [ ] Admin panel accessible

---

## 🔄 Continuous Deployment

### Automatic Deployments:

**Frontend (Vercel):**
- Push to `main` branch → Auto-deploys to Vercel
- Preview deployments for pull requests

**Backend (Render):**
- Push to `main` branch → Auto-deploys to Render
- Can configure manual deploy if preferred

### Deployment Workflow:

```bash
# Make changes locally
git add .
git commit -m "Your changes"
git push origin main

# Vercel deploys frontend automatically
# Render deploys backend automatically
# Wait 2-5 minutes
# Changes are live!
```

---

## 💰 Pricing

### Free Tier Limits:

**Vercel (Frontend):**
- ✅ Unlimited deployments
- ✅ 100 GB bandwidth/month
- ✅ Automatic HTTPS
- ✅ Custom domains
- ✅ Perfect for portfolio!

**Render (Backend):**
- ✅ 750 hours/month (enough for 1 service)
- ✅ Automatic HTTPS
- ✅ Custom domains
- ⚠️ Spins down after 15 min inactivity (free tier)
- ⚠️ Cold start: 30-60 seconds to wake up

**MongoDB Atlas:**
- ✅ 512 MB storage
- ✅ Shared RAM
- ✅ Perfect for portfolio!

### Upgrade Options:

**Render Paid ($7/month):**
- Always-on (no cold starts)
- Better performance
- More resources

**Vercel Pro ($20/month):**
- More bandwidth
- Better analytics
- Team features

---

## 🐛 Troubleshooting

### Issue: Frontend can't connect to backend

**Solution:**
1. Check CORS settings in Render
2. Verify API_BASE URLs in frontend
3. Check browser console for errors
4. Ensure backend is running (visit API URL)

### Issue: Backend cold start (Render free tier)

**Symptom:** First request takes 30-60 seconds

**Solutions:**
1. Upgrade to paid plan ($7/month)
2. Use a service like UptimeRobot to ping every 14 minutes
3. Accept the cold start (only affects first visitor)

### Issue: MongoDB connection error

**Solution:**
1. Check MONGODB_URI in Render environment variables
2. Verify MongoDB Atlas network access (0.0.0.0/0)
3. Check database user credentials
4. Test connection string locally

### Issue: Admin login fails

**Solution:**
1. Check ADMIN_USERNAME and ADMIN_PASSWORD in Render
2. Verify JWT_SECRET is set
3. Check browser console for errors
4. Try clearing cookies

### Issue: Images not uploading

**Solution:**
1. Render free tier has ephemeral storage
2. Uploaded files are lost on restart
3. Solutions:
   - Use Cloudinary for image hosting
   - Upgrade to Render paid plan with persistent disk
   - Use AWS S3 for storage

---

## 📊 Monitoring

### Render Dashboard:
- View logs: Dashboard → Your service → Logs
- Monitor metrics: CPU, Memory, Response time
- Check deployments: Deploy history

### Vercel Dashboard:
- View deployments: Dashboard → Your project → Deployments
- Analytics: View page views, performance
- Logs: Check function logs

### MongoDB Atlas:
- Monitor: Metrics tab
- View queries: Performance Advisor
- Check storage: Cluster overview

---

## 🔒 Security Best Practices

1. **Strong Passwords:**
   ```
   ADMIN_PASSWORD = Use-Strong-Password-123!@#
   JWT_SECRET = random-64-character-string-here
   SESSION_SECRET = another-random-64-character-string
   ```

2. **Environment Variables:**
   - Never commit .env to Git
   - Use Render/Vercel dashboards to set secrets
   - Rotate secrets periodically

3. **CORS:**
   - Only allow your frontend domain
   - Update when changing domains

4. **MongoDB:**
   - Use strong database password
   - Enable IP whitelist (after testing)
   - Regular backups

---

## 🚀 Quick Reference

### URLs After Deployment:

```
Frontend:  https://anindya-portfolio.vercel.app
Backend:   https://anindya-portfolio-api.onrender.com
Admin:     https://anindya-portfolio.vercel.app/admin.html
API:       https://anindya-portfolio-api.onrender.com/api
```

### Important Commands:

```bash
# Deploy frontend (automatic on push)
git push origin main

# View Render logs
# Go to: https://dashboard.render.com → Your service → Logs

# View Vercel logs
# Go to: https://vercel.com/dashboard → Your project → Deployments

# Test API
curl https://anindya-portfolio-api.onrender.com/api/projects
```

---

## ✅ Final Checklist

### Pre-Deployment:
- [ ] MongoDB Atlas cluster created
- [ ] Database user created
- [ ] Connection string saved
- [ ] GitHub repository created
- [ ] Code pushed to GitHub

### Backend (Render):
- [ ] Web service created
- [ ] Environment variables set
- [ ] Service deployed successfully
- [ ] API endpoints responding
- [ ] CORS configured

### Frontend (Vercel):
- [ ] API URLs updated in code
- [ ] vercel.json created
- [ ] .vercelignore created
- [ ] Changes committed and pushed
- [ ] Project imported to Vercel
- [ ] Deployed successfully

### Testing:
- [ ] All pages load
- [ ] Admin panel works
- [ ] Can login
- [ ] Can add content
- [ ] Content appears on pages
- [ ] Contact form works
- [ ] Mobile responsive

---

## 🎉 You're Live!

Your portfolio is now deployed with:
- ✅ Frontend on Vercel (fast, global CDN)
- ✅ Backend on Render (always-on API)
- ✅ Database on MongoDB Atlas (managed, secure)
- ✅ Automatic HTTPS everywhere
- ✅ Continuous deployment from Git
- ✅ Free tier for all services!

**Visit your live site:**
```
https://anindya-portfolio.vercel.app
```

**Congratulations! Your amazing portfolio is live! 🚀✨**

---

## 📞 Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **Render Docs**: https://render.com/docs
- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com
- **Your Documentation**: See other .md files in this project

---

**Pro Tip:** Bookmark your dashboards:
- Vercel: https://vercel.com/dashboard
- Render: https://dashboard.render.com
- MongoDB: https://cloud.mongodb.com
