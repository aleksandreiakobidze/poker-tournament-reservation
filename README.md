# Poker Tournament Reservation - Monorepo

A complete poker tournament reservation system with frontend, backend options, and professional admin panel.

## Project Structure

- `backend-node` – Node.js / Express REST API (fast dev & easy to run)
- `backend-java` – Java Spring Boot REST API (enterprise-grade option)
- `frontend-vue` – Vue 3 + Vite frontend with admin panel

## Quick Start (PowerShell)

### Run Vue Frontend + Admin Panel
```powershell
cd frontend-vue
npm install
npm run dev
```
- **Main App**: http://localhost:5173/
- **Admin Panel**: http://localhost:5173/admin.html
  - Username: `admin`
  - Password: `king`

### Run Node.js Backend (Dev)
```powershell
cd backend-node
npm install
npm run dev
```
Server runs on http://localhost:3000

### Run Java Backend (Maven)
```powershell
cd backend-java
mvn spring-boot:run
```
Server runs on http://localhost:8080

## Features

### 🎮 Customer Reservation App
- Beautiful Kings Club branding
- Real-time seat reservation
- Automatic waiting list management
- Duplicate reservation detection by phone
- QR code check-in
- Responsive design (mobile & desktop)

### 🔐 Admin Panel
Access via `/admin.html` with credentials:
- **Username**: admin
- **Password**: king

**Admin Capabilities**:
- 📊 Dashboard with live statistics
- 📋 View, search, filter all reservations
- 🎰 Visual table seating layout
- ⏳ Waiting list management with promotion
- ✓ Manual check-in processing
- 📥 Export to CSV
- 🔄 Tournament reset
- Status management (Reserved, Waiting, Checked In)

See [ADMIN_PANEL.md](frontend-vue/ADMIN_PANEL.md) for full documentation.

## Technology Stack

- **Frontend**: Vue 3, Vite, Scoped CSS
- **Backend**: Node.js/Express OR Java/Spring Boot
- **Storage**: localStorage (frontend) + In-memory (backend)
- **Architecture**: Monorepo with independent services

## API Endpoints (Both Backends)

### POST /reserve
Reserve a seat or join waiting list
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "phone": "555-123-4567",
  "email": "john@example.com"
}
```

### POST /checkin
Check in with QR code
```json
{
  "qr_code": "your-uuid"
}
```

### GET /reservation/:phone
Get reservation details by phone number

### GET /admin/reservations
Get all reservations (admin only)

## Data Model

```
Reservation {
  id: UUID
  first_name: string
  last_name: string
  phone: string (unique)
  email: string (optional)
  status: 'reserved' | 'waiting' | 'checked_in'
  table_number: 1-6 (null if waiting)
  seat_number: 1-9 (null if waiting)
  waiting_position: number (null if reserved)
  qr_code: string (UUID-based)
  checkin_time: ISO timestamp
  created_at: ISO timestamp
}
```

## Tournament Layout

- **Tables**: 6 premium poker tables
- **Seats per table**: 9 seats
- **Total Capacity**: 54 players
- **Waiting List**: Unlimited (manages overflow)

## Development

### Install All Dependencies
```powershell
npm run install:all
```

### Run Frontend Dev Server
```powershell
npm run dev:vue
```

### Run Node Backend Dev
```powershell
npm run dev:node
```

### Build Vue for Production
```powershell
npm run build:vue
```

### Run Java Backend
```powershell
npm run java:run
```

## Deployment

All services include Docker support for containerized deployment.

## Known Limitations (MVP)

- ⚠️ Data persistence: In-memory only (add Postgres for production)
- ⚠️ No real QR code generation yet (placeholder text)
- ⚠️ No authentication for public endpoints (add JWT for prod)
- ⚠️ Admin password hardcoded (use environment variables)
- ⚠️ No email/SMS notifications
- ⚠️ No payment integration

---

**Kings Club** - Premium Poker Tournament Reservation System | 2025
