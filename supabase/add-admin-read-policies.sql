create policy "Authenticated can read rsvps"
on public.rsvps for select
to authenticated
using (true);

create policy "Authenticated can read gift contributions"
on public.gift_contributions for select
to authenticated
using (true);
