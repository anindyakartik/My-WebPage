# 🚀 DEPLOYMENT GUIDE - Production Ready

Complete guide to deploy your portfolio website to production.

---

## 📋 Pre-Deployment Checklist

Before deploying, ensure:

- [ ] All features tested locally
- [ ] MongoDB working locally
- [ ] Admin panel accessible
- [ ] Content added and displays correctly
- [ ] Contact form tested
- [ ] All environment variables documented
- [ ] Strong passwords set
- [ ] Security secrets generated

---

## 🎯 Recommended Deployment Options

### Option 1: Vercel + MongoDB Atlas (Easiest - Recommended)
**Best for**: Quick deployment, automatic scaling, free tier available  
**Cost**: Free for hobby projects, $20/month for pro

### Option 2: Railway + MongoDB Atlas
**Best for**: Simple deployment, good free tier  
**Cost**: Free tier available, pay-as-you-go

### Option 3: DigitalOcean + MongoDB Atlas
**Best for**: Full control, predictable pricing  
**Cost**: $6/month droplet + MongoDB Atlas free tier

### Option 4: Heroku + MongoDB Atlas
**Best for**: Easy deployment, good documentation  
**Cost**: $7/month for basic dyno

### Option 5: VPS (Self-Hosted)
**Best for**: Maximum control, custom setup  
**Cost**: Varies by provider

---

## 🌟 OPTION 1: Vercel + MongoDB Atlas (Recommended)

### Step 1: Prepare MongoDB Atlas

1. **Create MongoDB Atlas Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for free account
   - Create a new cluster (free M0 tier)

2. **Configure Database**
   ```
   - Cluster Name: anindya-portfolio
   - Region: Choose closest to your users
   - Tier: M0 Sandbox (Free)
   ```

3. **Create Database User**
   - Go to Database Access
   - Add New Database User
   - Username: `admin` (or your choice)
   - Password: Generate strong password
   - Database User Privileges: Read and write to any database

4. **Configure Network Access**
   - Go to Network Access
   - Add IP Address
   - Allow Access from Anywhere: `0.0.0.0/0`
   - (For production, restrict to your server IPs)

5. **Get Connection String**
   - Go to Database → Connect
   - Choose "Connect your application"
   - Copy connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/anindya-portfolio?retryWrites=true&w=majority
   ```

### Step 2: Prepare Your Code

1. **Update package.json**
   ```json
   {
     "scripts": {
       "start": "node cms-server.js",
       "build": "echo 'No build step required'"
     },
     "engines": {
       "node": "18.x"
     }
   }
   ```

2. **Create vercel.json**
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "cms-server.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/api/(.*)",
         "dest": "cms-server.js"
       },
       {
         "src": "/(.*)",
         "dest": "/$1"
       }
     ]
   }
   ```

3. **Update API URLs in Frontend**
   
   Create `config.js`:
   ```javascript
   const API_BASE = process.env.NODE_ENV === 'production' 
     ? 'https://your-domain.vercel.app/api'
     : 'http://localhost:3000/api';
   
   export default API_BASE;
   ```
   
   Update in `pages/work.js`, `pages/musings.js`, `pages/shelf.js`:
   ```javascript
   const API_BASE = window.location.hostname === 'localhost' 
     ? 'http://localhost:3000/api'
     : '/api';
   ```

### Step 3: Deploy to Vercel

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```
   
   Follow prompts:
   - Set up and deploy? Yes
   - Which scope? Your account
   - Link to existing project? No
   - Project name? anindya-portfolio
   - Directory? ./
   - Override settings? No

4. **Set Environment Variables**
   ```bash
   vercel env add MONGODB_URI
   # Paste your MongoDB Atlas connection string
   
   vercel env add ADMIN_USERNAME
   # Enter: admin
   
   vercel env add ADMIN_PASSWORD
   # Enter: YourStrongPassword123!
   
   vercel env add JWT_SECRET
   # Enter: random-64-character-string
   
   vercel env add SESSION_SECRET
   # Enter: another-random-64-character-string
   
   vercel env add EMAIL_USER
   # Enter: your-email@gmail.com
   
   vercel env add EMAIL_PASS
   # Enter: your-gmail-app-password
   
   vercel env add NODE_ENV
   # Enter: production
   ```

5. **Deploy to Production**
   ```bash
   vercel --prod
   ```

6. **Your site is live!**
   ```
   https://your-project.vercel.app
   ```

### Step 4: Configure Custom Domain (Optional)

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain (e.g., anindyakartik.com)
3. Update DNS records as instructed
4. SSL certificate automatically provisioned

---

## 🚂 OPTION 2: Railway + MongoDB Atlas

### Step 1: Setup MongoDB Atlas
(Same as Option 1, Step 1)

### Step 2: Deploy to Railway

1. **Create Railway Account**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Choose "Deploy from GitHub repo"
   - Connect your GitHub account
   - Select your repository

3. **Configure Environment Variables**
   - Go to Variables tab
   - Add all environment variables:
   ```
   MONGODB_URI=mongodb+srv://...
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=YourStrongPassword123!
   JWT_SECRET=random-64-character-string
   SESSION_SECRET=another-random-64-character-string
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-gmail-app-password
   NODE_ENV=production
   PORT=3000
   ```

4. **Deploy**
   - Railway automatically detects Node.js
   - Builds and deploys your app
   - Provides a URL: `https://your-app.railway.app`

5. **Custom Domain** (Optional)
   - Go to Settings → Domains
   - Add custom domain
   - Update DNS records

---

## 🌊 OPTION 3: DigitalOcean Droplet

### Step 1: Create Droplet

1. **Sign up at DigitalOcean**
   - Go to https://www.digitalocean.com
   - Create account

2. **Create Droplet**
   - Choose Ubuntu 22.04 LTS
   - Basic plan: $6/month
   - Choose datacenter region
   - Add SSH key
   - Create Droplet

### Step 2: Setup Server

1. **SSH into Server**
   ```bash
   ssh root@your-droplet-ip
   ```

2. **Update System**
   ```bash
   apt update && apt upgrade -y
   ```

3. **Install Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
   apt install -y nodejs
   ```

4. **Install MongoDB** (or use MongoDB Atlas)
   ```bash
   # For local MongoDB
   wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | apt-key add -
   echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-6.0.list
   apt update
   apt install -y mongodb-org
   systemctl start mongod
   systemctl enable mongod
   ```

5. **Install Nginx**
   ```bash
   apt install -y nginx
   ```

6. **Install PM2** (Process Manager)
   ```bash
   npm install -g pm2
   ```

### Step 3: Deploy Application

1. **Clone Repository**
   ```bash
   cd /var/www
   git clone https://github.com/yourusername/your-repo.git
   cd your-repo
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Create .env File**
   ```bash
   nano .env
   ```
   
   Add:
   ```env
   MONGODB_URI=mongodb://localhost:27017/anindya-portfolio
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=YourStrongPassword123!
   JWT_SECRET=random-64-character-string
   SESSION_SECRET=another-random-64-character-string
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-gmail-app-password
   NODE_ENV=production
   PORT=3000
   ```

4. **Start with PM2**
   ```bash
   pm2 start cms-server.js --name portfolio
   pm2 save
   pm2 startup
   ```

### Step 4: Configure Nginx

1. **Create Nginx Config**
   ```bash
   nano /etc/nginx/sites-available/portfolio
   ```
   
   Add:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com www.your-domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

2. **Enable Site**
   ```bash
   ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
   nginx -t
   systemctl restart nginx
   ```

### Step 5: Setup SSL (HTTPS)

1. **Install Certbot**
   ```bash
   apt install -y certbot python3-certbot-nginx
   ```

2. **Get SSL Certificate**
   ```bash
   certbot --nginx -d your-domain.com -d www.your-domain.com
   ```

3. **Auto-renewal**
   ```bash
   certbot renew --dry-run
   ```

---

## 🔧 Post-Deployment Configuration

### 1. Update CORS Settings

In `cms-server.js`:
```javascript
app.use(cors({
  origin: [
    'https://your-domain.com',
    'https://www.your-domain.com'
  ],
  credentials: true
}));
```

### 2. Update Cookie Settings

```javascript
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,  // HTTPS only
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: 'strict'
  }
}));
```

### 3. Update Email Configuration

For Gmail:
1. Enable 2-Factor Authentication
2. Generate App Password
3. Use App Password in EMAIL_PASS

### 4. Setup Monitoring

**Option A: PM2 Monitoring**
```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

**Option B: Use Monitoring Service**
- Sentry (error tracking)
- LogRocket (session replay)
- New Relic (performance)

---

## 🔒 Security Hardening

### 1. Firewall Setup (UFW)
```bash
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable
```

### 2. Fail2Ban (Brute Force Protection)
```bash
apt install -y fail2ban
systemctl enable fail2ban
systemctl start fail2ban
```

### 3. Regular Updates
```bash
# Create update script
nano /root/update.sh
```

Add:
```bash
#!/bin/bash
apt update
apt upgrade -y
apt autoremove -y
```

```bash
chmod +x /root/update.sh
crontab -e
# Add: 0 2 * * 0 /root/update.sh
```

### 4. MongoDB Security

If using local MongoDB:
```bash
# Enable authentication
mongo
use admin
db.createUser({
  user: "admin",
  pwd: "strong-password",
  roles: ["root"]
})
exit

# Edit MongoDB config
nano /etc/mongod.conf
```

Add:
```yaml
security:
  authorization: enabled
```

```bash
systemctl restart mongod
```

---

## 📊 Performance Optimization

### 1. Enable Gzip Compression

In Nginx config:
```nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;
```

### 2. Setup Caching

```nginx
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 3. Optimize Images

```bash
# Install ImageMagick
apt install -y imagemagick

# Optimize uploaded images
mogrify -strip -quality 85 uploads/*.jpg
```

### 4. Database Indexing

In MongoDB:
```javascript
// Add indexes for better performance
db.projects.createIndex({ slug: 1 })
db.projects.createIndex({ published: 1, publishedAt: -1 })
db.poems.createIndex({ slug: 1 })
db.books.createIndex({ slug: 1 })
```

---

## 🔄 Continuous Deployment

### Setup GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Deploy to Server
      uses: appleboy/ssh-action@master
      with:
        host: ${{ secrets.SERVER_IP }}
        username: root
        key: ${{ secrets.SSH_PRIVATE_KEY }}
        script: |
          cd /var/www/your-repo
          git pull origin main
          npm install
          pm2 restart portfolio
```

Add secrets in GitHub:
- `SERVER_IP`: Your server IP
- `SSH_PRIVATE_KEY`: Your SSH private key

---

## 🧪 Testing Production

### 1. Test All Endpoints
```bash
# Test public API
curl https://your-domain.com/api/projects

# Test admin login
curl -X POST https://your-domain.com/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"your-password"}'
```

### 2. Test Pages
- Visit all pages
- Test filtering
- Test admin panel
- Test contact form
- Test image uploads

### 3. Performance Testing
```bash
# Install Apache Bench
apt install -y apache2-utils

# Test performance
ab -n 1000 -c 10 https://your-domain.com/
```

---

## 📱 Mobile Testing

Test on:
- iOS Safari
- Android Chrome
- Different screen sizes
- Touch interactions
- Form submissions

---

## 🔍 SEO Optimization

### 1. Add Meta Tags

In each HTML file:
```html
<head>
  <meta name="description" content="Anindya Kartik - Full-stack developer, poet, and digital gardener">
  <meta name="keywords" content="portfolio, developer, poet, projects">
  <meta name="author" content="Anindya Kartik">
  
  <!-- Open Graph -->
  <meta property="og:title" content="Anindya Kartik Portfolio">
  <meta property="og:description" content="Building systems that feel human">
  <meta property="og:image" content="/og-image.jpg">
  <meta property="og:url" content="https://your-domain.com">
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Anindya Kartik Portfolio">
  <meta name="twitter:description" content="Building systems that feel human">
  <meta name="twitter:image" content="/twitter-image.jpg">
</head>
```

### 2. Create sitemap.xml
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://your-domain.com/</loc>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://your-domain.com/work.html</loc>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://your-domain.com/musings.html</loc>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://your-domain.com/shelf.html</loc>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://your-domain.com/now.html</loc>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://your-domain.com/contact.html</loc>
    <priority>0.7</priority>
  </url>
</urlset>
```

### 3. Create robots.txt
```
User-agent: *
Allow: /
Disallow: /admin.html
Disallow: /api/admin/

Sitemap: https://your-domain.com/sitemap.xml
```

---

## 💾 Backup Strategy

### 1. MongoDB Backup Script

Create `/root/backup-mongo.sh`:
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/mongodb"
mkdir -p $BACKUP_DIR

mongodump --out $BACKUP_DIR/$DATE

# Keep only last 7 days
find $BACKUP_DIR -type d -mtime +7 -exec rm -rf {} +

# Upload to cloud storage (optional)
# aws s3 sync $BACKUP_DIR s3://your-bucket/mongodb-backups/
```

```bash
chmod +x /root/backup-mongo.sh
crontab -e
# Add: 0 2 * * * /root/backup-mongo.sh
```

### 2. Code Backup
- Use Git (already done)
- Regular commits
- Push to GitHub/GitLab

### 3. Uploads Backup
```bash
# Backup uploads directory
tar -czf /backups/uploads-$(date +%Y%m%d).tar.gz /var/www/your-repo/uploads
```

---

## 📈 Analytics (Optional)

### Add Google Analytics

In all HTML files before `</head>`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

## ✅ Deployment Checklist

### Pre-Deployment:
- [ ] All features tested locally
- [ ] Environment variables documented
- [ ] Strong passwords generated
- [ ] MongoDB Atlas setup (or local MongoDB secured)
- [ ] Email configuration tested
- [ ] Domain purchased (if using custom domain)

### During Deployment:
- [ ] Code deployed to server
- [ ] Environment variables set
- [ ] Database connected
- [ ] SSL certificate installed
- [ ] Nginx configured
- [ ] PM2 running application

### Post-Deployment:
- [ ] All pages accessible
- [ ] Admin panel working
- [ ] Can login successfully
- [ ] Can add/edit/delete content
- [ ] Content appears on public pages
- [ ] Contact form sends emails
- [ ] Images upload successfully
- [ ] Mobile responsive
- [ ] HTTPS working
- [ ] Performance acceptable
- [ ] Backups configured
- [ ] Monitoring setup

---

## 🆘 Troubleshooting

### Issue: Site not loading
```bash
# Check if app is running
pm2 status

# Check logs
pm2 logs portfolio

# Restart app
pm2 restart portfolio
```

### Issue: Database connection error
```bash
# Check MongoDB status
systemctl status mongod

# Check connection string
echo $MONGODB_URI

# Test connection
mongo "your-connection-string"
```

### Issue: 502 Bad Gateway
```bash
# Check Nginx
nginx -t
systemctl status nginx

# Check app port
netstat -tulpn | grep 3000
```

### Issue: SSL certificate error
```bash
# Renew certificate
certbot renew

# Check certificate
certbot certificates
```

---

## 📞 Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Railway Docs**: https://docs.railway.app
- **DigitalOcean Tutorials**: https://www.digitalocean.com/community/tutorials
- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com
- **Nginx Docs**: https://nginx.org/en/docs/

---

## 🎉 You're Live!

Once deployed, your portfolio will be accessible at:
- **Vercel**: `https://your-project.vercel.app`
- **Railway**: `https://your-app.railway.app`
- **Custom Domain**: `https://your-domain.com`

**Congratulations! Your amazing portfolio is now live! 🚀✨**
