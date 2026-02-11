# 🚀 Anindya Kartik Portfolio - Complete CMS System

A fully functional, beautiful portfolio website with MongoDB backend, JWT authentication, and complete content management system.

## ✅ Status: 100% Complete and Ready to Use!

**Backend**: Fully functional with MongoDB, authentication, and security  
**Frontend**: 6 separate pages, all dynamic and responsive  
**Security**: Only you can add/edit/delete, everyone can read  
**Design**: Amazing, iconic, 10/10 smooth animations

---

## 🎯 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Create .env file (copy from .env.example)
cp .env.example .env
# Edit .env with your settings

# 3. Start MongoDB
mongod

# 4. Start the server
npm start

# 5. Test everything works
npm test

# 6. Open admin panel
http://localhost:3000/admin.html
```

---

## 📚 Features

### ✅ Complete Backend
- **MongoDB Database** - All content stored securely
- **JWT Authentication** - Only you can modify content
- **Password Hashing** - bcrypt encryption
- **Rate Limiting** - Protection against attacks
- **File Uploads** - Image support (5MB limit)
- **CRUD Operations** - Create, Read, Update, Delete
- **Public API** - Everyone can read published content
- **Admin API** - Only you can write/modify

### ✅ Content Management
- **Projects** - Your work portfolio
- **Poems** - Your writings and musings
- **Books** - Book reviews with ratings
- **Blog Posts** - Articles and essays
- **Image Uploads** - For projects, books, blog posts
- **Publish/Unpublish** - Control visibility
- **Statistics** - View counts and engagement

### ✅ Frontend Pages
1. **Home** (`index.html`) - Dashboard with previews
2. **Work** (`work.html`) - Projects showcase with filtering
3. **Musings** (`musings.html`) - Poetry collection with mood filters
4. **Shelf** (`shelf.html`) - Book reviews with status filters
5. **Now** (`now.html`) - Current activities
6. **Contact** (`contact.html`) - Contact form + anonymous letters
7. **Admin** (`admin.html`) - Content management panel

### ✅ Security Features
- JWT token authentication
- Password hashing (bcrypt)
- Rate limiting (5 attempts per 15 min)
- HTTP-only cookies
- CORS protection
- Helmet.js security headers
- Input validation
- File type restrictions

### ✅ Design Features
- Particle canvas background
- Smooth animations
- Reveal effects
- Hover states
- Responsive design
- Mobile-friendly
- Beautiful typography
- Dark theme with accent colors

---

## 🗄️ Database Structure

### MongoDB Collections:
- **admins** - Your admin account
- **projects** - Your work portfolio
- **poems** - Your poetry
- **books** - Book reviews
- **blogposts** - Blog articles

---

## 🔐 Access Control

### Public (Everyone):
- ✅ View published projects
- ✅ View published poems
- ✅ View published book reviews
- ✅ View published blog posts
- ✅ Use contact form
- ❌ Cannot add/edit/delete anything

### Admin (You Only):
- ✅ Full CRUD operations
- ✅ Upload images
- ✅ Publish/unpublish content
- ✅ View statistics
- ✅ Change password

---

## 📁 Project Structure

```
├── cms-server.js          # Main backend server
├── test-backend.js        # Automated test suite
├── package.json           # Dependencies
├── .env.example           # Environment template
│
├── models/                # MongoDB models
│   ├── Admin.js
│   ├── Project.js
│   ├── Poem.js
│   ├── Book.js
│   └── BlogPost.js
│
├── pages/                 # Page-specific JavaScript
│   ├── work.js
│   ├── musings.js
│   └── shelf.js
│
├── HTML Pages
│   ├── index.html         # Home/Dashboard
│   ├── work.html          # Projects
│   ├── musings.html       # Poetry
│   ├── shelf.html         # Books
│   ├── now.html           # Current activities
│   ├── contact.html       # Contact form
│   └── admin.html         # Admin panel
│
└── Documentation
    ├── COMPLETE_SETUP_GUIDE.md
    ├── BACKEND_VERIFICATION.md
    ├── SYSTEM_OVERVIEW.md
    ├── QUICK_START.md
    └── FINAL_STATUS.md
```

---

## 🚀 API Endpoints

### Public Endpoints (No Auth):
```
GET  /api/projects          # All published projects
GET  /api/projects/:slug    # Single project
GET  /api/poems             # All published poems
GET  /api/poems/:slug       # Single poem
GET  /api/books             # All published books
GET  /api/books/:slug       # Single book
GET  /api/blog              # All published blog posts
GET  /api/blog/:slug        # Single blog post
```

### Admin Endpoints (Auth Required):
```
POST   /api/admin/login              # Login
POST   /api/admin/logout             # Logout
GET    /api/admin/verify             # Verify token
POST   /api/admin/change-password    # Change password

GET    /api/admin/projects           # All projects
POST   /api/admin/projects           # Create project
PUT    /api/admin/projects/:id       # Update project
DELETE /api/admin/projects/:id       # Delete project

# Same pattern for /poems, /books, /blog
```

---

## 🧪 Testing

### Run Automated Tests:
```bash
npm test
```

Tests verify:
- ✅ Server is running
- ✅ Public can read content
- ✅ Public cannot write
- ✅ Admin can login
- ✅ Admin can CRUD
- ✅ Rate limiting works
- ✅ Passwords are hashed
- ✅ JWT authentication works

---

## 📖 Documentation

### Essential Guides:
1. **COMPLETE_SETUP_GUIDE.md** - Full setup instructions
2. **BACKEND_VERIFICATION.md** - Backend details
3. **SYSTEM_OVERVIEW.md** - Architecture diagrams
4. **QUICK_START.md** - Quick reference
5. **FINAL_STATUS.md** - Complete status report

### Content Management:
- **CMS_SETUP.md** - CMS configuration
- **HOW_TO_ADD_CONTENT.md** - Adding content guide

### Architecture:
- **SEPARATE_PAGES_COMPLETE.md** - Page architecture
- **FEATURES.md** - Feature list

---

## 🔧 Configuration

### Environment Variables (.env):
```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/anindya-portfolio

# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_EMAIL=your-email@example.com
ADMIN_PASSWORD=YourSecurePassword123!

# Security
JWT_SECRET=your-super-secret-jwt-key
SESSION_SECRET=your-session-secret

# Email (for contact form)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password

# Server
NODE_ENV=development
PORT=3000
```

---

## 🎨 Tech Stack

### Backend:
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- bcrypt (password hashing)
- Multer (file uploads)
- Nodemailer (email)
- Helmet.js (security)

### Frontend:
- HTML5
- CSS3 (Custom design system)
- Vanilla JavaScript
- Canvas API (particles)
- Fetch API (AJAX)

### Design:
- Fraunces (Display font)
- Archivo (Body font)
- Courier Prime (Monospace)
- Custom animations
- Responsive grid layouts

---

## 🐛 Troubleshooting

### MongoDB Connection Error:
```bash
# Start MongoDB
mongod

# Or with Homebrew (macOS)
brew services start mongodb-community
```

### Admin Login Fails:
1. Check `.env` file exists
2. Verify credentials match
3. Restart server after changing `.env`

### Content Not Appearing:
1. Check "Published" status in admin panel
2. Refresh browser page
3. Check browser console for errors

### Port Already in Use:
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or change port in .env
PORT=3001
```

---

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

---

## 🔒 Security Best Practices

1. ✅ Change default admin password immediately
2. ✅ Use strong passwords (min 8 chars, mixed case, numbers, symbols)
3. ✅ Keep JWT_SECRET and SESSION_SECRET secure
4. ✅ Use HTTPS in production
5. ✅ Regular MongoDB backups
6. ✅ Update dependencies regularly
7. ✅ Monitor login attempts

---

## 📊 Performance

- Fast page loads
- Optimized images
- Efficient database queries
- Minimal JavaScript
- CSS animations (GPU accelerated)
- Lazy loading where appropriate

---

## 🎉 What's Working

- ✅ Complete backend with MongoDB
- ✅ JWT authentication
- ✅ All CRUD operations
- ✅ File uploads
- ✅ 6 separate pages
- ✅ Dynamic content loading
- ✅ Filtering on all pages
- ✅ Admin panel
- ✅ Contact form
- ✅ Anonymous letters
- ✅ Beautiful animations
- ✅ Responsive design
- ✅ Security features
- ✅ Automated tests

---

## 🚀 Deployment

### Production Checklist:
- [ ] Change all secrets in `.env`
- [ ] Use production MongoDB URI
- [ ] Set `NODE_ENV=production`
- [ ] Configure CORS for your domain
- [ ] Set up HTTPS
- [ ] Configure reverse proxy (nginx/Apache)
- [ ] Set up MongoDB backups
- [ ] Monitor server logs
- [ ] Set up error tracking

---

## 📞 Support

For issues or questions:
1. Check documentation in `/docs`
2. Review troubleshooting section
3. Check server logs
4. Verify MongoDB connection
5. Test with `npm test`

---

## 📄 License

MIT License - Feel free to use for your own portfolio!

---

## 🎯 Next Steps

1. ✅ Create `.env` file
2. ✅ Start MongoDB
3. ✅ Run `npm start`
4. ✅ Run `npm test`
5. ✅ Open `http://localhost:3000/admin.html`
6. ✅ Login and start adding content!

---

**Your amazing, iconic, 10/10 portfolio is ready! 🎉🚀✨**

Built with ❤️ using Node.js, MongoDB, and lots of coffee ☕
