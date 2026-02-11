/* ============================================================
   ANINDYA KARTIK — CONTACT & ANONYMOUS LETTER SERVER
   Backend API for handling contact form and anonymous messages
   ============================================================ */

const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const validator = require('validator');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// ================================================== //
// MIDDLEWARE                                         //
// ================================================== //

// Security headers
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  methods: ['GET', 'POST'],
  credentials: true
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files
app.use(express.static('.'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: { 
    success: false, 
    message: 'Too many requests, please try again later.' 
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ================================================== //
// EMAIL CONFIGURATION                                //
// ================================================== //

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

// ================================================== //
// VALIDATION HELPERS                                 //
// ================================================== //

const sanitizeInput = (input) => {
  if (!input) return '';
  return validator.escape(input.trim());
};

const validateEmail = (email) => {
  return validator.isEmail(email);
};

const validateContactForm = (data) => {
  const errors = [];

  if (!data.name || data.name.length < 2) {
    errors.push('Name must be at least 2 characters long');
  }

  if (!data.email || !validateEmail(data.email)) {
    errors.push('Valid email is required');
  }

  if (!data.message || data.message.length < 10) {
    errors.push('Message must be at least 10 characters long');
  }

  if (data.message && data.message.length > 5000) {
    errors.push('Message is too long (max 5000 characters)');
  }

  return errors;
};

const validateAnonymousLetter = (data) => {
  const errors = [];

  if (!data.message || data.message.length < 10) {
    errors.push('Message must be at least 10 characters long');
  }

  if (data.message && data.message.length > 1000) {
    errors.push('Message is too long (max 1000 characters)');
  }

  if (data.expectReply && data.replyEmail && !validateEmail(data.replyEmail)) {
    errors.push('Valid email is required for reply');
  }

  return errors;
};

// ================================================== //
// EMAIL TEMPLATES                                    //
// ================================================== //

const getContactEmailTemplate = (data) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; }
        .header h1 { margin: 0; font-size: 24px; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .field { margin-bottom: 20px; }
        .label { font-weight: bold; color: #ef4444; margin-bottom: 5px; }
        .value { background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #ef4444; }
        .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📬 New Contact Form Submission</h1>
        </div>
        <div class="content">
          <div class="field">
            <div class="label">From:</div>
            <div class="value">${data.name}</div>
          </div>
          <div class="field">
            <div class="label">Email:</div>
            <div class="value">${data.email}</div>
          </div>
          ${data.subject ? `
          <div class="field">
            <div class="label">Subject:</div>
            <div class="value">${data.subject}</div>
          </div>
          ` : ''}
          <div class="field">
            <div class="label">Message:</div>
            <div class="value">${data.message.replace(/\n/g, '<br>')}</div>
          </div>
          <div class="footer">
            <p>Received on ${new Date().toLocaleString()}</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

const getAnonymousEmailTemplate = (data) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; }
        .header h1 { margin: 0; font-size: 24px; }
        .anonymous-badge { display: inline-block; background: rgba(255,255,255,0.2); padding: 5px 15px; border-radius: 20px; font-size: 12px; margin-top: 10px; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .message-box { background: white; padding: 25px; border-radius: 8px; border-left: 4px solid #7c3aed; font-style: italic; line-height: 1.8; }
        .reply-info { background: #fef3c7; padding: 15px; border-radius: 8px; margin-top: 20px; border-left: 4px solid #f59e0b; }
        .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
        .lock-icon { font-size: 40px; text-align: center; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔒 Anonymous Letter Received</h1>
          <div class="anonymous-badge">ANONYMOUS MESSAGE</div>
        </div>
        <div class="content">
          <div class="lock-icon">🔐</div>
          <div class="message-box">
            ${data.message.replace(/\n/g, '<br>')}
          </div>
          ${data.expectReply && data.replyEmail ? `
          <div class="reply-info">
            <strong>📧 Reply Requested</strong><br>
            The sender would like a reply at: <strong>${data.replyEmail}</strong>
          </div>
          ` : ''}
          <div class="footer">
            <p>🕐 Received on ${new Date().toLocaleString()}</p>
            <p style="font-size: 12px; color: #9ca3af;">This message was sent anonymously. No tracking information is available.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

const getAutoReplyTemplate = (name) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .message { background: white; padding: 25px; border-radius: 8px; line-height: 1.8; }
        .signature { margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb; }
        .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Message Received!</h1>
        </div>
        <div class="content">
          <div class="message">
            <p>Hi ${name},</p>
            <p>Thank you for reaching out! I've received your message and I'll get back to you as soon as possible.</p>
            <p>I typically respond within 24-48 hours. If your message is urgent, feel free to reach out directly at <strong>anindyakartik@gmail.com</strong>.</p>
            <p>Looking forward to connecting with you!</p>
            <div class="signature">
              <p><strong>Anindya Kartik</strong><br>
              Developer & Poet<br>
              <a href="mailto:anindyakartik@gmail.com" style="color: #ef4444;">anindyakartik@gmail.com</a></p>
            </div>
          </div>
          <div class="footer">
            <p>This is an automated response. Please do not reply to this email.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

// ================================================== //
// API ROUTES                                         //
// ================================================== //

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Contact form submission
app.post('/api/contact', limiter, async (req, res) => {
  try {
    // Sanitize inputs
    const data = {
      name: sanitizeInput(req.body.name),
      email: sanitizeInput(req.body.email),
      subject: sanitizeInput(req.body.subject),
      message: sanitizeInput(req.body.message),
    };

    // Validate
    const errors = validateContactForm(data);
    if (errors.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Validation failed', 
        errors 
      });
    }

    // Create transporter
    const transporter = createTransporter();

    // Send email to yourself
    const mailOptions = {
      from: `"${data.name}" <${process.env.SMTP_USER}>`,
      to: process.env.RECIPIENT_EMAIL || process.env.SMTP_USER,
      replyTo: data.email,
      subject: data.subject || `New Contact Form Message from ${data.name}`,
      html: getContactEmailTemplate(data),
    };

    await transporter.sendMail(mailOptions);

    // Send auto-reply to sender
    const autoReplyOptions = {
      from: `"Anindya Kartik" <${process.env.SMTP_USER}>`,
      to: data.email,
      subject: 'Thank you for reaching out!',
      html: getAutoReplyTemplate(data.name),
    };

    await transporter.sendMail(autoReplyOptions);

    res.json({ 
      success: true, 
      message: 'Message sent successfully! Check your email for confirmation.' 
    });

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send message. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Anonymous letter submission
app.post('/api/anonymous', limiter, async (req, res) => {
  try {
    // Sanitize inputs
    const data = {
      message: sanitizeInput(req.body.message),
      expectReply: req.body.expectReply === true || req.body.expectReply === 'true',
      replyEmail: req.body.expectReply ? sanitizeInput(req.body.replyEmail) : null,
    };

    // Validate
    const errors = validateAnonymousLetter(data);
    if (errors.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Validation failed', 
        errors 
      });
    }

    // Create transporter
    const transporter = createTransporter();

    // Send anonymous letter
    const mailOptions = {
      from: `"Anonymous Letter" <${process.env.SMTP_USER}>`,
      to: process.env.RECIPIENT_EMAIL || process.env.SMTP_USER,
      subject: '🔒 New Anonymous Letter',
      html: getAnonymousEmailTemplate(data),
    };

    await transporter.sendMail(mailOptions);

    res.json({ 
      success: true, 
      message: 'Anonymous letter sent successfully!' 
    });

  } catch (error) {
    console.error('Anonymous letter error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send anonymous letter. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Endpoint not found' 
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    success: false, 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// ================================================== //
// START SERVER                                       //
// ================================================== //

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════╗
║                                                    ║
║   🚀 Server Running Successfully!                  ║
║                                                    ║
║   📍 Port: ${PORT}                                    ║
║   🌐 URL: http://localhost:${PORT}                   ║
║   📧 Email: ${process.env.SMTP_USER || 'Not configured'}
║                                                    ║
║   Endpoints:                                       ║
║   • GET  /api/health                               ║
║   • POST /api/contact                              ║
║   • POST /api/anonymous                            ║
║                                                    ║
╚════════════════════════════════════════════════════╝
  `);
});

module.exports = app;
