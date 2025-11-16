const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create database file in the backend-node directory
const DB_PATH = path.join(__dirname, 'tournament.db');

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database:', DB_PATH);
    initializeDatabase();
  }
});

function initializeDatabase() {
  db.serialize(() => {
    // Reservations table
    db.run(`
      CREATE TABLE IF NOT EXISTS reservations (
        id TEXT PRIMARY KEY,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        phone TEXT NOT NULL UNIQUE,
        email TEXT,
        status TEXT NOT NULL DEFAULT 'reserved',
        table_number INTEGER,
        seat_number INTEGER,
        waiting_position INTEGER,
        qr TEXT,
        timestamp TEXT NOT NULL,
        checkin_time TEXT,
        created_at TEXT NOT NULL
      )
    `);

    // Settings table
    db.run(`
      CREATE TABLE IF NOT EXISTS settings (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        table_quantity INTEGER NOT NULL DEFAULT 6,
        seat_quantity INTEGER NOT NULL DEFAULT 9,
        updated_at TEXT
      )
    `);

    // Tournament info table
    db.run(`
      CREATE TABLE IF NOT EXISTS tournament_info (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        name TEXT NOT NULL,
        date TEXT,
        time TEXT,
        location TEXT,
        entry_fee TEXT,
        prize_pool TEXT,
        description TEXT,
        updated_at TEXT
      )
    `);

    // Insert default settings if not exists
    db.run(`
      INSERT OR IGNORE INTO settings (id, table_quantity, seat_quantity, updated_at)
      VALUES (1, 6, 9, datetime('now'))
    `);

    // Insert default tournament info if not exists
    db.run(`
      INSERT OR IGNORE INTO tournament_info (
        id, name, date, time, location, entry_fee, prize_pool, description, updated_at
      )
      VALUES (
        1,
        'Kings Club Poker Tournament',
        '2025-11-20',
        '20:00',
        '5 გიორგი ტოვსტონოგოვის ქუჩა, Tbilisi',
        '100 GEL',
        '5000 GEL',
        'Join us for an exciting poker tournament with professional dealers and premium tables. Registration starts 30 minutes before the game.',
        datetime('now')
      )
    `);
  });
}

// Helper functions
const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};

const dbGet = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const dbAll = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

module.exports = { db, dbRun, dbGet, dbAll };

