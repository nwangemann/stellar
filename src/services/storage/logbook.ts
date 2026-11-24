import { openDatabaseAsync } from 'expo-sqlite';
import type { Capture, LogbookStore } from './logbook.types';

const open = async () => {
  const db = await openDatabaseAsync('logbook.db');
  await db.execAsync(
    'CREATE TABLE IF NOT EXISTS captures (id TEXT PRIMARY KEY NOT NULL, captured_at TEXT NOT NULL, body TEXT NOT NULL)',
  );
  return db;
};
let opening: ReturnType<typeof open> | undefined;
const database = () => {
  opening ??= open().catch((error) => {
    opening = undefined;
    throw error;
  });
  return opening;
};

export const logbook: LogbookStore = {
  async add(c) {
    const db = await database();
    await db.runAsync(
      'INSERT INTO captures VALUES (?, ?, ?)',
      c.id,
      c.capturedAt,
      JSON.stringify(c),
    );
  },
  async list() {
    const db = await database();
    const rows = await db.getAllAsync<{ body: string }>(
      'SELECT body FROM captures ORDER BY captured_at DESC',
    );
    return rows.map((r) => JSON.parse(r.body) as Capture);
  },
};
