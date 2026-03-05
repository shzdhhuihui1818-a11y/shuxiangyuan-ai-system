import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, '../../data.sqlite');

export const db = new sqlite3.Database(dbPath);

export const run = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.run(sql, params, function onRun(err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });

export const all = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });

export const get = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });

export async function initDb() {
  await run(`
    CREATE TABLE IF NOT EXISTS daily_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT UNIQUE NOT NULL,
      dine_in_revenue REAL NOT NULL,
      delivery_revenue REAL NOT NULL,
      customer_count INTEGER NOT NULL,
      total_revenue REAL NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS cost_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      period_start TEXT NOT NULL,
      period_type TEXT NOT NULL CHECK(period_type IN ('weekly', 'monthly')),
      ingredient_cost REAL NOT NULL,
      rent REAL NOT NULL,
      staff_salaries REAL NOT NULL,
      platform_commission REAL NOT NULL,
      total_cost REAL NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(period_start, period_type)
    )
  `);
}
