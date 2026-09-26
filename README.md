# Aqtau Pulse

A responsive city social network and real-time map for Aktau residents, tourists, businesses, volunteers, and city services.

## Included

- Interactive city map with problems, events, safety alerts, places, offers, filtering, zoom, marker cards, and routes
- Real-time style feed, confirmations, comments, likes, saved items, notifications, search, and dark mode
- Full report creation flow with geolocation, media preview, validation, priorities, privacy, and drafts
- Service Kanban, priority metrics, before/after workflow, dashboard, and downloadable report
- Events, tourism day planner, communities, volunteering, reputation, achievements, emergency safety copy
- Responsive desktop/mobile PWA shell with offline asset cache
- Node REST API with persistent demo database; optional Supabase Auth/Postgres/Storage configuration
- Supabase schema with RLS, roles, report confirmation aggregation, notifications, events, and media bucket

## Run

```bash
npm start
# open http://localhost:3000
```

No installation is required; the server uses Node built-ins only.

## Supabase

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the SQL editor.
3. Copy `.env.example` to `.env` and set the three variables in your deployment environment.
4. Start the server. `/api/health` will report `mode: "supabase"`.

Without Supabase environment variables, the app works in persistent demo mode using `data/db.json` (created automatically). Do not commit `.env` or service-role credentials.

## Production checklist

- Put the app behind HTTPS (Caddy/Nginx) and configure allowed origins.
- Use Supabase Auth SMTP, CAPTCHA, MFA for service/admin roles, and rate limits.
- Replace the illustrative map background with Leaflet/OpenStreetMap or MapLibre tiles and store PostGIS coordinates.
- Add server-side image processing, EXIF stripping, content moderation, audit logs, Sentry, and backups.
- Verify emergency and official city-service integrations before representing user reports as confirmed facts.
