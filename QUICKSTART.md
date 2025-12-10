# 🚀 Quick Start Guide - EduEquity Scholarship Platform

## System Requirements
- Node.js 18+ 
- PostgreSQL 12+
- npm or yarn

---

## Step 1: Setup PostgreSQL Database

```powershell
# Create database
psql -U postgres -c "CREATE DATABASE scholarship;"

# Verify connection
psql -U postgres -d scholarship -c "SELECT version();"
```

---

## Step 2: Backend Setup

```powershell
# Navigate to backend
cd backend

# Install dependencies
npm install

# Start development server
npm run start:dev
```

**Expected output:**
```
[NestFactory] Starting Nest application...
[InstanceLoader] AppModule dependencies initialized
Listening on port 3001
```

---

## Step 3: Frontend Setup (New Terminal)

```powershell
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

**Expected output:**
```
 ▲ Next.js 16.0.8
 - Local:        http://localhost:3000
 - Environments: .env.local
```

---

## Step 4: Access the Application

Open your browser and navigate to:
- **Frontend**: `http://localhost:3000`
- **Backend API**: `http://localhost:3001`

---

## Step 5: Test Login

### First Time Setup
An admin account is automatically created on first backend start:
```
Email: admin@eduequity.com
Password: admin123
```

### Login Flow
1. Click "Login" on homepage
2. Enter credentials above
3. Click "Sign In"
4. Redirected to Admin Dashboard

---

## 📋 Available Routes

### Public Routes
- `/` - Home page
- `/login` - Login page
- `/register` - Registration page
- `/scholarships` - Browse all scholarships
- `/recommendations` - AI recommendations

### Protected Routes (Login Required)
- `/dashboard` - User dashboard
- `/admin` - Admin dashboard
- `/admin/users` - User management
- `/forgot-password` - Password reset

---

## 🎯 Quick Test Scenarios

### Scenario 1: Register New Account
1. Go to `/register`
2. Fill form:
   - Name: John Doe
   - Email: john@example.com
   - Password: Test123456
   - Confirm: Test123456
3. Click "Create Account"
4. Redirected to dashboard

### Scenario 2: Apply for Scholarship
1. Go to `/` or `/scholarships`
2. Click "Apply Now" on any scholarship
3. Fill application form
4. Submit

### Scenario 3: Admin Create Scholarship
1. Login as admin
2. Go to `/admin`
3. Click "+ New Scholarship"
4. Fill form:
   - Title: STEM Excellence Award
   - Description: For computer science students
   - Amount: ₹100,000
   - Deadline: 2025-12-31
5. Click "Create"

### Scenario 4: View Recommendations
1. Login as user
2. Click "🧠 AI Recommendations" in header
3. See scholarships ranked by match score

### Scenario 5: Export Applications (Admin)
1. Login as admin
2. Go to `/admin`
3. Click "Export CSV"
4. File downloads with all applications

---

## 🔍 API Testing

### Test Login
```powershell
$body = @{
    email = "admin@eduequity.com"
    password = "admin123"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:3001/auth/login" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body

$response.Content | ConvertFrom-Json | Format-List
```

### Test Get Profile
```powershell
$token = "<ACCESS_TOKEN_FROM_LOGIN>"

$headers = @{
    Authorization = "Bearer $token"
}

Invoke-WebRequest -Uri "http://localhost:3001/auth/profile" `
  -Method GET `
  -Headers $headers
```

---

## 🛠️ Common Issues

### Issue: "Connection refused" on Backend Start
**Solution**: Ensure PostgreSQL is running
```powershell
# Check PostgreSQL service
Get-Service PostgreSQL* | Select-Object Name, Status

# Start if stopped
Start-Service PostgreSQL*
```

### Issue: "Database 'scholarship' does not exist"
**Solution**: Create the database
```powershell
psql -U postgres -c "CREATE DATABASE scholarship;"
```

### Issue: Port 3001 or 3000 already in use
**Solution**: Kill the process using the port
```powershell
# Find and kill process on port 3001
Get-Process | Where-Object { $_.ProcessName -match "node" } | Stop-Process -Force

# Or use specific port in .env
```

### Issue: "Cannot find module" error
**Solution**: Reinstall dependencies
```powershell
rm -r node_modules
npm install
npm run start:dev
```

---

## 📊 Feature Checklist

- [x] User Registration & Login
- [x] JWT Authentication
- [x] Password Hashing (bcryptjs)
- [x] Admin Dashboard
- [x] User Dashboard with Stats
- [x] CRUD Scholarships
- [x] CRUD Applications
- [x] Search & Filters
- [x] Toast Notifications
- [x] Form Validation
- [x] Activity Logging
- [x] CSV Export
- [x] Dark Mode
- [x] Responsive Design
- [x] AI Recommendations
- [x] Security Headers (Helmet)
- [x] Role-based Access Control

---

## 🎨 Testing Dark Mode

1. Click the moon/sun icon in the top-right header
2. All pages switch to dark theme
3. Preference saved in localStorage

---

## 📱 Mobile Testing

1. Open DevTools (F12)
2. Click "Toggle Device Toolbar" (Ctrl+Shift+M)
3. Select mobile device from dropdown
4. All features work on mobile

---

## 🔐 Security Features

✅ Password hashing with bcryptjs  
✅ JWT token-based auth (1-day expiration)  
✅ Helmet middleware for security headers  
✅ CORS configured  
✅ Input validation on all forms  
✅ SQL injection prevention (TypeORM)  
✅ XSS protection (React escaping)  
✅ Rate limiting ready  

---

## 📞 Support

For issues or questions, check:
1. Backend logs in terminal
2. Browser console (F12)
3. Network tab in DevTools
4. Database with: `psql -U postgres -d scholarship -c "\dt"`

---

**You're all set! 🎉 Start exploring EduEquity!**
