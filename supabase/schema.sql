create table public.guests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text,
  invite_code text not null unique,
  plus_one_allowed boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.rsvps (
  id uuid primary key default gen_random_uuid(),
  guest_id uuid references public.guests(id) on delete set null,
  guest_name text not null,
  attending boolean not null,
  number_of_people integer not null default 1 check (number_of_people > 0),
  companion_names text[] not null default '{}',
  dietary_notes text,
  bus_needed boolean not null default false,
  bus_stop text,
  message text,
  submitted_at timestamptz not null default now()
);

create table public.gifts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  target_amount numeric(10, 2),
  image_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.gift_contributions (
  id uuid primary key default gen_random_uuid(),
  gift_id uuid not null references public.gifts(id) on delete cascade,
  guest_id uuid references public.guests(id) on delete set null,
  contributor_name text not null,
  amount numeric(10, 2) not null check (amount > 0),
  message text,
  status text not null default 'pledged',
  created_at timestamptz not null default now()
);

create table public.photos (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  caption text,
  sort_order integer not null default 0,
  visible boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.song_suggestions (
  id uuid primary key default gen_random_uuid(),
  guest_name text not null,
  song_title text not null,
  artist text,
  moment text,
  message text,
  created_at timestamptz not null default now()
);

alter table public.guests enable row level security;
alter table public.rsvps enable row level security;
alter table public.gifts enable row level security;
alter table public.gift_contributions enable row level security;
alter table public.photos enable row level security;
alter table public.song_suggestions enable row level security;

create policy "Public can read active gifts"
on public.gifts for select
using (is_active = true);

create policy "Public can read visible photos"
on public.photos for select
using (visible = true);

create policy "Public can create rsvps"
on public.rsvps for insert
with check (true);

create policy "Public can create gift contributions"
on public.gift_contributions for insert
with check (true);

create policy "Public can create song suggestions"
on public.song_suggestions for insert
with check (true);

create policy "Authenticated can read rsvps"
on public.rsvps for select
to authenticated
using (true);

create policy "Authenticated can read gift contributions"
on public.gift_contributions for select
to authenticated
using (true);

create policy "Authenticated can read song suggestions"
on public.song_suggestions for select
to authenticated
using (true);

create policy "Authenticated can create gifts"
on public.gifts for insert
to authenticated
with check (auth.role() = 'authenticated');

create policy "Authenticated can update gifts"
on public.gifts for update
to authenticated
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

create policy "Authenticated can read all gifts"
on public.gifts for select
to authenticated
using (true);

create or replace function public.gift_totals()
returns table (gift_id uuid, total_amount numeric)
language sql
security definer
set search_path = public
as $$
  select
    gift_contributions.gift_id,
    coalesce(sum(gift_contributions.amount), 0) as total_amount
  from public.gift_contributions
  group by gift_contributions.gift_id;
$$;

grant execute on function public.gift_totals() to anon, authenticated;
