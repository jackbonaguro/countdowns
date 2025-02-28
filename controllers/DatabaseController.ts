import { Countdown } from '@/store/useCountdowns';
import { QueryClient } from '@tanstack/react-query';
import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase;
let initialized = false;

export async function initialize() {
  if (initialized) return;

  // Create or open the database
  db = await SQLite.openDatabaseAsync('countdowns.db');

  await setupCountdownsIfNeeded();

  initialized = true;
}

export function isInitialized() {
  return initialized;
}

type CountdownModel = {
  id: number;
  title: string;
  created_at: string;
  date: string;
  time: string | null;
  emoji: string;
  color: string;
  archived: boolean;
}

async function setupCountdownsIfNeeded() {
  // Create table if it doesn't exist
  const tables = await db.getAllAsync("SELECT name FROM sqlite_schema WHERE type='table' ORDER BY name;") as { name: string }[];
  const countdownsTable = tables?.find(table => table.name === 'countdowns');
  if (!countdownsTable) {
    await db.getAllAsync(`CREATE TABLE IF NOT EXISTS countdowns (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      created_at TEXT NOT NULL,
      date TEXT NOT NULL,
      time TEXT,
      emoji TEXT NOT NULL,
      color TEXT NOT NULL,
      archived BOOLEAN NOT NULL DEFAULT FALSE
    );`);

    console.log('Created countdowns table');
  }
}

export async function refreshCountdowns(db: SQLite.SQLiteDatabase) {
  const countdownModels = await db.getAllAsync('SELECT * FROM countdowns') as CountdownModel[];

  const countdowns: Countdown[] = countdownModels.map(model => {
    return {
      id: model.id,
      title: model.title,
      date: new Date(model.date),
      time: model.time ? new Date(model.time) : undefined,
      emoji: model.emoji,
      color: model.color,
    };
  });

  return countdowns;
}

export async function createCountdown(countdown: Omit<Countdown, 'id'>, db: SQLite.SQLiteDatabase) {
  const createdAt = new Date().toISOString();
  const date = countdown.date.toISOString();
  const time = countdown.time?.toISOString() || null;

  await db.runAsync(
    'INSERT INTO countdowns (title, created_at, date, time, emoji, color, archived) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [
      countdown.title,
      createdAt,
      date,
      time,
      countdown.emoji,
      countdown.color,
      false
    ]
  );
}

export async function updateCountdown(countdown: Countdown, db: SQLite.SQLiteDatabase) {
  const date = countdown.date.toISOString();
  const time = countdown.time?.toISOString() || null;

  await db.runAsync(
    'UPDATE countdowns SET title = ?, date = ?, time = ?, emoji = ?, color = ?, archived = ? WHERE id = ?',
    [
      countdown.title,
      date,
      time,
      countdown.emoji,
      countdown.color,
      false,
      countdown.id
    ],
  );
}

export async function deleteCountdown(id: number, db: SQLite.SQLiteDatabase) {
  await db.runAsync('DELETE FROM countdowns WHERE id = ?', [id]);
}

/* async function setupCountersExample() {
  // NOTE: This logs databases, but IDK what to do if main isn't connected so it's not really useful.
  // console.log('pragma database_list', await db.getAllAsync('PRAGMA database_list'));

  // Check if the counters table exists
  const tables = await db.getAllAsync("SELECT name FROM sqlite_schema WHERE type='table' ORDER BY name;") as { name: string }[];
  const counterTable = tables?.find(table => table.name === 'counter');
  if (!counterTable) {
    await db.getAllAsync("CREATE TABLE IF NOT EXISTS counter (id INTEGER PRIMARY KEY AUTOINCREMENT, count INTEGER NOT NULL DEFAULT 0);");
  }

  // Check if counter row exists
  const counterRow = await db.getFirstAsync('SELECT * FROM counter');
  if (!counterRow) {
    await db.execAsync('INSERT INTO counter (count) VALUES (0)');
  }
}

export async function readCounter(): Promise<number> {
  const result = await db.getFirstAsync('SELECT * FROM counter') as { id: number, count: number };
  return result.count;
}

export async function writeCounter() {
  const result = await db.execAsync('UPDATE counter SET count = count + 1');
  console.log('writeCounter', result);
} */

