# backend-node

Express-based starter API for the Poker Tournament Reservation system.

Install and run (PowerShell):
```
cd backend-node; npm install; npm run dev
```

Endpoints (starter):
- `POST /reserve` – body: `{ first_name, last_name, phone, email? }`
- `POST /checkin` – body: `{ qr }` (expects URL with `id=`)
- `GET /reservation/:phone` – find reservation by phone
- `GET /admin/reservations` – list all (no auth in starter)

Notes:
- This starter uses in-memory storage for simplicity.
- For production: replace with a DB (Postgres), add auth for admin endpoints, add rate-limiting and input validation.
