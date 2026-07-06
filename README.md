# Showtime ERP

Gestionale smart per teatri e sale spettacolo: palinsesto, schede artisti, digital signage TV foyer, LED wall e dashboard produzioni in un'unica piattaforma.

## Stack tecnico

- **Frontend**: Next.js 16 (App Router, Turbopack), React, Tailwind CSS
- **Backend**: Supabase (Postgres + Storage), accesso diretto via client SDK
- **Hosting**: Netlify (deploy automatico da Git)

## Funzionalità principali

- **Palinsesto spettacoli** — elenco pubblico con scheda dettaglio e galleria foto a slide
- **Schede artisti** — filtri per ruolo, foto (adatta/originale), galleria foto multipla
- **Digital Signage TV Foyer** — gestione contenuti per schermi (1-4), formato 16:9/9:16
- **LED Wall** — testo scorrevole configurabile
- **Admin** — pannello gestione completo (spettacoli, artisti, contenuti stampa, foyer)
- **Admin Artistico** (`/admin/artistico`) — dashboard a reparti con sidebar (Pianificazione, Personale, Cast, Digital Signage, Biglietteria, Amministrazione)
- **Landing page** (`/welcome`) — pagina di presentazione del prodotto

## Avvio in locale

```bash
npm install
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000).

Vedi [doc/avvio-locale.html](doc/avvio-locale.html) per la guida completa.

## Configurazione

Crea `.env.local` con le variabili Supabase:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SECRET_KEY=...
```

## Struttura pagine

| Route | Descrizione |
|---|---|
| `/` | Home pubblica (tab Artisti / Palinsesto / Admin) |
| `/artists` | Pagina schede artisti |
| `/schedule` | Pagina palinsesto |
| `/tv` | Vista fullscreen per schermi foyer (`?screen=1-4`) |
| `/admin` | Pannello amministrazione completo |
| `/admin/artistico` | Dashboard a reparti con sidebar |
| `/welcome` | Landing page marketing prodotto |

## Documentazione

Tutta la documentazione di progetto (setup TV fisiche, piano ERP, changelog, script SQL) è in [doc/](doc/):

- [avvio-locale.html](doc/avvio-locale.html) — come avviare in locale
- [setup-tv.html](doc/setup-tv.html) — setup fisico schermi foyer (Raspberry Pi / Fire TV Stick)
- [piano-erp-teatro.html](doc/piano-erp-teatro.html) — roadmap tecnica dettagliata a fasi
- [roadmap-showtime-erp.html](doc/roadmap-showtime-erp.html) — roadmap di prodotto (target, modello commerciale, versioni)
- [changelog.html](doc/changelog.html) — storico modifiche
- [sql-nuove-colonne.sql](doc/sql-nuove-colonne.sql), [sql-artist-photos.sql](doc/sql-artist-photos.sql) — migrazioni Supabase applicate

## Deploy

Il progetto è collegato a Netlify con deploy automatico su push al branch principale. Build command: `npm run build`.
