# Aqtau Pulse

A polished full-stack civic platform for Aktau: a real OpenStreetMap-powered city pulse, issue reporting workflow, local events, tourism, communities, and a service operations center.

## Frontend

- React 19 + Vite
- Motion for fluid route, modal, list, card, counter, and notification transitions
- React Leaflet + OpenStreetMap centered on real Aktau coordinates
- Lucide icon system
- Russian, Kazakh, and English language switcher
- Dark and light themes
- Responsive desktop and mobile navigation
- Accessible focus states and reduced-motion support

## Product areas

- Live map with category filters, animated markers, popups, routes, weather, and location controls
- City pulse feed with reactions, confirmations, comments, and saved posts
- Two-step report composer with media, categories, location, and safety context
- Transparent service Kanban and AI-priority operations dashboard
- Event discovery, tourism day planner, neighborhood communities, volunteering, profiles, and reputation
- Persistent Node REST API with optional Supabase Auth/Postgres/Storage

## Run

```bash
npm install
npm start
# http://localhost:3000
```

`npm start` builds the React application and starts the Node API server.

For frontend hot reload, run the API and Vite in two terminals:

```bash
npm run server
npm run dev
# http://localhost:5173
```

## Supabase

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the SQL editor.
3. Copy `.env.example` to `.env`.
4. Set `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and the server-only `SUPABASE_SERVICE_ROLE_KEY`.
5. Run `npm start` and open `/api/health`; it should report `mode: "supabase"`.

Never commit `.env` or expose the service-role key in browser code. Without variables, the app uses a persistent demo JSON database.

## Deployment

Use Node 20+ on Render, Railway, Fly.io, or a VPS.

- Build command: `npm run build`
- Start command: `node --env-file-if-exists=.env server.mjs`
- Add Supabase values through the host's environment settings.
- Put production deployments behind HTTPS.
