alter table public.rsvps
add column if not exists prewedding_attending boolean not null default false;
