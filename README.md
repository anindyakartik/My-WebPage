# Anindya Kartik — Personal Website

> Where Code Meets Poetry

A personal portfolio website with a CMS backend for managing projects, poems, book reviews, and blog posts.

## Architecture

- **Frontend**: Static HTML/CSS/JS deployed on **Vercel**
- **Backend**: Express.js + MongoDB CMS server deployed on **Render**
- **Database**: MongoDB Atlas (free tier)

## Pages

| Page | Description |
|------|-------------|
| `index.html` | Home — hero, featured work, poems, books, now |
| `work.html` | Projects showcase with filters |
| `musings.html` | Poetry collection with mood filters |
| `shelf.html` | Book reviews with reading status filters |
| `now.html` | What I'm doing now (living document) |
| `contact.html` | Contact form + anonymous letter feature |
| `admin.html` | CMS admin panel (served from backend) |

## Local Development

```bash
# Install dependencies
npm install

# Start the backend (serves everything on port 3000)
npm start

# Or use live-server for frontend-only dev
npm run dev
```

## Environment Variables

Copy `.env.example` to `.env` and fill in your credentials. Required:

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `ADMIN_USERNAME` | Admin login username |
| `ADMIN_PASSWORD` | Admin login password |
| `JWT_SECRET` | Random 64-char hex string |
| `SESSION_SECRET` | Random 64-char hex string |
| `SMTP_USER` | Gmail address for sending emails |
| `SMTP_PASS` | Gmail App Password |
| `RECIPIENT_EMAIL` | Where contact messages go |
| `ALLOWED_ORIGINS` | Comma-separated allowed frontend URLs |

## Deployment

### Frontend → Vercel
1. Push to GitHub
2. Import repo in Vercel
3. Framework: Other, Output Directory: `.`
4. No build command needed

### Backend → Render
1. Create Web Service from same repo
2. Build Command: `npm install`
3. Start Command: `node cms-server.js`
4. Add all environment variables from `.env`

## License

MIT © Anindya Kartik
