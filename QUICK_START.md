# 🚀 Quick Start Guide

## Your Website is Ready!

All navbar pages are now **separate and fully functional**. Here's how to get started:

---

## 📋 Prerequisites

Make sure you have:
- ✅ Node.js installed
- ✅ MongoDB installed and running
- ✅ All dependencies installed (`npm install`)

---

## 🎯 Start the Website

### Step 1: Start MongoDB
```bash
# If MongoDB is not running, start it:
mongod
# Or on macOS with Homebrew:
brew services start mongodb-community
```

### Step 2: Configure Environment
```bash
# Copy the example env file
cp .env.example .env

# Edit .env and add your settings:
# - MONGODB_URI
# - ADMIN_USERNAME
# - ADMIN_PASSWORD
# - JWT_SECRET
# - EMAIL credentials (for contact form)
```

### Step 3: Start the CMS Server
```bash
node cms-server.js
```

You should see:
```
✅ MongoDB connected successfully
✅ Admin user created
🚀 CMS Server Running Successfully!
📍 Port: 3000
```

### Step 4: Open the Website
Open your browser and navigate to:
- **Home**: `http://localhost:3000/index.html`
- **Work**: `http://localhost:3000/work.html`
- **Musings**: `http://localhost:3000/musings.html`
- **Shelf**: `http://localhost:3000/shelf.html`
- **Now**: `http://localhost:3000/now.html`
- **Contact**: `http://localhost:3000/contact.html`
- **Admin Panel**: `http://localhost:3000/admin.html`

---

## 📝 Add Content

### Step 1: Login to Admin Panel
1. Go to `http://localhost:3000/admin.html`
2. Login with credentials from `.env`:
   - Username: `admin` (or your custom username)
   - Password: From `ADMIN_PASSWORD` in `.env`

### Step 2: Add Content
Click on the tabs to add:
- **Projects** → Appears on Work page
- **Poems** → Appears on Musings page
- **Books** → Appears on Shelf page
- **Blog Posts** → For future blog functionality

### Step 3: View on Website
- Content appears **immediately** on the respective pages
- Refresh the page to see new content
- Use filters to organize content

---

## 🎨 Page Overview

### 🏠 Home (index.html)
- **Purpose**: Dashboard with previews
- **Shows**: Hero, preview sections, CTAs
- **Links to**: All other pages

### 💼 Work (work.html)
- **Purpose**: Full projects showcase
- **Features**: Dynamic loading, filtering (All/Web/Mobile/Design)
- **Content from**: MongoDB Projects collection

### ✍️ Musings (musings.html)
- **Purpose**: Poetry and writings
- **Features**: Dynamic loading, mood filtering
- **Content from**: MongoDB Poems collection

### 📚 Shelf (shelf.html)
- **Purpose**: Book reviews
- **Features**: Dynamic loading, status filtering, modal reviews
- **Content from**: MongoDB Books collection

### ⚡ Now (now.html)
- **Purpose**: Current activities
- **Features**: Living document of current focus
- **Content**: Static (can be made dynamic later)

### 📧 Contact (contact.html)
- **Purpose**: Contact form + anonymous letters
- **Features**: Email sending, anonymous messaging
- **Backend**: Nodemailer integration

---

## 🔧 Troubleshooting

### MongoDB Connection Error
```bash
# Check if MongoDB is running
ps aux | grep mongod

# Start MongoDB
mongod
```

### Port Already in Use
```bash
# Change PORT in .env or kill the process
lsof -ti:3000 | xargs kill -9
```

### Content Not Loading
1. Check browser console for errors
2. Verify CMS server is running
3. Check MongoDB connection
4. Ensure content is published in admin panel

### Admin Login Not Working
1. Check `.env` credentials
2. Look for admin creation message in server logs
3. Reset password via MongoDB if needed

---

## 🎯 Testing the Pages

### Test Work Page:
1. Add a project in admin panel
2. Set it as "Published"
3. Go to `work.html`
4. See your project appear
5. Try filtering by type

### Test Musings Page:
1. Add a poem in admin panel
2. Set mood/tag
3. Go to `musings.html`
4. See your poem appear
5. Try mood filters

### Test Shelf Page:
1. Add a book review in admin panel
2. Upload cover image (optional)
3. Set reading status
4. Go to `shelf.html`
5. See your book appear
6. Click "Read Full Review" for modal

---

## 📱 Mobile Testing

Open on mobile or resize browser:
- All pages are fully responsive
- Navigation adapts to mobile
- Grids become single column
- Touch-friendly interactions

---

## 🎨 Customization

### Update Content on Now Page:
Edit `now.html` directly to update your current activities.

### Change Colors:
Edit CSS variables in `style.css`:
```css
:root {
  --fire: #ff3b3b;  /* Primary accent */
  --gold: #fbbf24;  /* Secondary accent */
  /* etc. */
}
```

### Add More Filters:
Edit the respective JavaScript files in `pages/` directory.

---

## 🚀 Deployment

When ready to deploy:

1. **Update Environment Variables** for production
2. **Set MongoDB URI** to production database
3. **Configure Email** for contact form
4. **Deploy Backend** (Node.js server)
5. **Deploy Frontend** (HTML/CSS/JS files)
6. **Update API URLs** in JavaScript files

---

## 📚 Documentation

For more details, see:
- `CMS_SETUP.md` - CMS configuration
- `HOW_TO_ADD_CONTENT.md` - Content management
- `SEPARATE_PAGES_COMPLETE.md` - Architecture overview
- `FEATURES.md` - Feature list

---

## ✨ You're All Set!

Your website now has:
- ✅ Separate pages for all navbar items
- ✅ Dynamic content from MongoDB
- ✅ Beautiful, responsive design
- ✅ Interactive filtering
- ✅ Smooth animations
- ✅ Admin panel for content management

**Enjoy your amazing, iconic, 10/10 website! 🎉**
