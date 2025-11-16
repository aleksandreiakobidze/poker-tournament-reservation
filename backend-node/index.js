const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const { dbRun, dbGet, dbAll } = require('./database');

const app = express();
app.use(cors());
app.use(express.json());

// Helper function to find random available seat
async function findRandomSeat() {
  const settings = await dbGet('SELECT * FROM settings WHERE id = 1');
  const TABLES = settings.table_quantity;
  const SEATS_PER_TABLE = settings.seat_quantity;

  // Get all occupied seats
  const occupied = await dbAll(
    'SELECT table_number, seat_number FROM reservations WHERE status IN (?, ?) AND table_number IS NOT NULL',
    ['reserved', 'checked_in']
  );

  const occupiedSet = new Set(occupied.map(o => `${o.table_number}-${o.seat_number}`));

  // Try random seat first (for speed)
  for (let i = 0; i < 100; i++) {
    const table = Math.floor(Math.random() * TABLES) + 1;
    const seat = Math.floor(Math.random() * SEATS_PER_TABLE) + 1;
    const key = `${table}-${seat}`;
    if (!occupiedSet.has(key)) {
      return { table, seat };
    }
  }

  // Fallback: sequential search
  for (let t = 1; t <= TABLES; t++) {
    for (let s = 1; s <= SEATS_PER_TABLE; s++) {
      const key = `${t}-${s}`;
      if (!occupiedSet.has(key)) {
        return { table: t, seat: s };
      }
    }
  }

  return null;
}

// Count reserved seats
async function countReserved() {
  const result = await dbGet(
    'SELECT COUNT(*) as count FROM reservations WHERE status = ?',
    ['reserved']
  );
  return result.count;
}

// POST /reserve - Create new reservation
app.post('/reserve', async (req, res) => {
  try {
    const { first_name, last_name, phone, email } = req.body || {};
    
    if (!first_name || !last_name || !phone) {
      return res.status(400).json({ error: 'first_name, last_name, phone required' });
    }

    // Check if phone already exists
    const existing = await dbGet('SELECT * FROM reservations WHERE phone = ?', [phone]);
    if (existing) {
      return res.status(400).json({ error: 'Phone number already registered' });
    }

    const id = uuidv4();
    const timestamp = new Date().toISOString();

    // Try to find an available seat
    const seat = await findRandomSeat();
    const qr = `https://tournament.ge/checkin?id=${id}`;

    if (seat) {
      // Seat available - create reserved reservation
      await dbRun(
        `INSERT INTO reservations (id, first_name, last_name, phone, email, status, table_number, seat_number, qr, timestamp, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, first_name, last_name, phone, email || null, 'reserved', seat.table, seat.seat, qr, timestamp, timestamp]
      );

      return res.json({
        status: 'reserved',
        table_number: seat.table,
        seat_number: seat.seat,
        qr,
        name: `${first_name} ${last_name}`,
        phone,
        email
      });
    } else {
      // No seats available - add to waiting list
      const waitingCountResult = await dbGet(
        'SELECT COUNT(*) as count FROM reservations WHERE status = ?',
        ['waiting']
      );
      const waiting_position = waitingCountResult.count + 1;

      await dbRun(
        `INSERT INTO reservations (id, first_name, last_name, phone, email, status, waiting_position, qr, timestamp, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, first_name, last_name, phone, email || null, 'waiting', waiting_position, qr, timestamp, timestamp]
      );

      return res.json({
        status: 'waiting',
        waiting_position,
        qr,
        name: `${first_name} ${last_name}`,
        phone,
        email
      });
    }
  } catch (err) {
    console.error('Error in POST /reserve:', err);
    return res.status(500).json({ error: err.message });
  }
});

// GET /admin/reservations - Get all reservations
app.get('/admin/reservations', async (req, res) => {
  try {
    const reservations = await dbAll('SELECT * FROM reservations ORDER BY created_at DESC');
    const formattedReservations = reservations.map(r => ({
      ...r,
      name: `${r.first_name} ${r.last_name}`
    }));
    res.json({ reservations: formattedReservations });
  } catch (err) {
    console.error('Error in GET /admin/reservations:', err);
    return res.status(500).json({ error: err.message });
  }
});

// PUT /admin/reservations/:phone/checkin - Mark as checked in
app.put('/admin/reservations/:phone/checkin', async (req, res) => {
  try {
    const { phone } = req.params;
    const reservation = await dbGet('SELECT * FROM reservations WHERE phone = ?', [phone]);
    
    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }

    if (reservation.status !== 'reserved') {
      return res.status(400).json({ error: 'Can only check in reserved status' });
    }

    const checkin_time = new Date().toISOString();
    await dbRun(
      'UPDATE reservations SET status = ?, checkin_time = ? WHERE phone = ?',
      ['checked_in', checkin_time, phone]
    );

    res.json({ success: true, message: 'Checked in successfully' });
  } catch (err) {
    console.error('Error in PUT /admin/reservations/:phone/checkin:', err);
    return res.status(500).json({ error: err.message });
  }
});

// PUT /admin/reservations/:phone/missing - Mark as missing
app.put('/admin/reservations/:phone/missing', async (req, res) => {
  try {
    const { phone } = req.params;
    await dbRun(
      'UPDATE reservations SET status = ?, table_number = NULL, seat_number = NULL WHERE phone = ?',
      ['missing', phone]
    );
    res.json({ success: true, message: 'Marked as missing' });
  } catch (err) {
    console.error('Error in PUT /admin/reservations/:phone/missing:', err);
    return res.status(500).json({ error: err.message });
  }
});

// DELETE /admin/reservations/:phone - Delete reservation
app.delete('/admin/reservations/:phone', async (req, res) => {
  try {
    const { phone } = req.params;
    await dbRun('DELETE FROM reservations WHERE phone = ?', [phone]);
    res.json({ success: true, message: 'Reservation deleted' });
  } catch (err) {
    console.error('Error in DELETE /admin/reservations/:phone:', err);
    return res.status(500).json({ error: err.message });
  }
});

// DELETE /admin/reservations/all - Delete all reservations (Reset tournament)
app.delete('/admin/reservations/all', async (req, res) => {
  try {
    await dbRun('DELETE FROM reservations');
    res.json({ success: true, message: 'All reservations deleted' });
  } catch (err) {
    console.error('Error in DELETE /admin/reservations/all:', err);
    return res.status(500).json({ error: err.message });
  }
});

// PUT /admin/reservations/:phone/promote - Promote from waiting list
app.put('/admin/reservations/:phone/promote', async (req, res) => {
  try {
    const { phone } = req.params;
    const reservation = await dbGet('SELECT * FROM reservations WHERE phone = ?', [phone]);
    
    if (!reservation || reservation.status !== 'waiting') {
      return res.status(400).json({ error: 'Invalid reservation for promotion' });
    }

    const seat = await findRandomSeat();
    if (!seat) {
      return res.status(400).json({ error: 'No available seats' });
    }

    const checkin_time = new Date().toISOString();
    await dbRun(
      'UPDATE reservations SET status = ?, table_number = ?, seat_number = ?, waiting_position = NULL, checkin_time = ? WHERE phone = ?',
      ['checked_in', seat.table, seat.seat, checkin_time, phone]
    );

    // Recalculate waiting positions
    const waitingList = await dbAll(
      'SELECT phone, waiting_position FROM reservations WHERE status = ? ORDER BY waiting_position',
      ['waiting']
    );
    
    for (let i = 0; i < waitingList.length; i++) {
      await dbRun(
        'UPDATE reservations SET waiting_position = ? WHERE phone = ?',
        [i + 1, waitingList[i].phone]
      );
    }

    res.json({ 
      success: true, 
      message: 'Promoted and checked in',
      table: seat.table,
      seat: seat.seat
    });
  } catch (err) {
    console.error('Error in PUT /admin/reservations/:phone/promote:', err);
    return res.status(500).json({ error: err.message });
  }
});

// GET /admin/settings - Get settings
app.get('/admin/settings', async (req, res) => {
  try {
    const settings = await dbGet('SELECT * FROM settings WHERE id = 1');
    res.json(settings);
  } catch (err) {
    console.error('Error in GET /admin/settings:', err);
    return res.status(500).json({ error: err.message });
  }
});

// PUT /admin/settings - Update settings
app.put('/admin/settings', async (req, res) => {
  try {
    const { table_quantity, seat_quantity } = req.body;
    const updated_at = new Date().toISOString();
    
    await dbRun(
      'UPDATE settings SET table_quantity = ?, seat_quantity = ?, updated_at = ? WHERE id = 1',
      [table_quantity, seat_quantity, updated_at]
    );
    
    res.json({ success: true, message: 'Settings updated' });
  } catch (err) {
    console.error('Error in PUT /admin/settings:', err);
    return res.status(500).json({ error: err.message });
  }
});

// GET /admin/tournament-info - Get tournament info
app.get('/admin/tournament-info', async (req, res) => {
  try {
    const info = await dbGet('SELECT * FROM tournament_info WHERE id = 1');
    res.json(info);
  } catch (err) {
    console.error('Error in GET /admin/tournament-info:', err);
    return res.status(500).json({ error: err.message });
  }
});

// PUT /admin/tournament-info - Update tournament info
app.put('/admin/tournament-info', async (req, res) => {
  try {
    const { name, date, time, location, entry_fee, prize_pool, description } = req.body;
    const updated_at = new Date().toISOString();
    
    await dbRun(
      `UPDATE tournament_info 
       SET name = ?, date = ?, time = ?, location = ?, entry_fee = ?, prize_pool = ?, description = ?, updated_at = ?
       WHERE id = 1`,
      [name, date, time, location, entry_fee, prize_pool, description, updated_at]
    );
    
    res.json({ success: true, message: 'Tournament info updated' });
  } catch (err) {
    console.error('Error in PUT /admin/tournament-info:', err);
    return res.status(500).json({ error: err.message });
  }
});

// Initialize database and start server
const { initializeDatabase } = require('./database');
initializeDatabase().then(() => {
  const PORT = process.env.PORT || 3000;
  const HOST = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';
  
  app.listen(PORT, HOST, () => {
    console.log(`🚀 Backend server running on ${HOST}:${PORT}`);
    console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log('');
    console.log('📍 Available endpoints:');
    console.log(`   GET    /health`);
    console.log(`   POST   /reserve`);
    console.log(`   GET    /reservation/:phone`);
    console.log(`   POST   /checkin`);
    console.log(`   GET    /admin/reservations`);
    console.log(`   PUT    /admin/reservations/:phone/checkin`);
    console.log(`   PUT    /admin/reservations/:phone/missing`);
    console.log(`   DELETE /admin/reservations/:phone`);
    console.log(`   DELETE /admin/reservations/all`);
    console.log(`   PUT    /admin/reservations/:phone/promote`);
    console.log(`   GET    /admin/settings`);
    console.log(`   PUT    /admin/settings`);
    console.log(`   GET    /admin/tournament-info`);
    console.log(`   PUT    /admin/tournament-info`);
  });
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});
