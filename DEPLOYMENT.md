# 🚀 EduEquity Deployment Guide

Complete guide to deploy your scholarship platform to production.

---

## 📋 Prerequisites

- GitHub account
- Node.js 18+ installed locally
- PostgreSQL database (local or cloud)

---

## 🔧 Backend Deployment (NestJS)

### **Option 1: Render (Recommended - Free)**

#### Step 1: Sign Up & Connect GitHub
1. Go to [render.com](https://render.com)
2. Sign up with your GitHub account
3. Authorize Render to access your repositories

#### Step 2: Create PostgreSQL Database
1. Click **"New +"** → **"PostgreSQL"**
2. Configure:
   - **Name**: `eduequity-db`
   - **Database**: `scholarship`
   - **User**: `eduequity_user`
   - **Region**: Choose closest to you
   - **Plan**: **Free**
3. Click **"Create Database"**
4. **SAVE** the connection details (Internal/External Database URL)

#### Step 3: Deploy Backend
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository: `ScholarshipFinder`
3. Configure:
   - **Name**: `eduequity-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Region**: Same as database
   - **Branch**: `main`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start:prod`
   - **Plan**: **Free**

4. **Add Environment Variables**:
   ```
   NODE_ENV=production
   DATABASE_URL=<your-postgres-internal-url>
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   PORT=10000
   FRONTEND_URL=https://your-frontend-url.vercel.app
   ```

5. Click **"Create Web Service"**
6. Wait 5-10 minutes for deployment
7. **Copy your backend URL**: `https://eduequity-backend.onrender.com`

---

### **Option 2: Railway (Alternative - Free)**

1. Go to [railway.app](https://railway.app)
2. Sign in with GitHub
3. Click **"New Project"** → **"Deploy from GitHub repo"**
4. Select your repository
5. Add PostgreSQL:
   - Click **"+ New"** → **"Database"** → **"PostgreSQL"**
6. Add environment variables in backend service
7. Deploy!

---

### **Option 3: Heroku**

1. Install Heroku CLI: `npm install -g heroku`
2. Login: `heroku login`
3. Create app:
   ```bash
   cd backend
   heroku create eduequity-backend
   heroku addons:create heroku-postgresql:mini
   heroku config:set JWT_SECRET=your-secret-key
   heroku config:set FRONTEND_URL=https://your-frontend.vercel.app
   git subtree push --prefix backend heroku main
   ```

---

## 🎨 Frontend Deployment (Next.js)

### **Option 1: Vercel (Recommended - Best for Next.js)**

#### Step 1: Prepare Frontend
1. Create `.env.local` file in `frontend/`:
   ```env
   NEXT_PUBLIC_API_URL=https://eduequity-backend.onrender.com
   ```

#### Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click **"Add New Project"**
4. Import your GitHub repository
5. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   
6. **Add Environment Variable**:
   ```
   NEXT_PUBLIC_API_URL=https://eduequity-backend.onrender.com
   ```

7. Click **"Deploy"**
8. Wait 2-3 minutes
9. **Copy your frontend URL**: `https://eduequity.vercel.app`

#### Step 3: Update Backend CORS
Go back to Render → Backend Service → Environment → Update:
```
FRONTEND_URL=https://eduequity.vercel.app
```
Click **"Save Changes"** (backend will auto-redeploy)

---

### **Option 2: Netlify**

1. Go to [netlify.com](https://netlify.com)
2. **"Add new site"** → **"Import from Git"**
3. Select your repository
4. Configure:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
5. Add environment variable: `NEXT_PUBLIC_API_URL`
6. Deploy!

---

### **Option 3: Cloudflare Pages**

1. Go to [pages.cloudflare.com](https://pages.cloudflare.com)
2. Connect GitHub repository
3. Configure build settings
4. Add environment variables
5. Deploy!

---

## ✅ Post-Deployment Checklist

### 1. **Test Backend**
Open: `https://eduequity-backend.onrender.com`  
You should see: "Hello World" or API response

Test endpoints:
```bash
# Health check
curl https://eduequity-backend.onrender.com

# Test login
curl -X POST https://eduequity-backend.onrender.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@eduequity.com","password":"admin123"}'
```

### 2. **Test Frontend**
1. Open your Vercel URL: `https://eduequity.vercel.app`
2. Click **"Login"**
3. Enter default credentials:
   - Email: `admin@eduequity.com`
   - Password: `admin123`
4. Verify you can see the dashboard

### 3. **Verify Database Connection**
1. Go to Render → Your Database
2. Click **"Connect"**
3. Use provided connection string to verify tables exist

---

## 🔒 Security Best Practices

### Update JWT Secret
In Render backend environment variables:
```
JWT_SECRET=<generate-random-64-character-string>
```

Generate secure secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Enable HTTPS Only
Both Render and Vercel automatically provide HTTPS.

### Set Secure Cookies
Update auth service to use secure cookies in production.

---

## 🌍 Custom Domain (Optional)

### For Frontend (Vercel)
1. Go to Vercel Project → **Settings** → **Domains**
2. Add your domain: `eduequity.com`
3. Follow DNS configuration instructions
4. Wait for SSL certificate (automatic)

### For Backend (Render)
1. Go to Render Service → **Settings** → **Custom Domains**
2. Add: `api.eduequity.com`
3. Configure DNS records
4. SSL auto-configured

---

## 📊 Monitoring & Logs

### View Backend Logs (Render)
1. Go to your web service
2. Click **"Logs"** tab
3. Monitor real-time requests

### View Frontend Logs (Vercel)
1. Go to your project
2. Click **"Deployments"**
3. Click on latest deployment → **"View Logs"**

---

## 🔄 Continuous Deployment

Both Render and Vercel auto-deploy when you push to GitHub!

```bash
# Make changes locally
git add .
git commit -m "✨ New feature"
git push origin main

# Automatic deployment happens!
# Frontend: ~2 minutes
# Backend: ~5 minutes
```

---

## 💰 Cost Breakdown

### Free Tier (Perfect for College Projects)
- **Backend (Render)**: Free (sleeps after 15 min inactivity)
- **Database (Render)**: Free (90 days, then expires)
- **Frontend (Vercel)**: Free (unlimited bandwidth)
- **Total**: $0/month ✨

### Paid Tier (For Production)
- **Backend (Render)**: $7/month (always on)
- **Database (Render)**: $7/month (persistent)
- **Frontend (Vercel)**: Free
- **Total**: ~$14/month

---

## 🐛 Troubleshooting

### Issue: Backend not connecting to database
**Solution**: Check `DATABASE_URL` in environment variables

### Issue: CORS errors
**Solution**: Verify `FRONTEND_URL` matches your Vercel domain

### Issue: Backend sleeps (Free tier)
**Solution**: First request takes 30-60 seconds to wake up (normal)

### Issue: Build fails
**Solution**: Check logs for missing dependencies, run `npm install` locally first

---

## 🎯 Quick Deploy Commands

### Update & Deploy Backend
```bash
cd backend
# Make changes
git add .
git commit -m "Update backend"
git push origin main
# Render auto-deploys
```

### Update & Deploy Frontend
```bash
cd frontend
# Make changes
git add .
git commit -m "Update UI"
git push origin main
# Vercel auto-deploys
```

---

## 📞 Support Resources

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **NestJS Deployment**: https://docs.nestjs.com/faq/deployment
- **Next.js Deployment**: https://nextjs.org/docs/deployment

---

## 🎉 You're Live!

Your EduEquity platform is now accessible worldwide at:
- **Frontend**: `https://eduequity.vercel.app`
- **Backend API**: `https://eduequity-backend.onrender.com`

Share your project link in your resume, LinkedIn, and college submissions! 🚀
