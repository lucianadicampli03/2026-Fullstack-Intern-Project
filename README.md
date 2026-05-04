# Definitely not Wordle

Small full-stack word game: **Vite + React** frontend, **Express** backend.

## Run locally

Terminal 1 — API:

```bash
cd backend && npm install && npm run dev
```

Terminal 2 — UI:

```bash
cd frontend && npm install && npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`). Requests use `/api` → proxied to `http://localhost:3001`.

## Deploy (Render API + Vercel or Netlify UI)

### 1. Backend — Render

1. [Render](https://render.com) → **New +** → **Web Service** → connect this repo.
2. **Root directory:** `backend`
3. **Build command:** `npm install`
4. **Start command:** `npm start`
5. Deploy and copy the service URL (e.g. `https://your-api.onrender.com`).

Free tier apps sleep after idle; first request after sleep can take ~30s.

### 2. Frontend — Vercel or Netlify

Either platform:

1. **New project** → import repo.
2. **Root directory:** `frontend`
3. **Build command:** `npm run build`
4. **Output directory:** `dist`
5. **Environment variable** (must be set before/at build):

   | Name            | Value                         |
   |----------------|-------------------------------|
   | `VITE_API_URL` | `https://your-api.onrender.com` (no trailing slash) |

Vite bakes `VITE_*` into the build, so redeploy the frontend after you change this.

### 3. Smoke test

Open the deployed site, play one game. If the browser console shows blocked requests, confirm `VITE_API_URL` matches Render exactly and that the Render service is awake.
