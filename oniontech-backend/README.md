# OnionTech Backend API

A REST API and WebSocket server for the OnionTech Dashboard, built with Express.js and Socket.IO.

## Features

- **REST API** for metrics and storage locations
- **Real-time updates** via WebSocket (Socket.IO)
- **JSON database** (LowDB) - no database setup required
- **CORS enabled** for frontend integration

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/api/metrics` | Get current metrics |
| PUT | `/api/metrics` | Update metrics |
| GET | `/api/locations` | Get all storage locations |
| PATCH | `/api/locations/:id` | Update a location |

## WebSocket Events

- `metrics:update` - Real-time metric updates
- `locations:update` - Real-time location updates

## Local Development

```bash
npm install
npm run dev
```

Server runs at `http://localhost:4000`

## Deploy to Render (Free Hosting)

### Option 1: Deploy via Blueprint (Recommended)

1. Push your code to GitHub
2. Go to [dashboard.render.com](https://dashboard.render.com)
3. Click **"New +"** → **"Blueprint"**
4. Connect your GitHub repo
5. Render will automatically detect `render.yaml` and deploy

### Option 2: Manual Deploy

1. Push your code to GitHub
2. Go to [dashboard.render.com](https://dashboard.render.com)
3. Click **"New +"** → **"Web Service"**
4. Connect your GitHub repo
5. Configure:
   - **Name**: `oniontech-api`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node src/server.js`
   - **Plan**: `Free`
6. Click **"Create Web Service"**

### After Deployment

Your API will be available at:
- `https://oniontech-api.onrender.com/health`
- `https://oniontech-api.onrender.com/api/metrics`
- `https://oniontech-api.onrender.com/api/locations`

**Note**: Free tier services spin down after 15 minutes of inactivity and take ~30 seconds to wake up.

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `4000` | Server port |
| `CLIENT_ORIGIN` | `*` | CORS origin (set to your frontend URL in production) |

## Project Structure

```
oniontech-backend/
├── src/
│   ├── server.js    # Express + Socket.IO server
│   └── db.js        # LowDB database setup
├── db.json          # Database file (auto-created)
├── package.json
├── render.yaml      # Render deployment config
└── README.md
```

## Data Model

### Metrics
```json
{
  "totalOnions": 24450,
  "temperatureC": 4.2,
  "humidityPct": 65,
  "shelfLifeDays": 72,
  "updatedAt": "2026-02-22T00:00:00.000Z"
}
```

### Locations
```json
[
  {
    "id": "warehouse-1",
    "name": "Warehouse 1",
    "status": "active",
    "temperatureC": 4.2,
    "humidityPct": 65
  }
]
```

## License

MIT
