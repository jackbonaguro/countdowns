import { Countdown } from '@/hooks/useCountdowns';
import { type Preferences } from '@/hooks/usePreferences';
import { QueryClient } from '@tanstack/react-query';
import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase;
let initialized = false;

export async function initialize() {
  if (initialized) return;

  // Create or open the database
  db = await SQLite.openDatabaseAsync('countdowns.db');

  await setupCountdownsIfNeeded();
  await setupPreferencesIfNeeded();

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
      archived: model.archived,
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
      (typeof countdown.archived === 'boolean') ? countdown.archived : false,
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
      (typeof countdown.archived === 'boolean') ? countdown.archived: false,
      countdown.id
    ],
  );
}

export async function deleteCountdown(id: number, db: SQLite.SQLiteDatabase) {
  await db.runAsync('DELETE FROM countdowns WHERE id = ?', [id]);
}

export const DEFAULT_PREFERENCES: Preferences = {
  baseUrl: 'https://countdowns.jackbonaguro.com'
};

type PreferencesModel = {
  id: number;
  data: string;
};

async function setupPreferencesIfNeeded() {
  const tables = await db.getAllAsync("SELECT name FROM sqlite_schema WHERE type='table' ORDER BY name;") as { name: string }[];
  const preferencesTable = tables?.find(table => table.name === 'preferences');
  if (!preferencesTable) {
    await db.getAllAsync(`CREATE TABLE IF NOT EXISTS preferences (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      data TEXT NOT NULL
    );`);

    console.log('Created preferences table');
  }

  // Since this is a singleton table, we'll go ahead and insert an empty preferences object as well
  const preferences = await getPreferences(db);
  if (!preferences) {
    console.log('creating preferences row');
    try {
      await db.runAsync(
        `INSERT INTO preferences (data) VALUES (?)`,
        [ JSON.stringify(DEFAULT_PREFERENCES) ]
      );
    } catch (e) {
      console.error(e);
    }
    console.log('Created preferences row');
  }
}

export async function getPreferences(db: SQLite.SQLiteDatabase): Promise<Preferences | undefined> {
  // await db.runAsync('DROP TABLE preferences');
  const preferencesModel = await db.getFirstAsync(`SELECT * FROM preferences`) as PreferencesModel | null;
  if (!preferencesModel) return;
  return JSON.parse(preferencesModel.data) as Preferences;
}

export async function updatePreferences(patch: any, db: SQLite.SQLiteDatabase): Promise<void> {
  const existingPreferences = await getPreferences(db);
  const patchedData = {
    ...existingPreferences,
    ...patch
  };
  try {
    await db.getFirstAsync(
      `UPDATE preferences SET data = ?`,
      [ JSON.stringify(patchedData) ]
    );
  } catch (e) {
    console.error(e);
    throw e;
  }
}
