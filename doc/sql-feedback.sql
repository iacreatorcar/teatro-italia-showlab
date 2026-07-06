drop table if exists feedback cascade;

create table feedback (
  id uuid primary key default gen_random_uuid(),
  show_id uuid references shows(id) on delete set null,
  rating_overall int not null check (rating_overall between 1 and 5),
  rating_content int not null check (rating_content between 1 and 5),
  rating_acting int not null check (rating_acting between 1 and 5),
  rating_staging int not null check (rating_staging between 1 and 5),
  rating_audio int not null check (rating_audio between 1 and 5),
  duration_feedback text check (duration_feedback in ('troppo-breve', 'giusta', 'troppo-lungo')),
  rating_value int check (rating_value between 1 and 5),
  rating_comfort int check (rating_comfort between 1 and 5),
  recommend text check (recommend in ('si', 'forse', 'no')),
  positive_aspects text[] default '{}',
  improvements text,
  email text,
  created_at timestamptz not null default now()
);

create index feedback_show_id_idx on feedback(show_id);
