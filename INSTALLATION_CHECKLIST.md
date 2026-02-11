# ✅ Installation Checklist

## Current Status: **READY TO INSTALL**

All code is complete! Follow these steps to get everything working.

---

## 📦 Step 1: Install Dependencies

```bash
npm install
```

**What this installs:**
- Express (web server)
- Mongoose (MongoDB)
- Bcryptjs (password hashing)
- JWT (authentication)
- Nodemailer (emails)
- Multer (file uploads)
- And more...

**Expected output:**
```
added 150+ packages
```

---

## 🗄️ Step 2: Setup MongoDB

### Option A: MongoDB Atlas (Recommended)

1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Create free account
3. Create free cluster (M0 Sandbox)
4. Create database user
5. Whitelist IP (0.0.0.0/0 for development)
6. Get connection string

**Your connection string will look like:**
```
mongodb+srv://username:password@cluster.mongodb.net/anindya-portfolio
```

### Option B: Local MongoDB

```bash
# Install MongoDB
# Mac:
brew install mongodb-community

# Ubuntu:
sudo apt-get install mongodb

# Windows:
# Download from mongodb.com

# Start MongoDB
mongod
```

---

## ⚙️ Step 3: Configure Environment

1. **Copy example file:**
```bash
cp .env.example .env
```

2. **Edit .env file with your details:**

```env
# MongoDB
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/anindya-portfolio

# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_EMAIL=anindyakartik@gmail.com
ADMIN_PASSWORD=YourStrongPassword123!

# Generate these secrets
JWT_SECRET=run-command-below-to-generate
SESSION_SECRET=run-command-below-to-generate

# Email (for contact form)
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password
RECIPIENT_EMAIL=anindyakartik@gmail.com
```

3. **Generate secure secrets:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Copy output to JWT_SECRET

node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Copy output to SESSION_SECRET
```

4. **Get Gmail App Password:**
   - Enable 2FA: https://myaccount.google.com/security
   - Generate App Password: https://myaccount.google.com/apppasswords
   - Copy 16-character password to SMTP_PASS

---

## 🚀 Step 4: Start the Server

```bash
npm start
```

**Expected output:**
```
✅ MongoDB connected successfully
✅ Admin user created
   Username: admin
   Password: YourStrongPassword123!

╔════════════════════════════════════════════════════╗
║   🚀 CMS Server Running Successfully!              ║
║   📍 Port: 3000                                    ║
║   🌐 URL: http://localhost:3000                   ║
║   🗄️  Database: MongoDB                            ║
║   Admin Panel: http://localhost:3000/admin.html   ║
╚════════════════════════════════════════════════════╝
```

---

## 🧪 Step 5: Test Everything

### Test 1: Check Server
```bash
curl http://localhost:3000/api/health
```
**Expected:** `{"success":true,"message":"Server is running"}`

### Test 2: Login to Admin Panel
1. Open: http://localhost:3000/admin.html
2. Enter your admin password
3. Should see dashboard

### Test 3: Create Content
1. Click "Add Project"
2. Fill in details
3. Click "Save"
4. Should see project in list

### Test 4: View Public Content
```bash
curl http://localhost:3000/api/projects
```
**Expected:** JSON array with your projects

### Test 5: Contact Form
1. Open: http://localhost:3000/contact.html
2. Fill out form
3. Submit
4. Check your email

---

## ✅ Verification Checklist

- [ ] Dependencies installed (`npm install` completed)
- [ ] MongoDB connected (see "✅ MongoDB connected" in console)
- [ ] .env file created and configured
- [ ] Admin user created (see credentials in console)
- [ ] Server running on port 3000
- [ ] Can access http://localhost:3000
- [ ] Can login to admin panel
- [ ] Can create/edit/delete content
- [ ] Can view content on public pages
- [ ] Contact form sends emails
- [ ] Anonymous letter works

---

## 🎯 What's Working Now

### Admin Panel (You Only)
✅ Login with password
✅ Create projects
✅ Write poems
✅ Add book reviews
✅ Publish blog posts
✅ Edit any content
✅ Delete content
✅ Toggle published status
✅ View statistics
✅ Upload images

### Public Pages (Everyone)
✅ View published projects
✅ Read published poems
✅ See book reviews
✅ Read blog posts
✅ Send contact messages
✅ Send anonymous letters
❌ Cannot edit anything
❌ Cannot access admin panel

---

## 🐛 Common Issues & Solutions

### Issue: "Cannot connect to MongoDB"
**Solution:**
- Check MONGODB_URI in .env
- Verify MongoDB is running
- For Atlas: Check IP whitelist
- For Atlas: Verify username/password

### Issue: "Admin login failed"
**Solution:**
- Check ADMIN_PASSWORD in .env
- Look at server console for created credentials
- Password is case-sensitive

### Issue: "Port 3000 already in use"
**Solution:**
```bash
# Find process
lsof -i :3000

# Kill it
kill -9 <PID>

# Or use different port
PORT=3001 npm start
```

### Issue: "Emails not sending"
**Solution:**
- Check SMTP_USER and SMTP_PASS in .env
- Verify you're using App Password, not regular password
- Check spam folder
- Enable "Less secure apps" if needed

### Issue: "Cannot upload images"
**Solution:**
- Check `uploads/` folder exists
- Verify file size < 5MB
- Only images allowed (jpg, png, gif, webp)

---

## 📁 File Structure

```
✅ models/
   ✅ Admin.js          # Admin user model
   ✅ Project.js        # Project model
   ✅ Poem.js           # Poem model
   ✅ Book.js           # Book model
   ✅ BlogPost.js       # Blog post model

✅ cms-server.js        # Main CMS server
✅ server.js            # Contact form server
✅ admin.html           # Admin panel
✅ admin-script.js      # Admin JS
✅ admin-style.css      # Admin styles
✅ contact.html         # Contact page
✅ index.html           # Homepage
✅ script.js            # Frontend JS
✅ style.css            # Frontend styles

✅ .env.example         # Environment template
✅ package.json         # Dependencies
✅ CMS_SETUP.md         # Setup guide
✅ WHAT_I_NEED_FROM_YOU.md  # Requirements
```

---

## 🚀 Next Steps After Installation

1. **Change Default Password**
   - Login to admin panel
   - Go to settings
   - Change password

2. **Add Your Content**
   - Create your first project
   - Write a poem
   - Add a book review
   - Publish a blog post

3. **Customize**
   - Update colors in CSS
   - Modify content fields
   - Add your branding

4. **Deploy**
   - See DEPLOYMENT.md
   - Setup production database
   - Configure domain

---

## 💡 Pro Tips

1. **Use Strong Passwords**
   - At least 12 characters
   - Mix of letters, numbers, symbols

2. **Backup Your Database**
   ```bash
   mongodump --uri="your-uri" --out=./backup
   ```

3. **Monitor Your Server**
   - Check logs regularly
   - Monitor database size
   - Watch for errors

4. **Keep Updated**
   ```bash
   npm update
   npm audit fix
   ```

---

## 🎉 You're All Set!

If all checkboxes above are checked, your CMS is fully functional!

**Start creating:**
1. Login: http://localhost:3000/admin.html
2. Add content
3. Publish
4. Share!

---

**Need help?** Check:
- CMS_SETUP.md (detailed setup)
- WHAT_I_NEED_FROM_YOU.md (requirements)
- Server console (error messages)
- MongoDB logs (connection issues)

---

Built with ❤️ by Anindya Kartik
