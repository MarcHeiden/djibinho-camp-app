create table groups(
    group_id uuid primary key default gen_random_uuid(),
    name text not null,
    created_by uuid references public.trainers on delete set null,
    camp_id uuid references public.camps on delete cascade not null,
    time timestamptz unique default NOW() not null,
    unique (name, camp_id)
);

alter table groups enable row level security;

create policy "Groups are viewable by authenticated users."
    on groups for select
    using ( auth.role() = 'authenticated' );

create policy "Groups can be created by authenticated users."
    on groups for insert
    with check (auth.role() = 'authenticated');

create policy "Groups can only be deleted by the trainer who created the camp."
    on groups for delete
    using ( auth.uid() = created_by );

create policy "Groups can be updated by authenticated users."
    on groups for update
    using (auth.role() = 'authenticated');