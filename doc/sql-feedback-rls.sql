alter table feedback enable row level security;

create policy "public can submit feedback"
  on feedback for insert
  to anon
  with check (true);

create policy "public can read feedback"
  on feedback for select
  to anon
  using (true);
