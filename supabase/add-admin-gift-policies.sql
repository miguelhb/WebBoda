create policy "Authenticated can create gifts"
on public.gifts for insert
to authenticated
with check (true);

create policy "Authenticated can update gifts"
on public.gifts for update
to authenticated
using (true)
with check (true);
