# 🚀 START HERE - Complete Setup Guide

Welcome! This guide will get your contact form and anonymous letter feature up and running in **5 minutes**.

## 📋 What You're Getting

✨ **Professional Contact Form**
- Beautiful design with smooth animations
- Email notifications with auto-reply
- Rate limiting and security features

🔒 **Anonymous Letter Feature**
- Secure anonymous messaging
- Optional reply email
- Stunning envelope animations

## 🎯 Quick Start (5 Minutes)

### Step 1: Install Dependencies (1 min)
```bash
npm install
```

### Step 2: Setup Gmail (2 min)

1. **Enable 2-Factor Authentication**
   - Go to: https://myaccount.google.com/security
   - Enable 2-Step Verification

2. **Generate App Password**
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" → "Other" → Type "Portfolio"
   - **Copy the 16-character password**

### Step 3: Configure Environment (1 min)

Create `.env` file:
```bash
cp .env.example .env
```

Edit `.env`:
```env
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-char-app-password
RECIPIENT_EMAIL=your-email@gmail.com
```

### Step 4: Start Server (1 min)
```bash
npm start
```

### Step 5: Test It! (30 seconds)
Open: http://localhost:3000/contact.html

Fill out the form and send a message!

## ✅ Verify Everything Works

Run the test suite:
```bash
npm test
```

You should see all tests passing with green checkmarks!

## 📧 Check Your Email

You should receive:
1. **Contact form submission** (your message)
2. **Auto-reply confirmation** (to the sender)

## 🎨 Features Overview

### Contact Form
- Real-time validation
- Beautiful email templates
- Auto-reply to sender
- Success notifications
- Rate limiting (5 per 15 min)

### Anonymous Letter
- Envelope opening animation
- Character counter (1000 max)
- Preview before sending
- Flying letter animation
- Particle burst effects
- Optional reply email

## 📚 Documentation

- **SETUP.md** - Detailed setup instructions
- **README.md** - Complete documentation
- **FEATURES.md** - All features explained
- **DEPLOYMENT.md** - Deploy to production

## 🐛 Troubleshooting

### "Invalid login" error
→ Use App Password, not regular Gmail password
→ Make sure 2FA is enabled

### Emails not arriving
→ Check spam folder
→ Verify SMTP credentials in .env

### "Connection refused"
→ Make sure server is running: `npm start`

## 🚀 Next Steps

1. **Customize** - Update colors, templates, limits
2. **Deploy** - See DEPLOYMENT.md for guides
3. **Share** - Show off your awesome contact page!

---

Built with ❤️ by Anindya Kartik
