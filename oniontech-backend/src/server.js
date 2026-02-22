import http from 'node:http';

import cors from 'cors';
import express from 'express';
import { Server as SocketIOServer } from 'socket.io';

import { db, initDb } from './db.js';

const PORT = Number(process.env.PORT || 4000);
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || '*';

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ['https://vishal969594.github.io', 'http://localhost:4000', '*'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.get('/api/metrics', async (_req, res, next) => {
  try {
    await db.read();
    res.json(db.data.metrics);
  } catch (err) {
    next(err);
  }
});

app.put('/api/metrics', async (req, res, next) => {
  try {
    const { totalOnions, temperatureC, humidityPct, shelfLifeDays } = req.body ?? {};

    if (
      typeof totalOnions !== 'number' ||
      typeof temperatureC !== 'number' ||
      typeof humidityPct !== 'number' ||
      typeof shelfLifeDays !== 'number'
    ) {
      return res.status(400).json({
        error: 'Invalid body. Expect numbers: totalOnions, temperatureC, humidityPct, shelfLifeDays'
      });
    }

    await db.read();
    db.data.metrics = {
      totalOnions,
      temperatureC,
      humidityPct,
      shelfLifeDays,
      updatedAt: new Date().toISOString()
    };
    await db.write();

    io.emit('metrics:update', db.data.metrics);

    res.json(db.data.metrics);
  } catch (err) {
    next(err);
  }
});

app.get('/api/locations', async (_req, res, next) => {
  try {
    await db.read();
    res.json(db.data.locations);
  } catch (err) {
    next(err);
  }
});

app.patch('/api/locations/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const patch = req.body ?? {};

    await db.read();
    const idx = db.data.locations.findIndex((l) => l.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Location not found' });

    db.data.locations[idx] = { ...db.data.locations[idx], ...patch };
    await db.write();

    io.emit('locations:update', db.data.locations[idx]);

    res.json(db.data.locations[idx]);
  } catch (err) {
    next(err);
  }
});

app.use((err, _req, res, _next) => {
  // eslint-disable-next-line no-console
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: CLIENT_ORIGIN === '*' ? true : CLIENT_ORIGIN,
    credentials: true
  }
});

io.on('connection', async (socket) => {
  await db.read();
  socket.emit('metrics:update', db.data.metrics);
});

await initDb();
server.listen(PORT, '0.0.0.0', () => {
  // eslint-disable-next-line no-console
  console.log(`Backend listening on http://0.0.0.0:${PORT}`);
});
