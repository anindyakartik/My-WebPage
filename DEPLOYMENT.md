# 🚀 Deployment Guide

Deploy your contact form backend to production in minutes!

## Option 1: Heroku (Recommended for Beginners)

### Prerequisites
- Heroku account (free tier available)
- Heroku CLI installed

### Steps

1. **Login to Heroku**
```bash
heroku login
```

2. **Create a new app**
```bash
heroku create your-portfolio-backend
```

3. **Set environment variables**
```bash
heroku config:set SMTP_HOST=smtp.gmail.com
heroku config:set SMTP_PORT=587
heroku config:set SMTP_USER=your-email@gmail.com
heroku config:set SMTP_PASS=your-app-password
heroku config:set RECIPIENT_EMAIL=your-email@gmail.com
heroku config:set NODE_ENV=production
heroku config:set ALLOWED_ORIGINS=https://yourdomain.com
```

4. **Deploy**
```bash
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

5. **Open your app**
```bash
heroku open
```

Your API will be available at: `https://your-portfolio-backend.herokuapp.com`

---

## Option 2: Railway (Modern & Easy)

### Steps

1. **Go to Railway.app**
   - Visit https://railway.app
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Add Environment Variables**
   - Go to Variables tab
   - Add all variables from your `.env` file

4. **Deploy**
   - Railway automatically deploys on push
   - Get your URL from the Deployments tab

---

## Option 3: Vercel (Serverless)

### Steps

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Create vercel.json**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
```

3. **Deploy**
```bash
vercel
```

4. **Set Environment Variables**
```bash
vercel env add SMTP_USER
vercel env add SMTP_PASS
vercel env add RECIPIENT_EMAIL
```

---

## Option 4: DigitalOcean App Platform

### Steps

1. **Create App**
   - Go to DigitalOcean App Platform
   - Connect your GitHub repository

2. **Configure**
   - Select Node.js environment
   - Set build command: `npm install`
   - Set run command: `npm start`

3. **Add Environment Variables**
   - Add all variables from `.env`

4. **Deploy**
   - Click "Create Resources"

---

## Option 5: AWS EC2 (Advanced)

### Steps

1. **Launch EC2 Instance**
   - Choose Ubuntu Server
   - Configure security groups (allow port 80, 443, 3000)

2. **SSH into instance**
```bash
ssh -i your-key.pem ubuntu@your-instance-ip
```

3. **Install Node.js**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

4. **Clone and setup**
```bash
git clone your-repo
cd your-repo
npm install
```

5. **Create .env file**
```bash
nano .env
# Add your environment variables
```

6. **Install PM2**
```bash
sudo npm install -g pm2
pm2 start server.js
pm2 startup
pm2 save
```

7. **Setup Nginx (optional)**
```bash
sudo apt install nginx
# Configure reverse proxy
```

---

## Post-Deployment Checklist

### 1. Update Frontend URLs

In your `contact.html` and `script.js`, update API endpoints:

```javascript
// Change from:
const response = await fetch('/api/contact', {

// To:
const response = await fetch('https://your-backend-url.com/api/contact', {
```

### 2. Update CORS Origins

Update your `.env` or environment variables:
```env
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### 3. Test Endpoints

```bash
# Health check
curl https://your-backend-url.com/api/health

# Contact form
curl -X POST https://your-backend-url.com/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","message":"Test message"}'
```

### 4. Monitor Logs

- **Heroku**: `heroku logs --tail`
- **Railway**: Check Deployments tab
- **Vercel**: Check Functions tab
- **PM2**: `pm2 logs`

### 5. Setup Custom Domain (Optional)

Most platforms support custom domains:
- Add your domain in platform settings
- Update DNS records (CNAME or A record)
- Enable SSL/HTTPS

---

## Environment Variables Reference

Required for all deployments:

```env
# Server
PORT=3000
NODE_ENV=production

# SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Email
RECIPIENT_EMAIL=your-email@gmail.com

# Security
ALLOWED_ORIGINS=https://yourdomain.com
```

---

## Troubleshooting

### Emails not sending in production

1. Check SMTP credentials are correct
2. Verify firewall allows outbound SMTP
3. Some hosts block port 587 - try port 465
4. Check email provider's sending limits

### CORS errors

1. Add your production domain to ALLOWED_ORIGINS
2. Include both www and non-www versions
3. Restart server after changing environment variables

### 502 Bad Gateway

1. Check server is running: `pm2 status`
2. Verify port configuration
3. Check application logs for errors

### Rate limiting too strict

Adjust in `server.js`:
```javascript
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // Increase from 5 to 10
});
```

---

## Security Best Practices

1. **Never commit .env file**
   - Already in .gitignore
   - Use platform's environment variables

2. **Use HTTPS only**
   - Most platforms provide free SSL
   - Redirect HTTP to HTTPS

3. **Keep dependencies updated**
```bash
npm audit
npm update
```

4. **Monitor rate limits**
   - Check for abuse
   - Adjust limits as needed

5. **Backup environment variables**
   - Keep secure copy of all variables
   - Document any custom configurations

---

## Cost Estimates

- **Heroku**: Free tier available, $7/month for hobby
- **Railway**: $5/month with free trial
- **Vercel**: Free for personal projects
- **DigitalOcean**: $5/month for basic droplet
- **AWS EC2**: ~$5-10/month for t2.micro

---

## Next Steps After Deployment

1. ✅ Test all endpoints
2. ✅ Send test emails
3. ✅ Update frontend with production URLs
4. ✅ Setup monitoring/alerts
5. ✅ Configure custom domain
6. ✅ Enable HTTPS
7. ✅ Share your awesome contact form!

---

Need help? Check the main README.md or create an issue on GitHub!
