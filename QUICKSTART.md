# 🚀 Quick Start Guide - Kings Club Tournament System

## Prerequisites
- Node.js 18+ installed
- npm installed

## 🎯 Start the Application

### 1. Install Dependencies

```bash
# Install all dependencies
npm run install:all
```

### 2. Start Backend Server

```bash
cd backend-node
npm start
```

Backend will run on: `http://localhost:3000`

**API Endpoints:**
- `POST /reserve` - Create reservation
- `GET /admin/reservations` - Get all reservations  
- `PUT /admin/reservations/:phone/checkin` - Check in
- `PUT /admin/reservations/:phone/missing` - Mark missing
- `DELETE /admin/reservations/:phone` - Delete reservation
- `PUT /admin/reservations/:phone/promote` - Promote from waiting list
- `GET/PUT /admin/settings` - Tournament settings
- `GET/PUT /admin/tournament-info` - Tournament information

### 3. Start Frontend (in new terminal)

```bash
cd frontend-vue
npm run dev
```

Frontend will run on: `http://localhost:5173`

## 📱 Access Points

- **Customer Portal**: http://localhost:5173/
- **Admin Panel**: http://localhost:5173/admin.html
  - Username: `admin`
  - Password: `king`

## 🗄️ Database

SQLite database file: `backend-node/tournament.db`
- Automatically created on first run
- Contains 3 tables: `reservations`, `settings`, `tournament_info`

## 🔧 Configuration

### Change Settings
1. Login to Admin Panel
2. Go to Settings tab
3. Update:
   - Tournament Information (name, date, time, location, etc.)
   - Table & Seat Configuration

### Change Admin Password
Edit `backend-node/index.js`:
```javascript
app.post('/admin/login', (req, res) => {
  if (username === 'admin' && password === 'your-new-password') {
    // ...
  }
});
```

## 🌍 Language Support

Toggle between English and Georgian (ქართული) using the language button in the header.

## 📊 Features

### Customer Portal
- Reserve seat for tournament
- View tournament details
- Automatic seat assignment
- Waiting list support
- QR code for check-in

### Admin Panel
- **Dashboard**: Quick stats overview
- **Reservations**: View/manage all reservations
- **Tables**: Visual seating layout with color coding
  - Gray = Empty
  - Red = Reserved (not checked in)
  - Green = Checked In
- **Waiting List**: Promote players to available seats
- **Settings**: Configure tournament & tables

## 🐛 Troubleshooting

### Backend not starting?
```bash
cd backend-node
npm install
node index.js
```

### Frontend not loading data?
- Make sure backend is running on port 3000
- Check browser console for errors
- Fallback: Data loads from localStorage if API unavailable

### Reset Database
```bash
cd backend-node
rm tournament.db
# Restart backend to recreate with defaults
```

## 📝 Notes

- All data persists in SQLite database
- Frontend fallback to localStorage if backend unavailable
- Supports bilingual interface (EN/KA)
- Responsive design for mobile devices

## 🎮 Quick Test

1. Start backend & frontend
2. Open customer portal
3. Fill reservation form
4. Check admin panel to see the reservation
5. Use Tables tab to see visual seating

**Enjoy! ♠️**

