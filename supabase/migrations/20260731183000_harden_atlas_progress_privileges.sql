revoke all privileges on table public.user_progress from anon;
revoke all privileges on table public.daily_activity from anon;

revoke all privileges on table public.user_progress from authenticated;
revoke all privileges on table public.daily_activity from authenticated;

grant select, insert, update, delete on table public.user_progress to authenticated;
grant select, insert, delete on table public.daily_activity to authenticated;
