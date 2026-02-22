import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbFile = path.join(__dirname, '..', 'db.json');
const adapter = new JSONFile(dbFile);

const defaultData = {
  metrics: {
    totalOnions: 0,
    temperatureC: 0,
    humidityPct: 0,
    shelfLifeDays: 0,
    updatedAt: new Date(0).toISOString()
  },
  locations: []
};

export const db = new Low(adapter, defaultData);

export async function initDb() {
  await db.read();
  db.data ||= structuredClone(defaultData);
  await db.write();
}
