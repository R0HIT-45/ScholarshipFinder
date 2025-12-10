# ⚡ Quick Deployment Reference

## 🎯 Fastest Way to Deploy (5 Minutes)

### Step 1: Backend (Render)
1. Go to [render.com](https://render.com) → Sign up with GitHub
2. **New +** → **PostgreSQL** → Name: `eduequity-db` → **Create**
3. **New +** → **Web Service** → Select repo → Root: `backend`
4. Add these environment variables:
   ```
   NODE_ENV=production
   DATABASE_URL=<copy-from-postgres-internal-url>
   JWT_SECRET=my-super-secret-key-12345
   PORT=10000
   FRONTEND_URL=https://your-app.vercel.app
   ```
5. **Create Web Service** → Wait 5 min → Copy URL

### Step 2: Frontend (Vercel)
1. Go to [vercel.com](https://vercel.com) → Sign up with GitHub
2. **Add New** → **Project** → Select repo → Root: `frontend`
3. Add environment variable:
   ```
   NEXT_PUBLIC_API_URL=<your-render-backend-url>
   ```
4. **Deploy** → Wait 2 min → Copy URL

### Step 3: Update Backend
1. Go back to Render → Your web service → **Environment**
2. Update `FRONTEND_URL` with your Vercel URL
3. Save → Auto redeploys

### ✅ Done! Test your live app!

---

## 🔗 Important URLs to Save

| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend** | `https://yourapp.vercel.app` | Main website |
| **Backend API** | `https://yourapp.onrender.com` | API endpoint |
| **Database** | Render Dashboard | Database management |
| **GitHub Repo** | `github.com/R0HIT-45/ScholarshipFinder` | Source code |

---

## 🎓 Default Login Credentials

After deployment, use these to test:
- **Email**: `admin@eduequity.com`
- **Password**: `admin123`

⚠️ **Change these in production!**

---

## 📱 Share Your Project

Add to resume/portfolio:
```
🌐 Live Demo: https://eduequity.vercel.app
📚 GitHub: https://github.com/R0HIT-45/ScholarshipFinder
🔧 Tech Stack: Next.js, NestJS, PostgreSQL, TypeScript
```

---

## 🐛 Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| **500 Error** | Check backend logs in Render |
| **CORS Error** | Verify FRONTEND_URL matches Vercel domain |
| **Login fails** | Verify DATABASE_URL is set correctly |
| **Slow first load** | Normal on free tier (30s wake-up time) |
| **Build fails** | Check logs, verify all dependencies installed |

---

## 💡 Pro Tips

1. **Free Tier Limits**:
   - Backend sleeps after 15 min inactivity
   - First request takes 30-60 seconds (cold start)
   - Database expires after 90 days on free plan

2. **Upgrade to Paid** ($7/month each):
   - Backend stays awake 24/7
   - Faster response times
   - Persistent database
   - More resources

3. **Auto-Deploy**:
   - Push to GitHub → Both auto-deploy!
   - Frontend: ~2 minutes
   - Backend: ~5 minutes

4. **Monitoring**:
   - Render: Check "Logs" tab
   - Vercel: Check "Deployments" tab

---

## 🎉 Next Steps

1. ✅ Deploy backend to Render
2. ✅ Deploy frontend to Vercel
3. ✅ Test login functionality
4. ✅ Create scholarships via admin panel
5. ✅ Share your project link!
6. 🎯 Add custom domain (optional)
7. 📊 Set up analytics (optional)
8. 🔒 Update security settings

---

For detailed instructions, see [DEPLOYMENT.md](DEPLOYMENT.md)
