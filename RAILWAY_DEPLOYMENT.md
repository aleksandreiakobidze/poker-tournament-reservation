# 🚀 Railway Deployment Guide

პროექტის Railway.com-ზე დეპლოიმენტის სრული ინსტრუქცია

---

## 📋 Prerequisites

1. **Railway Account**: [railway.app](https://railway.app) - Sign up with GitHub
2. **GitHub Repository**: Push your code to GitHub
3. **Node.js 18+** installed locally (for testing)

---

## 🎯 Deployment Strategy

პროექტი შედგება 2 სერვისისგან:
1. **Backend (Node.js + Express + SQLite)** - API Server
2. **Frontend (Vue.js + Vite)** - Static Site

---

## 🔧 Part 1: Backend Deployment

### Step 1: Create New Project on Railway

1. გადადით [railway.app](https://railway.app)
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. აირჩიეთ თქვენი repository
5. Railway automatically detects your Node.js app

### Step 2: Configure Backend Service

1. Railway Dashboard-ში, click on your service
2. Go to **Settings** tab
3. Set **Root Directory**: `backend-node`
4. Set **Start Command**: `npm start`

### Step 3: Add Environment Variables

In **Variables** tab, add:

```env
NODE_ENV=production
PORT=3000
```

### Step 4: Deploy Backend

1. Railway automatically deploys on push
2. Wait for build to complete (~2-3 minutes)
3. Copy your backend URL (e.g., `https://your-app.railway.app`)

### Step 5: Test Backend

```bash
# Test API health
curl https://your-backend-url.railway.app/health

# Should return: {"status":"ok","message":"Backend is running"}
```

---

## 🎨 Part 2: Frontend Deployment

### Option A: Deploy on Vercel (Recommended)

Vercel უფასოა და სწრაფია Vue.js apps-თვის.

#### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

#### Step 2: Update API URL

Edit `frontend-vue/.env.production`:

```env
VITE_API_URL=https://your-backend-url.railway.app
```

#### Step 3: Deploy to Vercel

```bash
cd frontend-vue
vercel --prod
```

Follow the prompts:
- Set root directory: `frontend-vue`
- Build command: `npm run build`
- Output directory: `dist`

### Option B: Deploy Frontend on Railway (Alternative)

თუ გინდათ ორივე სერვისი Railway-ზე იყოს:

#### Step 1: Add New Service

1. Railway Dashboard → Click **"+ New"**
2. Select **"Empty Service"**
3. Name it: `frontend`

#### Step 2: Configure Frontend

Settings:
- Root Directory: `frontend-vue`
- Build Command: `npm install && npm run build`
- Start Command: `npx http-server dist -p $PORT`

Environment Variables:
```env
VITE_API_URL=https://your-backend-url.railway.app
NODE_VERSION=18
```

#### Step 3: Add http-server dependency

Edit `frontend-vue/package.json`:

```json
{
  "dependencies": {
    "vue": "^3.3.4",
    "vue-i18n": "^9.14.5",
    "http-server": "^14.1.1"
  },
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "serve": "http-server dist -p $PORT"
  }
}
```

### Option C: Netlify (Alternative)

1. Go to [netlify.com](https://netlify.com)
2. Click **"Add new site"** → **"Import from Git"**
3. Select your repository
4. Configure:
   - Base directory: `frontend-vue`
   - Build command: `npm run build`
   - Publish directory: `frontend-vue/dist`
5. Add Environment Variable:
   - Key: `VITE_API_URL`
   - Value: `https://your-backend-url.railway.app`
6. Deploy!

---

## 🔐 Security & Configuration

### Enable CORS for Production

Backend already configured with CORS. თუ გინდათ specific domains-ის შეზღუდვა:

Edit `backend-node/index.js`:

```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'https://your-frontend-url.vercel.app',
    'https://your-frontend-url.netlify.app',
    'http://localhost:5173' // for local dev
  ]
}));
```

### Database Persistence

Railway-ზე SQLite database იქნება ephemeral (რესტარტზე იშლება). Production-სთვის:

**Option 1: Use Railway Volumes (Recommended)**
1. Railway Dashboard → Service → **Volumes** tab
2. Click **"+ New Volume"**
3. Mount path: `/app/backend-node/tournament.db`

**Option 2: Upgrade to PostgreSQL**
1. Railway Dashboard → **"+ New"** → **"Database"** → **"PostgreSQL"**
2. Update backend code to use PostgreSQL instead of SQLite

---

## 🧪 Testing Deployment

### Test Backend API

```bash
# Health check
curl https://your-backend-url.railway.app/health

# Get settings
curl https://your-backend-url.railway.app/admin/settings

# Get tournament info
curl https://your-backend-url.railway.app/admin/tournament-info
```

### Test Frontend

1. Open `https://your-frontend-url.vercel.app`
2. Check if tournament info loads (from backend API)
3. Try making a reservation
4. Go to Admin Panel: `https://your-frontend-url.vercel.app/admin.html`
5. Login: `admin` / `king`
6. Verify reservations appear

---

## 🐛 Troubleshooting

### Backend Not Starting

Check Railway logs:
1. Railway Dashboard → Service → **Deployments**
2. Click latest deployment → **View Logs**

Common issues:
- ❌ `MODULE_NOT_FOUND`: Run `npm install` in `backend-node/`
- ❌ `Port already in use`: Railway sets `PORT` automatically
- ❌ `Database locked`: Add Railway Volume for persistence

### Frontend Can't Connect to Backend

1. Check `frontend-vue/.env.production`:
   ```env
   VITE_API_URL=https://your-backend-url.railway.app
   ```

2. Make sure backend URL has **https://** (not http://)

3. Check browser console for CORS errors

4. Verify backend is running:
   ```bash
   curl https://your-backend-url.railway.app/health
   ```

### CORS Errors

If you see: `Access to fetch... has been blocked by CORS policy`

Backend `index.js` should have:
```javascript
app.use(cors()); // Allow all origins
```

Or specific domains:
```javascript
app.use(cors({
  origin: ['https://your-frontend-url.vercel.app']
}));
```

---

## 📊 Monitoring

### Railway Dashboard

- **Logs**: Real-time server logs
- **Metrics**: CPU, Memory, Network usage
- **Deployments**: History of all deployments

### Health Check Endpoint

Backend has health check at `/health`:

```bash
curl https://your-backend-url.railway.app/health
# Response: {"status":"ok","message":"Backend is running"}
```

---

## 💰 Cost Estimate

### Railway (Backend)
- **Free Tier**: $5 credit/month (enough for small apps)
- **Hobby Plan**: $5/month for additional resources

### Vercel (Frontend)
- **Free Tier**: Unlimited personal projects
- Generous bandwidth & build minutes

### Netlify (Alternative Frontend)
- **Free Tier**: 100GB bandwidth/month
- 300 build minutes/month

---

## 🔄 Continuous Deployment

Railway და Vercel automatically deploy on Git push:

1. Make changes locally
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Update tournament settings"
   git push origin main
   ```
3. Railway & Vercel automatically build and deploy
4. Check deployment status in respective dashboards

---

## 📝 Environment Variables Summary

### Backend (Railway)
```env
NODE_ENV=production
PORT=3000  # Auto-set by Railway
```

### Frontend (Vercel/Netlify)
```env
VITE_API_URL=https://your-backend-url.railway.app
```

---

## ✅ Final Checklist

- [ ] Backend deployed on Railway
- [ ] Backend health check responds
- [ ] Frontend `.env.production` updated with backend URL
- [ ] Frontend deployed (Vercel/Netlify/Railway)
- [ ] Customer reservation form works
- [ ] Admin panel login works
- [ ] Reservations save to database
- [ ] Settings persist
- [ ] Tournament info displays correctly

---

## 🆘 Need Help?

1. **Railway Docs**: [docs.railway.app](https://docs.railway.app)
2. **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
3. **Check logs** in Railway Dashboard
4. **Test API** with curl/Postman
5. **Browser DevTools** → Network tab for frontend issues

---

## 🎉 Success!

თქვენი Poker Tournament Reservation System ახლა live-ია! 🚀

- **Customer Portal**: `https://your-frontend-url.vercel.app`
- **Admin Panel**: `https://your-frontend-url.vercel.app/admin.html`
- **Backend API**: `https://your-backend-url.railway.app`

---

**დამატებითი Optimization-ები:**
- SSL Certificate - ავტომატურად Railway & Vercel-ზე ✅
- CDN - Vercel/Netlify ავტომატურად იყენებს ✅
- Gzip Compression - Railway ავტომატურად ✅
- Auto-scaling - Railway Plans-ში available ✅

