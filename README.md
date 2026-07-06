# Showtime ERP

Smart management platform for theatres and performance venues: show scheduling, artist profiles, foyer digital signage, LED wall, and production dashboard in one place.

## Tech stack

- **Frontend**: Next.js 16 (App Router, Turbopack), React, Tailwind CSS
- **Backend**: Supabase (Postgres + Storage), direct client SDK access
- **Hosting**: Netlify (automatic deploy from Git)

## Main features

- **Show schedule** — public listing with detail view and photo slideshow gallery
- **Artist profiles** — filter by role, photo fit (contain/cover), multi-photo gallery
- **Foyer TV Digital Signage** — content management for screens (1-4), 16:9/9:16 format
- **LED Wall** — configurable scrolling text
- **Admin** — full management panel (shows, artists, print content, foyer)
- **Artistic Admin** (`/admin/artistico`) — department-based dashboard with sidebar (Planning, Staff, Cast, Digital Signage, Ticketing, Administration)
- **Landing page** (`/welcome`) — product presentation page

## Local setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

See [doc/avvio-locale.html](doc/avvio-locale.html) (Italian) for the full guide.

## Configuration

Create `.env.local` with Supabase variables:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SECRET_KEY=...
```

## Page structure

| Route | Description |
|---|---|
| `/` | Public home (Artists / Schedule / Admin tabs) |
| `/artists` | Artist profiles page |
| `/schedule` | Show schedule page |
| `/tv` | Fullscreen foyer screen view (`?screen=1-4`) |
| `/admin` | Full admin panel |
| `/admin/artistico` | Department dashboard with sidebar |
| `/welcome` | Product marketing landing page |

## Documentation

Project documentation (TV setup, ERP plan, changelog, SQL scripts) is in [doc/](doc/), written in Italian (product's target market):

- [avvio-locale.html](doc/avvio-locale.html) — local setup guide
- [setup-tv.html](doc/setup-tv.html) — foyer screen physical setup (Raspberry Pi / Fire TV Stick)
- [piano-erp-teatro.html](doc/piano-erp-teatro.html) — detailed technical roadmap by phase
- [roadmap-showtime-erp.html](doc/roadmap-showtime-erp.html) — product roadmap (target audience, business model, versions)
- [changelog.html](doc/changelog.html) — change history
- [sql-nuove-colonne.sql](doc/sql-nuove-colonne.sql), [sql-artist-photos.sql](doc/sql-artist-photos.sql) — applied Supabase migrations

## Deploy

The project is connected to Netlify with automatic deploy on push to the main branch. Build command: `npm run build`.
