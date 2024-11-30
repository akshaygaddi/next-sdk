create or replace function join_private_room(room_id uuid, room_password text)
returns boolean
language plpgsql
security definer
as $$
declare
correct_password text;
  user_id uuid;
begin
  -- Get the correct password for the room
select password into correct_password from rooms where id = room_id;

-- Check if the provided password is correct
if correct_password = room_password then
    -- Get the current user's ID
    user_id := auth.uid();

    -- Insert the user as a participant
insert into room_participants (room_id, user_id)
values (room_id, user_id)
    on conflict (room_id, user_id) do nothing;

return true;
else
    return false;
end if;
end;
$$;

