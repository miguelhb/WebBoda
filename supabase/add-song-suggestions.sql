create table if not exists public.song_suggestions (
  id uuid primary key default gen_random_uuid(),
  guest_name text not null,
  song_title text not null,
  artist text,
  moment text,
  message text,
  created_at timestamptz not null default now()
);

alter table public.song_suggestions enable row level security;

drop policy if exists "Public can create song suggestions"
on public.song_suggestions;

drop policy if exists "Authenticated can read song suggestions"
on public.song_suggestions;

create policy "Public can create song suggestions"
on public.song_suggestions for insert
with check (true);

create policy "Authenticated can read song suggestions"
on public.song_suggestions for select
to authenticated
using (true);
