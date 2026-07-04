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
const nodemailer = require('nodemailer');
require('dotenv').config();

// Import models
const Admin = require('./models/Admin');
const Project = require('./models/Project');
const Poem = require('./models/Poem');
const Book = require('./models/Book');
const BlogPost = require('./models/BlogPost');
const Guestbook = require('./models/Guestbook');
const NowCard = require('./models/NowCard');

const app = express();
const PORT = process.env.PORT || 3000;

// ================================================== //
// PRODUCTION SAFETY CHECKS                           //
// ================================================== //

if (process.env.NODE_ENV === 'production') {
  const required = ['JWT_SECRET', 'SESSION_SECRET', 'MONGODB_URI'];
  const missing = required.filter(key => !process.env[key]);
  if (missing.length > 0) {
    console.error(`❌ Missing required environment variables in production: ${missing.join(', ')}`);
    process.exit(1);
  }
  if (!process.env.ALLOWED_ORIGINS || process.env.ALLOWED_ORIGINS.trim() === '*') {
    console.error('❌ ALLOWED_ORIGINS must be an explicit comma-separated list in production (cannot be "*" when credentials are used).');
    process.exit(1);
  }
}

// Trust proxy for Render
app.set('trust proxy', 1);

// ================================================== //
// MONGODB CONNECTION                                 //
// ================================================== //

mongoose.connect(process.env.MONGODB_URI)
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

app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));
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
app.post('/api/admin/projects', authMiddleware, async (req, res) => {
  try {
    const projectData = { ...req.body };
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
app.put('/api/admin/projects/:id', authMiddleware, async (req, res) => {
  try {
    const projectData = { ...req.body };
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
app.post('/api/admin/books', authMiddleware, async (req, res) => {
  try {
    const bookData = { ...req.body };
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
app.put('/api/admin/books/:id', authMiddleware, async (req, res) => {
  try {
    const bookData = { ...req.body };
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
app.post('/api/admin/blog', authMiddleware, async (req, res) => {
  try {
    const postData = { ...req.body };
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
app.put('/api/admin/blog/:id', authMiddleware, async (req, res) => {
  try {
    const postData = { ...req.body };
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

// Resend (HTTP-based — works on Render free tier)
const { Resend } = require('resend');
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// SMTP fallback (for local dev or if Resend isn't configured)
const createTransporter = () => {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!user || !pass) return null;
  
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: { user, pass },
    tls: { rejectUnauthorized: false },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000
  });
};

// Unified email sender — tries Resend first, then SMTP
async function sendEmail({ from, to, replyTo, subject, html }) {
  // Try Resend first (HTTP-based, always works on cloud)
  if (resend) {
    const result = await resend.emails.send({
      from: from || 'Anindya Kartik <onboarding@resend.dev>',
      to: Array.isArray(to) ? to : [to],
      reply_to: replyTo || undefined,
      subject,
      html
    });
    
    if (result.error) throw new Error(result.error.message);
    console.log('✅ Email sent via Resend');
    return result;
  }
  
  // Fallback to SMTP
  const transporter = createTransporter();
  if (!transporter) {
    throw new Error('No email provider configured. Set RESEND_API_KEY or SMTP credentials.');
  }
  
  await transporter.verify();
  const result = await transporter.sendMail({
    from: from || process.env.SMTP_USER,
    to,
    replyTo: replyTo || undefined,
    subject,
    html
  });
  console.log('✅ Email sent via SMTP');
  return result;
}

// Health check endpoint
app.get('/api/health', async (req, res) => {
  const status = {
    server: 'running',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    email: 'unknown',
    provider: resend ? 'Resend (HTTP)' : 'SMTP',
    env: {
      RESEND_API_KEY: process.env.RESEND_API_KEY ? 'set' : 'MISSING',
      SMTP_USER: process.env.SMTP_USER ? 'set' : 'MISSING',
      SMTP_PASS: process.env.SMTP_PASS ? 'set' : 'MISSING',
      RECIPIENT_EMAIL: process.env.RECIPIENT_EMAIL || 'MISSING',
      ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS || 'MISSING'
    }
  };
  
  try {
    if (resend) {
      status.email = 'Resend configured — ready to send';
    } else {
      const transporter = createTransporter();
      if (transporter) {
        await transporter.verify();
        status.email = 'SMTP verified — ready to send';
      } else {
        status.email = 'NO email provider — set RESEND_API_KEY or SMTP credentials';
      }
    }
  } catch (err) {
    status.email = 'FAILED — ' + err.message;
  }
  
  res.json(status);
});

// Contact form submission
app.post('/api/contact', contactLimiter, async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name, email, and message are required' 
      });
    }
    
    const recipientEmail = process.env.RECIPIENT_EMAIL || process.env.ADMIN_EMAIL;
    
    // Send notification email
    await sendEmail({
      from: resend ? 'Anindya Kartik <onboarding@resend.dev>' : `"${name}" <${process.env.SMTP_USER}>`,
      to: recipientEmail,
      replyTo: email,
      subject: subject || `New message from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ef4444;">New Contact Form Submission</h2>
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            ${subject ? `<p><strong>Subject:</strong> ${subject}</p>` : ''}
            <p><strong>Message:</strong></p>
            <p style="background: white; padding: 15px; border-left: 4px solid #ef4444;">${message}</p>
          </div>
        </div>
      `
    });
    
    // Auto-reply (non-blocking)
    sendEmail({
      from: resend ? 'Anindya Kartik <onboarding@resend.dev>' : `"Anindya Kartik" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Thanks for reaching out!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ef4444;">Thanks for your message!</h2>
          <p>Hi ${name},</p>
          <p>I've received your message and will get back to you soon.</p>
          <p style="color: #6b7280; font-size: 14px;">— Anindya Kartik</p>
        </div>
      `
    }).catch(err => console.error('Auto-reply failed:', err.message));
    
    console.log('✅ Contact email sent from', email);
    res.json({ success: true, message: 'Message sent successfully!' });
    
  } catch (error) {
    console.error('Contact form error:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send message: ' + error.message 
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
    
    const recipientEmail = process.env.RECIPIENT_EMAIL || process.env.ADMIN_EMAIL;
    
    await sendEmail({
      from: resend ? 'onboarding@resend.dev' : `"Anonymous" <${process.env.SMTP_USER}>`,
      to: recipientEmail,
      subject: 'New Anonymous Letter Received',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ef4444;">New Anonymous Letter</h2>
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px;">
            <p style="background: white; padding: 15px; border-left: 4px solid #ef4444; white-space: pre-wrap;">${message}</p>
            ${expectReply && replyEmail ? `<p><strong>Reply to:</strong> ${replyEmail}</p>` : '<p><em>No reply requested</em></p>'}
          </div>
        </div>
      `
    });
    
    console.log('✅ Anonymous letter sent');
    res.json({ success: true, message: 'Anonymous letter sent successfully!' });
    
  } catch (error) {
    console.error('Anonymous letter error:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send letter: ' + error.message 
    });
  }
});

// ================================================== //
// GUESTBOOK ROUTES                                   //
// ================================================== //

const guestbookLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  message: { success: false, message: 'You\'ve signed the guestbook recently — check back later.' }
});

// GET all approved guestbook entries (public)
app.get('/api/guestbook', async (req, res) => {
  try {
    const entries = await Guestbook.find({ approved: true })
      .sort({ createdAt: -1 })
      .select('name message location createdAt')
      .limit(100);
    res.json({ success: true, data: entries });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch guestbook' });
  }
});

// POST new guestbook entry (public)
app.post('/api/guestbook', guestbookLimiter, async (req, res) => {
  try {
    const { name, message, location } = req.body;

    if (!name || !message) {
      return res.status(400).json({ success: false, message: 'Name and message are required' });
    }
    if (message.length > 280) {
      return res.status(400).json({ success: false, message: 'Message cannot exceed 280 characters' });
    }

    // Basic spam check — block obvious bot strings
    const spamPatterns = /http[s]?:\/\/|<script|\bviagra\b|\bcasino\b/i;
    if (spamPatterns.test(message) || spamPatterns.test(name)) {
      return res.status(400).json({ success: false, message: 'Invalid submission' });
    }

    const entry = new Guestbook({
      name: name.substring(0, 60),
      message: message.substring(0, 280),
      location: (location || '').substring(0, 60),
      ip: req.ip
    });

    await entry.save();

    // Return the entry without the ip field
    res.json({
      success: true,
      message: 'Thanks for signing the guestbook!',
      data: {
        _id: entry._id,
        name: entry.name,
        message: entry.message,
        location: entry.location,
        createdAt: entry.createdAt
      }
    });
  } catch (error) {
    console.error('Guestbook error:', error);
    res.status(500).json({ success: false, message: 'Failed to save entry' });
  }
});

// GET all guestbook entries incl. unapproved (admin only)
app.get('/api/admin/guestbook', authMiddleware, async (req, res) => {
  try {
    const entries = await Guestbook.find().sort({ createdAt: -1 });
    res.json({ success: true, data: entries });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch guestbook' });
  }
});

// DELETE guestbook entry (admin only)
app.delete('/api/admin/guestbook/:id', authMiddleware, async (req, res) => {
  try {
    const entry = await Guestbook.findByIdAndDelete(req.params.id);
    if (!entry) {
      return res.status(404).json({ success: false, message: 'Entry not found' });
    }
    res.json({ success: true, message: 'Entry deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete entry' });
  }
});

// PATCH to toggle approval (admin only)
app.patch('/api/admin/guestbook/:id', authMiddleware, async (req, res) => {
  try {
    const entry = await Guestbook.findById(req.params.id);
    if (!entry) {
      return res.status(404).json({ success: false, message: 'Entry not found' });
    }
    entry.approved = !entry.approved;
    await entry.save();
    res.json({ success: true, data: entry });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update entry' });
  }
});

// ================================================== //
// NOW CARDS ROUTES                                   //
// ================================================== //

// Get all now cards (public)
app.get('/api/now', async (req, res) => {
  try {
    const cards = await NowCard.find({ published: true })
      .sort({ order: 1, createdAt: -1 })
      .select('-__v');
    res.json({ success: true, data: cards });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch now cards' });
  }
});

// Get all now cards (admin)
app.get('/api/admin/now', authMiddleware, async (req, res) => {
  try {
    const cards = await NowCard.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: cards });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch now cards' });
  }
});

// Create now card (admin)
app.post('/api/admin/now', authMiddleware, async (req, res) => {
  try {
    const cardData = { ...req.body };
    if (cardData.order !== undefined) cardData.order = Number(cardData.order) || 0;

    const card = new NowCard(cardData);
    await card.save();
    res.json({ success: true, message: 'Now card created successfully', data: card });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to create now card' });
  }
});

// Update now card (admin)
app.put('/api/admin/now/:id', authMiddleware, async (req, res) => {
  try {
    const cardData = { ...req.body };
    if (cardData.order !== undefined) cardData.order = Number(cardData.order) || 0;

    const card = await NowCard.findByIdAndUpdate(req.params.id, cardData, { new: true, runValidators: true });
    if (!card) {
      return res.status(404).json({ success: false, message: 'Now card not found' });
    }
    res.json({ success: true, message: 'Now card updated successfully', data: card });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to update now card' });
  }
});

// Delete now card (admin)
app.delete('/api/admin/now/:id', authMiddleware, async (req, res) => {
  try {
    const card = await NowCard.findByIdAndDelete(req.params.id);
    if (!card) {
      return res.status(404).json({ success: false, message: 'Now card not found' });
    }
    res.json({ success: true, message: 'Now card deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete now card' });
  }
});

// ================================================== //
// START SERVER                                       //
// ================================================== //

app.listen(PORT, () => {
  const baseUrl = process.env.NODE_ENV === 'production'
    ? (process.env.RENDER_EXTERNAL_URL || `https://anindya-kartik.onrender.com`)
    : `http://localhost:${PORT}`;
  console.log(`
╔════════════════════════════════════════════════════╗
║                                                    ║
║   🚀 CMS Server Running Successfully!              ║
║                                                    ║
║   📍 Port: ${PORT}                                    ║
║   🌐 URL: ${baseUrl}
║   🗄️  Database: MongoDB                            ║
║   📋 Admin: ${baseUrl}/admin.html
║                                                    ║
╚════════════════════════════════════════════════════╝
  `);
});

module.exports = app;
