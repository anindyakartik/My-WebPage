# 🎨 CMS Setup Guide - MongoDB Edition

Complete guide to set up your Content Management System with MongoDB.

## 📋 What You Need

1. **MongoDB** (Local or Cloud)
2. **Node.js** (v14 or higher)
3. **Admin Password** (you choose this)
4. **Email Account** (for contact form)

---

## 🚀 Quick Setup (10 Minutes)

### Step 1: Install Dependencies (2 min)

```bash
npm install
```

### Step 2: Setup MongoDB (3 min)

Choose **Option A** (easiest) or **Option B** (local):

#### Option A: MongoDB Atlas (Free Cloud - Recommended)

1. **Sign up for MongoDB Atlas**
   - Go to: https://www.mongodb.com/cloud/atlas/register
   - Create a free account

2. **Create a Free Cluster**
   - Click "Build a Database"
   - Choose "FREE" tier (M0 Sandbox)
   - Select a cloud provider and region
   - Click "Create Cluster"

3. **Create Database User**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Username: `admin` (or your choice)
   - Password: Generate a strong password
   - User Privileges: "Atlas admin"
   - Click "Add User"

4. **Whitelist Your IP**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - It looks like: `mongodb+srv://username:<password>@cluster.mongodb.net/`

#### Option B: Local MongoDB

1. **Download MongoDB**
   - Go to: https://www.mongodb.com/try/download/community
   - Download for your OS
   - Install with default settings

2. **Start MongoDB**
   ```bash
   # Windows
   mongod
   
   # Mac (with Homebrew)
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   ```

3. **Connection String**
   ```
   mongodb://localhost:27017/anindya-portfolio
   ```

### Step 3: Configure Environment (2 min)

1. **Create .env file**
   ```bash
   cp .env.example .env
   ```

2. **Edit .env with your details**
   ```env
   # MongoDB (choose one)
   # For Atlas:
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/anindya-portfolio
   
   # For Local:
   MONGODB_URI=mongodb://localhost:27017/anindya-portfolio
   
   # Admin Credentials (CHANGE THESE!)
   ADMIN_USERNAME=admin
   ADMIN_EMAIL=your-email@gmail.com
   ADMIN_PASSWORD=YourStrongPassword123!
   
   # JWT Secrets (generate random strings)
   JWT_SECRET=your-random-jwt-secret-here
   SESSION_SECRET=your-random-session-secret-here
   
   # Email (for contact form)
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-gmail-app-password
   RECIPIENT_EMAIL=your-email@gmail.com
   ```

3. **Generate Secure Secrets**
   ```bash
   # Run this to generate random secrets
   node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
   node -e "console.log('SESSION_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
   ```

### Step 4: Start the Server (1 min)

```bash
npm start
```

You should see:
```
✅ MongoDB connected successfully
✅ Admin user created
   Username: admin
   Password: YourStrongPassword123!
   ⚠️  CHANGE THIS PASSWORD IMMEDIATELY!

🚀 CMS Server Running Successfully!
   📍 Port: 3000
   🌐 URL: http://localhost:3000
   🗄️  Database: MongoDB
   
   Admin Panel: http://localhost:3000/admin.html
```

### Step 5: Login to Admin Panel (1 min)

1. Open: http://localhost:3000/admin.html
2. Enter your admin credentials
3. Start managing content!

---

## 🎯 What You Can Do

### As Admin (You):
✅ Upload projects
✅ Write and publish poems
✅ Add book reviews
✅ Create blog posts
✅ Edit/delete any content
✅ Toggle published status
✅ View statistics

### As Visitor (Everyone Else):
✅ View all published content
✅ Read poems and blog posts
✅ See project portfolio
✅ Browse book reviews
✅ Send contact messages
✅ Send anonymous letters
❌ Cannot edit or delete anything
❌ Cannot access admin panel

---

## 📊 Content Types

### 1. Projects
- Title, description
- Technologies used
- Live URL, GitHub URL
- Project image
- Status (completed/in-progress/planned)
- Featured flag

### 2. Poems
- Title, content
- Excerpt (auto-generated)
- Tags
- Mood (melancholic, joyful, etc.)
- Featured flag

### 3. Book Reviews
- Book title, author
- Your review
- Rating (1-5 stars)
- Cover image
- Genre tags
- Reading status
- Personal notes

### 4. Blog Posts
- Title, content
- Cover image
- Category (tech, life, poetry, etc.)
- Tags
- Read time (auto-calculated)
- Featured flag

---

## 🔒 Security Features

- **Password Hashing**: Bcrypt with salt
- **JWT Authentication**: Secure token-based auth
- **Session Management**: HTTP-only cookies
- **Rate Limiting**: Prevents brute force attacks
- **Account Locking**: After 5 failed login attempts
- **Input Validation**: All inputs sanitized
- **CORS Protection**: Configurable origins

---

## 🛠️ Admin Panel Features

### Dashboard
- Quick stats overview
- Recent content
- Quick actions

### Content Management
- Create, edit, delete
- Publish/unpublish toggle
- Drag-and-drop image upload
- Rich text editing
- Preview before publishing

### Statistics
- View counts per content
- Like counts
- Popular content

---

## 📁 Project Structure

```
.
├── models/
│   ├── Admin.js          # Admin user model
│   ├── Project.js        # Project model
│   ├── Poem.js           # Poem model
│   ├── Book.js           # Book review model
│   └── BlogPost.js       # Blog post model
├── uploads/              # Uploaded images
├── cms-server.js         # Main server file
├── admin.html            # Admin panel
├── admin-script.js       # Admin panel JS
├── admin-style.css       # Admin panel styles
├── .env                  # Your configuration
└── package.json          # Dependencies
```

---

## 🧪 Testing

### Test MongoDB Connection
```bash
# If using local MongoDB
mongo
> show dbs
> use anindya-portfolio
> show collections
```

### Test Admin Login
1. Go to: http://localhost:3000/admin.html
2. Login with your credentials
3. Should see admin dashboard

### Test API Endpoints
```bash
# Get all projects (public)
curl http://localhost:3000/api/projects

# Login (get token)
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"YourPassword"}'
```

---

## 🐛 Troubleshooting

### MongoDB Connection Failed

**Error**: `MongoNetworkError: failed to connect`

**Solutions**:
- Check MongoDB is running: `mongod --version`
- Verify connection string in .env
- For Atlas: Check IP whitelist
- For Atlas: Verify username/password
- Check firewall settings

### Admin Login Failed

**Error**: `Invalid credentials`

**Solutions**:
- Check username/password in .env
- Look at server console for created admin credentials
- Try resetting: Delete admin from database and restart server

### Images Not Uploading

**Error**: `File upload failed`

**Solutions**:
- Check `uploads/` folder exists
- Verify file size < 5MB
- Check file type (only images allowed)
- Check disk space

### Port Already in Use

**Error**: `EADDRINUSE: address already in use`

**Solutions**:
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use different port in .env
PORT=3001
```

---

## 🚀 Next Steps

### 1. Change Default Password
```bash
# Login to admin panel
# Go to Settings → Change Password
```

### 2. Add Your First Content
- Create a project
- Write a poem
- Add a book review
- Publish a blog post

### 3. Customize
- Update colors in `admin-style.css`
- Modify content fields in models
- Add new content types

### 4. Deploy to Production
See `DEPLOYMENT.md` for:
- MongoDB Atlas setup
- Heroku deployment
- Environment variables
- Domain configuration

---

## 📚 API Documentation

### Public Endpoints (No Auth Required)

```
GET  /api/projects          # Get all published projects
GET  /api/projects/:slug    # Get single project
GET  /api/poems             # Get all published poems
GET  /api/poems/:slug       # Get single poem
GET  /api/books             # Get all published books
GET  /api/books/:slug       # Get single book
GET  /api/blog              # Get all published posts
GET  /api/blog/:slug        # Get single post
```

### Admin Endpoints (Auth Required)

```
POST /api/admin/login       # Login
POST /api/admin/logout      # Logout
GET  /api/admin/verify      # Verify token

GET  /api/admin/projects    # Get all projects (including unpublished)
POST /api/admin/projects    # Create project
PUT  /api/admin/projects/:id # Update project
DELETE /api/admin/projects/:id # Delete project

# Similar routes for poems, books, blog
```

---

## 💡 Pro Tips

1. **Backup Your Database**
   ```bash
   mongodump --uri="your-mongodb-uri" --out=./backup
   ```

2. **Use Strong Passwords**
   - At least 12 characters
   - Mix of letters, numbers, symbols
   - Don't reuse passwords

3. **Regular Updates**
   ```bash
   npm update
   npm audit fix
   ```

4. **Monitor Your Database**
   - Check MongoDB Atlas dashboard
   - Set up alerts for storage limits
   - Monitor query performance

5. **Content Strategy**
   - Use featured flag for homepage
   - Add tags for better organization
   - Write good excerpts for SEO
   - Optimize images before upload

---

## 🆘 Need Help?

1. Check server console for errors
2. Verify all environment variables
3. Test MongoDB connection
4. Check file permissions
5. Review API responses

---

## 🎉 You're Ready!

Your CMS is now fully functional with MongoDB!

**What's Working:**
✅ MongoDB database
✅ Admin authentication
✅ Content management
✅ Image uploads
✅ Public API
✅ Security features

**Start Creating:**
1. Login to admin panel
2. Add your first project
3. Write a poem
4. Share your work!

---

Built with ❤️ by Anindya Kartik
