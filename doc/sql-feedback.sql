create table if not exists feedback (
  id uuid primary key default gen_random_uuid(),
  show_id uuid references shows(id) on delete set null,
  rating_show int not null check (rating_show between 1 and 5),
  rating_venue_access int not null check (rating_venue_access between 1 and 5),
  would_recommend boolean not null default true,
  review text,
  created_at timestamptz not null default now()
);

create index if not exists feedback_show_id_idx on feedback(show_id);
