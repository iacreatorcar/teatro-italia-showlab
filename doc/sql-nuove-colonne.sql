-- 1. Scelta esplicita adatta/originale per foto artista
alter table artists
  add column if not exists photo_fit text not null default 'contain'
  check (photo_fit in ('contain', 'cover'));

-- 2. Galleria foto multiple per spettacolo (scheda con slide)
create table if not exists show_photos (
  id uuid primary key default gen_random_uuid(),
  show_id uuid not null references shows(id) on delete cascade,
  url text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists show_photos_show_id_idx on show_photos(show_id);
