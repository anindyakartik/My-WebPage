# 🚀 Quick Setup Guide

Follow these steps to get your contact form and anonymous letter feature working in 5 minutes!

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Setup Gmail (Easiest Option)

### 2.1 Enable 2-Factor Authentication
1. Go to your Google Account: https://myaccount.google.com/security
2. Click on "2-Step Verification"
3. Follow the steps to enable it

### 2.2 Generate App Password
1. Go to: https://myaccount.google.com/apppasswords
2. Select "Mail" from the dropdown
3. Select "Other" and type "Portfolio Contact Form"
4. Click "Generate"
5. **Copy the 16-character password** (you'll need this in the next step)

## Step 3: Create .env File

Create a file named `.env` in your project root:

```bash
# Copy the example file
cp .env.example .env
```

Edit `.env` and add your details:

```env
PORT=3000
NODE_ENV=development

# Your Gmail credentials
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=paste-your-16-char-app-password-here

# Where you want to receive messages
RECIPIENT_EMAIL=your-email@gmail.com

# Allow local development
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

**Important**: 
- Replace `your-email@gmail.com` with your actual Gmail address
- Replace `paste-your-16-char-app-password-here` with the App Password from Step 2.2
- Don't use your regular Gmail password!

## Step 4: Start the Server

```bash
npm start
```

You should see:
```
╔════════════════════════════════════════════════════╗
║                                                    ║
║   🚀 Server Running Successfully!                  ║
║                                                    ║
║   📍 Port: 3000                                    ║
║   🌐 URL: http://localhost:3000                   ║
║   📧 Email: your-email@gmail.com                  ║
║                                                    ║
╚════════════════════════════════════════════════════╝
```

## Step 5: Test It!

1. Open your browser to: http://localhost:3000/contact.html
2. Fill out the contact form
3. Click "Send message"
4. Check your email - you should receive:
   - The contact form submission
   - An auto-reply confirmation

## 🎉 That's It!

Your contact form and anonymous letter feature are now fully functional!

## 🧪 Quick Test Commands

Test if the server is running:
```bash
curl http://localhost:3000/api/health
```

Test contact form:
```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "message": "This is a test message from the terminal!"
  }'
```

## ❓ Common Issues

### "Invalid login" error
- Make sure you're using the App Password, not your regular Gmail password
- Check that 2-Factor Authentication is enabled

### "Connection timeout" error
- Check your internet connection
- Verify SMTP_HOST and SMTP_PORT are correct
- Try port 465 with `secure: true` in server.js

### Emails not arriving
- Check your spam folder
- Verify RECIPIENT_EMAIL is correct
- Check server console for error messages

### Rate limit reached
- Wait 15 minutes
- Or restart the server

## 🔄 Development Mode

For development with auto-restart on file changes:

```bash
npm run dev
```

## 📱 Access from Other Devices

To test from your phone or other devices on the same network:

1. Find your computer's IP address:
   - Windows: `ipconfig`
   - Mac/Linux: `ifconfig` or `ip addr`

2. Update `.env`:
   ```env
   ALLOWED_ORIGINS=http://localhost:3000,http://YOUR-IP:3000
   ```

3. Access from other device:
   ```
   http://YOUR-IP:3000/contact.html
   ```

## 🚀 Next Steps

- Customize email templates in `server.js`
- Adjust rate limits for your needs
- Deploy to production (see README.md)
- Add more features!

## 💡 Pro Tips

1. **Keep your .env file secret** - Never commit it to Git
2. **Use different emails** for testing and production
3. **Monitor your email quota** - Gmail has sending limits
4. **Test thoroughly** before going live
5. **Check spam folders** during testing

---

Need help? Check the full README.md for detailed documentation!
