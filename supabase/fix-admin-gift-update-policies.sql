drop policy if exists "Authenticated can create gifts" on public.gifts;
drop policy if exists "Authenticated can update gifts" on public.gifts;
drop policy if exists "Authenticated can read all gifts" on public.gifts;

create policy "Authenticated can read all gifts"
on public.gifts for select
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
