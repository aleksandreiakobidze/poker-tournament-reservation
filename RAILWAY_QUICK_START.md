# ⚡ Railway Deployment - Quick Start

სწრაფი დეპლოიმენტის ინსტრუქცია 5 წუთში

---

## 📦 Step 1: GitHub Repository

```bash
# Initialize git if not done
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Ready for Railway deployment"

# Create GitHub repo and push
# გადადით github.com → New Repository → Create
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

---

## 🚂 Step 2: Deploy Backend to Railway

### 2.1 Create Railway Project

1. გადადით [railway.app](https://railway.app)
2. **Sign in with GitHub**
3. Click **"New Project"**
4. Select **"Deploy from GitHub repo"**
5. აირჩიეთ თქვენი repository
6. Click **"Deploy Now"**

### 2.2 Configure Service

Railway Dashboard-ში:

1. Click on your service name
2. **Settings** → **Root Directory**: `backend-node`
3. **Settings** → **Start Command**: `npm start`
4. **Variables** → Add:
   ```
   NODE_ENV = production
   ```

### 2.3 Get Backend URL

1. **Settings** → Scroll to **Networking**
2. Click **"Generate Domain"**
3. Copy URL: `https://your-app-name.up.railway.app`

✅ **Backend deployed!** Test: `https://your-app-name.up.railway.app/health`

---

## 🎨 Step 3: Deploy Frontend to Vercel

### 3.1 Update API URL

Edit `frontend-vue/.env.production`:

```env
VITE_API_URL=https://your-app-name.up.railway.app
```

Commit changes:
```bash
git add frontend-vue/.env.production
git commit -m "Update production API URL"
git push
```

### 3.2 Deploy to Vercel

1. გადადით [vercel.com](https://vercel.com)
2. **Sign in with GitHub**
3. Click **"Add New Project"**
4. აირჩიეთ თქვენი repository
5. Configure:
   - **Root Directory**: `frontend-vue`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Add Environment Variable:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://your-app-name.up.railway.app` (თქვენი Railway URL)
7. Click **"Deploy"**

✅ **Frontend deployed!** Visit: `https://your-app.vercel.app`

---

## 🧪 Step 4: Test Everything

### Test Customer Portal
```
https://your-app.vercel.app
```
- შეავსეთ რეზერვაციის ფორმა
- დააჭირეთ "დააჯავშნეთ ადგილი"
- უნდა დაადასტუროს რეზერვაცია

### Test Admin Panel
```
https://your-app.vercel.app/admin.html
```
- Login: `admin` / `king`
- შეამოწმეთ რეზერვაციები
- Check Tables tab

---

## 🎉 Done!

თქვენი აპლიკაცია live-ია:

- 🌐 **Customer Portal**: `https://your-app.vercel.app`
- 🔐 **Admin Panel**: `https://your-app.vercel.app/admin.html`
- ⚙️ **Backend API**: `https://your-app-name.up.railway.app`

---

## 🔄 Future Updates

ცვლილებების deploy-ისთვის:

```bash
git add .
git commit -m "Your changes"
git push
```

Railway და Vercel **ავტომატურად** deploy-ს გააკეთებს!

---

## ⚠️ Important Notes

### Database Persistence

SQLite database რესტარტზე იშლება Railway-ზე. დავამატოთ Volume:

1. Railway Dashboard → Service
2. **Volumes** tab → **"+ New Volume"**
3. **Mount Path**: `/app/backend-node`
4. Save

ან გადავიდეთ PostgreSQL-ზე:
1. Railway Dashboard → **"+ New"** → **"Database"** → **"PostgreSQL"**
2. Backend-ში დავარეფაქტორებთ SQLite-ს PostgreSQL-ად

---

## 🆘 Troubleshooting

### Backend Error: "Cannot find module"
```bash
# Locally
cd backend-node
npm install
git add package-lock.json
git commit -m "Update dependencies"
git push
```

### Frontend Can't Connect
- Check `frontend-vue/.env.production` has correct Railway URL
- Redeploy Vercel after updating env
- Check Railway backend is running

### CORS Error
Backend should have:
```javascript
app.use(cors()); // in backend-node/index.js
```

Already configured ✅

---

**Need detailed guide?** See `RAILWAY_DEPLOYMENT.md`

