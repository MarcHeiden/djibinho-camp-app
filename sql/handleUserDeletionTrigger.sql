-- delete a row in public.trainers
create function public.delete_user() 
returns trigger 
language plpgsql 
security definer set search_path = public
as $$
begin
  delete from trainers where (old.id = trainer_id);
  return old;
end;
$$;

-- trigger the function every time a user is deleted
create trigger on_auth_user_deleted
  before delete on auth.users
  for each row execute procedure public.delete_user();