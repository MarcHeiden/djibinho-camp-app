-- Create a table for Public Profiles
create table trainers (
  trainer_id uuid references auth.users not null,
  name text unique,

  primary key (trainer_id),
  constraint username_length check (char_length(name) >= 3)
);

alter table trainers enable row level security;

create policy "Name of a trainer is viewable by authenticated users."
  on trainers for select
  using ( auth.role() = 'authenticated' );

