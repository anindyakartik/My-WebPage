/* ============================================================
   ANINDYA KARTIK — CMS SERVER WITH MONGODB
   Complete backend with authentication and content management
   ============================================================ */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Import models
const Admin = require('./models/Admin');
const Project = require('./models/Project');
const Poem = require('./models/Poem');
const Book = require('./models/Book');
const BlogPost = require('./models/BlogPost');

const app = express();
const PORT = process.env.PORT || 3000;

// Trust proxy for Render
app.set('trust proxy', 1);

// ================================================== //
// MONGODB CONNECTION                                 //
// ================================================== //

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB connected successfully');
  initializeAdmin();
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

// Initialize admin user if doesn't exist
async function initializeAdmin() {
  try {
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      const admin = new Admin({
        username: process.env.ADMIN_USERNAME || 'admin',
        email: process.env.ADMIN_EMAIL || 'admin@anindya.com',
        password: process.env.ADMIN_PASSWORD || 'ChangeMe123!'
      });
      await admin.save();
      console.log('✅ Admin user created');
      console.log(`   Username: ${admin.username}`);
      console.log(`   Password: ${process.env.ADMIN_PASSWORD || 'ChangeMe123!'}`);
      console.log('   ⚠️  CHANGE THIS PASSWORD IMMEDIATELY!');
    }
  } catch (error) {
    console.error('Error initializing admin:', error);
  }
}

// ================================================== //
// MIDDLEWARE                                         //
// ================================================== //

app.use(helmet());
app.use(cors({
  origin: function(origin, callback) {
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',').map(o => o.trim()) || ['*'];
    if (allowedOrigins.includes('*') || !origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-this',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Serve static files
app.use(express.static('.'));
app.use('/uploads', express.static('uploads'));

// Create uploads directory if it doesn't exist
if (!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads');
}

// ================================================== //
// FILE UPLOAD CONFIGURATION                          //
// ================================================== //

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// ================================================== //
// AUTHENTICATION MIDDLEWARE                          //
// ================================================== //

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.adminToken || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-jwt-secret');
    const admin = await Admin.findById(decoded.id);
    
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Admin not found' });
    }
    
    req.admin = admin;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

// ================================================== //
// RATE LIMITING                                      //
// ================================================== //

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'Too many login attempts, please try again later.' }
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests, please try again later.' }
});

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'Too many contact requests, please try again later.' }
});

// ================================================== //
// AUTHENTICATION ROUTES                              //
// ================================================== //

// Login
app.post('/api/admin/login', authLimiter, async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password required' });
    }
    
    const admin = await Admin.findOne({ username: username.toLowerCase() });
    
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    if (admin.isLocked()) {
      return res.status(423).json({ 
        success: false, 
        message: 'Account locked due to too many failed attempts. Try again later.' 
      });
    }
    
    const isMatch = await admin.comparePassword(password);
    
    if (!isMatch) {
      await admin.incLoginAttempts();
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    await admin.resetLoginAttempts();
    
    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      process.env.JWT_SECRET || 'your-jwt-secret',
      { expiresIn: '24h' }
    );
    
    res.cookie('adminToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000
    });
    
    res.json({
      success: true,
      message: 'Login successful',
      token,
      admin: {
        username: admin.username,
        email: admin.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Login failed' });
  }
});

// Logout
app.post('/api/admin/logout', (req, res) => {
  res.clearCookie('adminToken');
  res.json({ success: true, message: 'Logged out successfully' });
});

// Verify token
app.get('/api/admin/verify', authMiddleware, (req, res) => {
  res.json({
    success: true,
    admin: {
      username: req.admin.username,
      email: req.admin.email
    }
  });
});

// Change password
app.post('/api/admin/change-password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const isMatch = await req.admin.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }
    
    req.admin.password = newPassword;
    await req.admin.save();
    
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to change password' });
  }
});

// ================================================== //
// PROJECTS ROUTES                                    //
// ================================================== //

// Get all projects (public)
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await Project.find({ published: true })
      .sort({ publishedAt: -1 })
      .select('-__v');
    res.json({ success: true, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch projects' });
  }
});

// Get single project (public)
app.get('/api/projects/:slug', async (req, res) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug, published: true });
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    project.stats.views += 1;
    await project.save();
    res.json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch project' });
  }
});

// Get all projects (admin)
app.get('/api/admin/projects', authMiddleware, async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json({ success: true, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch projects' });
  }
});

// Create project (admin)
app.post('/api/admin/projects', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const projectData = { ...req.body };
    if (req.file) {
      projectData.imageUrl = `/uploads/${req.file.filename}`;
    }
    if (projectData.technologies && typeof projectData.technologies === 'string') {
      projectData.technologies = projectData.technologies.split(',').map(t => t.trim());
    }
    
    const project = new Project(projectData);
    await project.save();
    res.json({ success: true, message: 'Project created successfully', data: project });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to create project' });
  }
});

// Update project (admin)
app.put('/api/admin/projects/:id', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const projectData = { ...req.body };
    if (req.file) {
      projectData.imageUrl = `/uploads/${req.file.filename}`;
    }
    if (projectData.technologies && typeof projectData.technologies === 'string') {
      projectData.technologies = projectData.technologies.split(',').map(t => t.trim());
    }
    
    const project = await Project.findByIdAndUpdate(req.params.id, projectData, { new: true, runValidators: true });
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    res.json({ success: true, message: 'Project updated successfully', data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to update project' });
  }
});

// Delete project (admin)
app.delete('/api/admin/projects/:id', authMiddleware, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete project' });
  }
});

// ================================================== //
// POEMS ROUTES                                       //
// ================================================== //

// Get all poems (public)
app.get('/api/poems', async (req, res) => {
  try {
    const poems = await Poem.find({ published: true })
      .sort({ publishedAt: -1 })
      .select('-__v');
    res.json({ success: true, data: poems });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch poems' });
  }
});

// Get single poem (public)
app.get('/api/poems/:slug', async (req, res) => {
  try {
    const poem = await Poem.findOne({ slug: req.params.slug, published: true });
    if (!poem) {
      return res.status(404).json({ success: false, message: 'Poem not found' });
    }
    poem.stats.views += 1;
    await poem.save();
    res.json({ success: true, data: poem });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch poem' });
  }
});

// Get all poems (admin)
app.get('/api/admin/poems', authMiddleware, async (req, res) => {
  try {
    const poems = await Poem.find().sort({ createdAt: -1 });
    res.json({ success: true, data: poems });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch poems' });
  }
});

// Create poem (admin)
app.post('/api/admin/poems', authMiddleware, async (req, res) => {
  try {
    const poemData = { ...req.body };
    if (poemData.tags && typeof poemData.tags === 'string') {
      poemData.tags = poemData.tags.split(',').map(t => t.trim());
    }
    
    const poem = new Poem(poemData);
    await poem.save();
    res.json({ success: true, message: 'Poem created successfully', data: poem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to create poem' });
  }
});

// Update poem (admin)
app.put('/api/admin/poems/:id', authMiddleware, async (req, res) => {
  try {
    const poemData = { ...req.body };
    if (poemData.tags && typeof poemData.tags === 'string') {
      poemData.tags = poemData.tags.split(',').map(t => t.trim());
    }
    
    const poem = await Poem.findByIdAndUpdate(req.params.id, poemData, { new: true, runValidators: true });
    if (!poem) {
      return res.status(404).json({ success: false, message: 'Poem not found' });
    }
    res.json({ success: true, message: 'Poem updated successfully', data: poem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to update poem' });
  }
});

// Delete poem (admin)
app.delete('/api/admin/poems/:id', authMiddleware, async (req, res) => {
  try {
    const poem = await Poem.findByIdAndDelete(req.params.id);
    if (!poem) {
      return res.status(404).json({ success: false, message: 'Poem not found' });
    }
    res.json({ success: true, message: 'Poem deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete poem' });
  }
});

// ================================================== //
// BOOKS ROUTES                                       //
// ================================================== //

// Get all books (public)
app.get('/api/books', async (req, res) => {
  try {
    const books = await Book.find({ published: true })
      .sort({ publishedAt: -1 })
      .select('-__v');
    res.json({ success: true, data: books });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch books' });
  }
});

// Get single book (public)
app.get('/api/books/:slug', async (req, res) => {
  try {
    const book = await Book.findOne({ slug: req.params.slug, published: true });
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }
    book.stats.views += 1;
    await book.save();
    res.json({ success: true, data: book });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch book' });
  }
});

// Get all books (admin)
app.get('/api/admin/books', authMiddleware, async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.json({ success: true, data: books });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch books' });
  }
});

// Create book (admin)
app.post('/api/admin/books', authMiddleware, upload.single('coverImage'), async (req, res) => {
  try {
    const bookData = { ...req.body };
    if (req.file) {
      bookData.coverImage = `/uploads/${req.file.filename}`;
    }
    if (bookData.genre && typeof bookData.genre === 'string') {
      bookData.genre = bookData.genre.split(',').map(t => t.trim());
    }
    
    const book = new Book(bookData);
    await book.save();
    res.json({ success: true, message: 'Book review created successfully', data: book });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to create book review' });
  }
});

// Update book (admin)
app.put('/api/admin/books/:id', authMiddleware, upload.single('coverImage'), async (req, res) => {
  try {
    const bookData = { ...req.body };
    if (req.file) {
      bookData.coverImage = `/uploads/${req.file.filename}`;
    }
    if (bookData.genre && typeof bookData.genre === 'string') {
      bookData.genre = bookData.genre.split(',').map(t => t.trim());
    }
    
    const book = await Book.findByIdAndUpdate(req.params.id, bookData, { new: true, runValidators: true });
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }
    res.json({ success: true, message: 'Book review updated successfully', data: book });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to update book review' });
  }
});

// Delete book (admin)
app.delete('/api/admin/books/:id', authMiddleware, async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }
    res.json({ success: true, message: 'Book review deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete book review' });
  }
});

// ================================================== //
// BLOG ROUTES                                        //
// ================================================== //

// Get all blog posts (public)
app.get('/api/blog', async (req, res) => {
  try {
    const posts = await BlogPost.find({ published: true })
      .sort({ publishedAt: -1 })
      .select('-__v');
    res.json({ success: true, data: posts });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch blog posts' });
  }
});

// Get single blog post (public)
app.get('/api/blog/:slug', async (req, res) => {
  try {
    const post = await BlogPost.findOne({ slug: req.params.slug, published: true });
    if (!post) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }
    post.stats.views += 1;
    await post.save();
    res.json({ success: true, data: post });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch blog post' });
  }
});

// Get all blog posts (admin)
app.get('/api/admin/blog', authMiddleware, async (req, res) => {
  try {
    const posts = await BlogPost.find().sort({ createdAt: -1 });
    res.json({ success: true, data: posts });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch blog posts' });
  }
});

// Create blog post (admin)
app.post('/api/admin/blog', authMiddleware, upload.single('coverImage'), async (req, res) => {
  try {
    const postData = { ...req.body };
    if (req.file) {
      postData.coverImage = `/uploads/${req.file.filename}`;
    }
    if (postData.tags && typeof postData.tags === 'string') {
      postData.tags = postData.tags.split(',').map(t => t.trim());
    }
    
    const post = new BlogPost(postData);
    await post.save();
    res.json({ success: true, message: 'Blog post created successfully', data: post });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to create blog post' });
  }
});

// Update blog post (admin)
app.put('/api/admin/blog/:id', authMiddleware, upload.single('coverImage'), async (req, res) => {
  try {
    const postData = { ...req.body };
    if (req.file) {
      postData.coverImage = `/uploads/${req.file.filename}`;
    }
    if (postData.tags && typeof postData.tags === 'string') {
      postData.tags = postData.tags.split(',').map(t => t.trim());
    }
    
    const post = await BlogPost.findByIdAndUpdate(req.params.id, postData, { new: true, runValidators: true });
    if (!post) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }
    res.json({ success: true, message: 'Blog post updated successfully', data: post });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to update blog post' });
  }
});

// Delete blog post (admin)
app.delete('/api/admin/blog/:id', authMiddleware, async (req, res) => {
  try {
    const post = await BlogPost.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }
    res.json({ success: true, message: 'Blog post deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete blog post' });
  }
});

// Similar routes for Books and Blog Posts...
// (Continuing in next message due to length)

// ================================================== //
// CONTACT FORM & ANONYMOUS LETTER ROUTES             //
// ================================================== //

// Email transporter setup
const createTransporter = () => {
  console.log("cat1")
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER || process.env.EMAIL_USER,
      pass: process.env.SMTP_PASS || process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false
    }
  });
  //console.log("cat2")
};

// Contact form submission
app.post('/api/contact', contactLimiter, async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }
    
    const transporter = createTransporter();
    
    // Email to you
    await transporter.sendMail({
      from: process.env.SMTP_USER || process.env.EMAIL_USER,
      to: process.env.RECIPIENT_EMAIL || process.env.ADMIN_EMAIL,
      subject: `New Contact Form Message from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ef4444;">New Contact Form Submission</h2>
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <p style="background: white; padding: 15px; border-left: 4px solid #ef4444;">${message}</p>
          </div>
        </div>
      `
    });
    
    // Auto-reply to sender
    await transporter.sendMail({
      from: process.env.SMTP_USER || process.env.EMAIL_USER,
      to: email,
      subject: 'Thanks for reaching out!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ef4444;">Thanks for your message!</h2>
          <p>Hi ${name},</p>
          <p>I've received your message and will get back to you soon.</p>
          <p style="color: #6b7280; font-size: 14px;">This is an automated response.</p>
        </div>
      `
    });
    
    res.json({ 
      success: true, 
      message: 'Message sent successfully!' 
    });
    
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send message. Please try again.' 
    });
  }
});

// Anonymous letter submission
app.post('/api/anonymous-letter', contactLimiter, async (req, res) => {
  try {
    const { message, expectReply, replyEmail } = req.body;
    
    if (!message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Message is required' 
      });
    }
    
    const transporter = createTransporter();
    
    await transporter.sendMail({
      from: process.env.SMTP_USER || process.env.EMAIL_USER,
      to: process.env.RECIPIENT_EMAIL || process.env.ADMIN_EMAIL,
      subject: '📨 New Anonymous Letter',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ef4444;">📨 New Anonymous Letter</h2>
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px;">
            <p style="background: white; padding: 15px; border-left: 4px solid #ef4444;">${message}</p>
            ${expectReply && replyEmail ? `<p><strong>Reply to:</strong> ${replyEmail}</p>` : '<p><em>No reply requested</em></p>'}
          </div>
        </div>
      `
    });
    
    res.json({ 
      success: true, 
      message: 'Anonymous letter sent successfully!' 
    });
    
  } catch (error) {
    console.error('Anonymous letter error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send letter. Please try again.' 
    });
  }
});

// ================================================== //
// START SERVER                                       //
// ================================================== //

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════╗
║                                                    ║
║   🚀 CMS Server Running Successfully!              ║
║                                                    ║
║   📍 Port: ${PORT}                                    ║
║   🌐 URL: http://localhost:${PORT}                   ║
║   🗄️  Database: MongoDB                            ║
║                                                    ║
║   Admin Panel: http://localhost:${PORT}/admin.html ║
║                                                    ║
╚════════════════════════════════════════════════════╝
  `);
});

module.exports = app;
