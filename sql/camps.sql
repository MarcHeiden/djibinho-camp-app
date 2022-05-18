create table camps(
    camp_id uuid primary key default gen_random_uuid(),
    name text unique not null,
    created_by uuid references public.trainers on delete set null,
    time timestamptz unique default NOW() not null
);

alter table camps enable row level security;

create policy "Camps are viewable by authenticated users."
    on camps for select
    using ( auth.role() = 'authenticated' );

create policy "Camps can be created by authenticated users."
    on camps for insert
    with check (auth.role() = 'authenticated');

create policy "Camps can only be deleted by the trainer who created the camp."
    on camps for delete
    using ( auth.uid() = created_by );

create policy "Camps can be updated by authenticated users."
    on camps for update
    using (auth.role() = 'authenticated');
