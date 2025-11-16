# ✅ Railway Deployment Checklist

სწრაფი შემოწმება დეპლოიმენტის წინ

---

## 📦 Before Deployment

### ✅ Code Changes (Already Done)

- [x] Frontend API URL uses environment variable
  - `frontend-vue/src/api.js` → `import.meta.env.VITE_API_URL`
- [x] Backend listens on `0.0.0.0` in production
  - `backend-node/index.js` → PORT and HOST configured
- [x] Railway configuration files created
  - `railway.json` ✅
  - `nixpacks.toml` ✅
  - `.dockerignore` ✅
- [x] Node engine versions specified
  - `backend-node/package.json` → `"node": ">=18.0.0"`
- [x] CORS enabled for all origins
  - `backend-node/index.js` → `app.use(cors())`

### 📁 Files Created

```
✅ railway.json              - Railway configuration
✅ nixpacks.toml             - Nixpacks build configuration
✅ .dockerignore             - Docker ignore patterns
✅ backend-node/.dockerignore
✅ .gitignore                - Updated with env files
✅ RAILWAY_DEPLOYMENT.md     - Full deployment guide
✅ RAILWAY_QUICK_START.md    - 5-minute quick start
✅ DEPLOYMENT_CHECKLIST.md   - This file
```

### 📝 Environment Files (Manual Creation Needed)

Since `.env` files are in `.gitignore`, manually create:

**frontend-vue/.env.production** (after backend deployment):
```env
VITE_API_URL=https://your-backend-url.railway.app
```

**frontend-vue/.env.development** (for local dev):
```env
VITE_API_URL=http://localhost:3000
```

---

## 🚀 Deployment Steps

### Step 1: Push to GitHub

```bash
# Check git status
git status

# Add all changes
git add .

# Commit
git commit -m "Prepare for Railway deployment"

# Push to GitHub (create repo first if needed)
git push origin main
```

### Step 2: Deploy Backend to Railway

1. Go to [railway.app](https://railway.app)
2. **New Project** → **Deploy from GitHub repo**
3. Select your repository
4. Configure service:
   - Root Directory: `backend-node`
   - Start Command: `npm start`
5. Add environment variable:
   - `NODE_ENV` = `production`
6. Generate domain (Settings → Networking)
7. Copy URL: `https://your-app-name.up.railway.app`

### Step 3: Test Backend

```bash
curl https://your-backend-url.railway.app/health
# Should return: {"status":"ok","message":"Backend is running"}
```

### Step 4: Update Frontend Config

**Manual step** (env files blocked by .gitignore):

Create `frontend-vue/.env.production`:
```env
VITE_API_URL=https://your-backend-url.railway.app
```

Commit and push:
```bash
git add frontend-vue/.env.production
git commit -m "Update production API URL"
git push
```

### Step 5: Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com)
2. **New Project** → Select your repo
3. Configure:
   - Root Directory: `frontend-vue`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Environment Variables:
   - `VITE_API_URL` = `https://your-backend-url.railway.app`
5. Deploy!

### Step 6: Test Everything

- Customer Portal: `https://your-app.vercel.app`
- Admin Panel: `https://your-app.vercel.app/admin.html`
- Make test reservation
- Check admin panel

---

## 🔍 Quick Test Commands

### Test Backend Health
```bash
curl https://your-backend-url.railway.app/health
```

### Test Settings API
```bash
curl https://your-backend-url.railway.app/admin/settings
```

### Test Tournament Info API
```bash
curl https://your-backend-url.railway.app/admin/tournament-info
```

### Test Reservation (POST)
```bash
curl -X POST https://your-backend-url.railway.app/reserve \
  -H "Content-Type: application/json" \
  -d '{"first_name":"Test","last_name":"User","phone":"555-1234","email":"test@example.com"}'
```

---

## ⚠️ Important Notes

### Database Persistence

**SQLite on Railway is ephemeral** - database resets on restart!

**Solutions:**

**Option A: Add Railway Volume** (Recommended for SQLite)
```
Railway Dashboard → Service → Volumes → + New Volume
Mount Path: /app/backend-node
```

**Option B: Use PostgreSQL** (Recommended for Production)
```
Railway Dashboard → + New → Database → PostgreSQL
```
Then update backend code to use PostgreSQL.

### CORS Configuration

Current: Allows all origins
```javascript
app.use(cors());
```

For production, lock down to specific domains:
```javascript
app.use(cors({
  origin: [
    'https://your-frontend.vercel.app',
    'http://localhost:5173'
  ]
}));
```

---

## 📊 Expected Results

### Backend (Railway)
- ✅ URL: `https://your-app-name.up.railway.app`
- ✅ Health check responds: `/health`
- ✅ All API endpoints working
- ✅ Database connected
- ⚠️ Database ephemeral (add Volume or use PostgreSQL)

### Frontend (Vercel)
- ✅ URL: `https://your-app.vercel.app`
- ✅ Customer portal loads
- ✅ Admin panel accessible at `/admin.html`
- ✅ Can make reservations
- ✅ Data persists in backend

---

## 🆘 Troubleshooting

### Backend Not Starting
```
1. Check Railway logs
2. Verify package.json dependencies
3. Check node version (should be 18+)
4. Verify database.js exists
```

### Frontend Can't Connect
```
1. Check .env.production has correct URL
2. Verify backend URL includes https://
3. Check browser console for errors
4. Test backend health endpoint
```

### CORS Errors
```
1. Verify backend has app.use(cors())
2. Check frontend URL in browser matches Vercel URL
3. Test API with curl (bypasses CORS)
```

### Database Issues
```
1. Data disappears on restart? → Add Railway Volume
2. Database locked? → Restart service
3. Need persistence? → Use PostgreSQL
```

---

## 💡 Optimization Tips

### After Successful Deployment

1. **Add Custom Domain** (Optional)
   - Railway: Settings → Networking → Custom Domain
   - Vercel: Settings → Domains → Add

2. **Enable Auto-Deploy**
   - Already enabled! Push to GitHub = Auto-deploy

3. **Monitor Usage**
   - Railway: Dashboard → Metrics
   - Vercel: Analytics tab

4. **Set up Database Backup** (if using SQLite with Volume)
   - Consider PostgreSQL for automatic backups

---

## 🎉 Success Criteria

- [ ] Backend deployed on Railway
- [ ] Backend `/health` endpoint responds
- [ ] Frontend deployed on Vercel
- [ ] Customer can make reservation
- [ ] Reservation appears in Admin Panel
- [ ] Settings can be updated
- [ ] Tournament info displays correctly
- [ ] Both languages (EN/KA) work
- [ ] Database persists (Volume or PostgreSQL)

---

## 📚 Documentation

- **Full Guide**: `RAILWAY_DEPLOYMENT.md`
- **Quick Start**: `RAILWAY_QUICK_START.md`
- **This Checklist**: `DEPLOYMENT_CHECKLIST.md`

---

**Ready to deploy? Follow `RAILWAY_QUICK_START.md` for step-by-step instructions!** 🚀

