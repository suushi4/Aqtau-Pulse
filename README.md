# Aqtau Pulse — City Intelligence Network

A full-stack, trilingual civic network for Aktau. The product connects residents, tourists, local organizations, businesses, and city services through a real map and a transparent issue-resolution workflow.

## Experience

- **Live city map:** real OpenStreetMap tiles, animated signal markers, category filters, popups, safe routes, weather, location, and a live activity stream.
- **City pulse:** community posts, reactions, discussions, confirmations, saved content, trends, and personalization.
- **City missions:** transparent issue Kanban with AI priority scores and interactive status progression.
- **Agenda:** cinematic event discovery and interactive attendance.
- **Explore Aktau:** local route builder, destinations, saved places, and an animated Caspian visual system.
- **Communities:** interactive neighborhood and volunteer groups.
- **City OS:** service performance, priorities, animated analytics, and export actions.
- **Profiles and impact:** reputation, achievements, levels, and measurable civic contribution.

## Design and interaction

- React 19 + Vite
- Motion animations and spring transitions
- React Leaflet + OpenStreetMap
- Lucide icon system
- Complete Russian, Kazakh, and English interface
- Light and dark modes
- Responsive desktop/mobile layouts
- Command palette (`Cmd/Ctrl + K`)
- Animated map pins, ambient gradients, event visuals, data charts, modals, drawers, toasts, hover reactions, and reduced-motion support

## Run locally

```bash
npm install
npm start
# http://localhost:3000
```

For hot reload:

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
5. Run `npm start`; `/api/health` should report `mode: "supabase"`.

Never commit `.env` or expose the service-role key in browser code. Without variables, the API uses a persistent demo database.

## Deployment

A GitHub Pages workflow is included for automatic frontend previews. In repository settings, set **Pages → Source → GitHub Actions** once. For the full API and Supabase-backed application, deploy to Render, Railway, Fly.io, or a VPS:

- Build: `npm run build`
- Start: `node --env-file-if-exists=.env server.mjs`
- Runtime: Node 20+

### Vercel + Supabase

The repository includes `vercel.json` and Vercel Functions:

- `GET /api/health` checks the runtime and Supabase configuration.
- `GET /api/reports` loads recent reports.
- `POST /api/reports` validates and saves a new report.

Set `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and the server-only
`SUPABASE_SERVICE_ROLE_KEY` in Vercel Project Settings. Never prefix the
service-role key with `VITE_`.
