create table players(
    player_id uuid primary key default gen_random_uuid(),
    name text not null,
    created_by uuid references public.trainers on delete set null,
    group_id uuid references public.groups on delete cascade not null,
    camp_id uuid references public.camps on delete cascade not null,
    time timestamptz unique default NOW() not null,
    unique (name, camp_id)
);

alter table players enable row level security;

create policy "Players are viewable by authenticated users."
    on players for select
    using ( auth.role() = 'authenticated' );

create policy "Players can be created by authenticated users."
    on players for insert
    with check (auth.role() = 'authenticated');

create policy "Player can only be deleted by the trainer who created the camp."
    on players for delete
    using ( auth.uid() = created_by );

create policy "Players can be updated by authenticated users."
    on players for update
    using (auth.role() = 'authenticated');