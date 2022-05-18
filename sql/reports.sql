create table reports(
    report_id uuid primary key default gen_random_uuid(),
    name text not null,
    note text,
    score_before int,
    score_after int,
    created_by uuid references public.trainers on delete set null,
    player_id uuid references public.players on delete cascade not null,
    time timestamptz unique default NOW() not null,
    unique (name, player_id),

    constraint score_before_range check (score_before between 0 and 100),
    constraint score_after_range check (score_after between 0 and 100)
);

alter table reports enable row level security;

create policy "Reports are viewable by authenticated users."
    on reports for select
    using ( auth.role() = 'authenticated' );

create policy "Reports can be created by authenticated users."
    on reports for insert
    with check (auth.role() = 'authenticated');

create policy "Report can only be deleted by the trainer who created the camp."
    on reports for delete
    using ( auth.uid() = created_by );

create policy "Reports can be updated by authenticated users."
    on reports for update
    using (auth.role() = 'authenticated');