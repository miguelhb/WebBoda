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
