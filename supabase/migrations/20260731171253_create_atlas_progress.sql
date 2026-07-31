create table public.user_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id text not null,
  completed boolean not null default false,
  score smallint not null default 0 check (score between 0 and 100),
  confidence smallint not null default 50 check (confidence between 0 and 100),
  attempts integer not null default 0 check (attempts >= 0),
  bookmarked boolean not null default false,
  last_reviewed timestamptz,
  next_review timestamptz,
  updated_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

create table public.daily_activity (
  user_id uuid not null references auth.users(id) on delete cascade,
  activity_date date not null,
  created_at timestamptz not null default now(),
  primary key (user_id, activity_date)
);

alter table public.user_progress enable row level security;
alter table public.daily_activity enable row level security;

create policy "Users can read their own progress"
on public.user_progress for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can insert their own progress"
on public.user_progress for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "Users can update their own progress"
on public.user_progress for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Users can delete their own progress"
on public.user_progress for delete
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can read their own activity"
on public.daily_activity for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can insert their own activity"
on public.daily_activity for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "Users can delete their own activity"
on public.daily_activity for delete
to authenticated
using ((select auth.uid()) = user_id);

grant select, insert, update, delete on public.user_progress to authenticated;
grant select, insert, delete on public.daily_activity to authenticated;

comment on table public.user_progress is 'Private per-user lesson progress for Atlas of Why.';
comment on table public.daily_activity is 'Private per-user activity dates used to calculate learning streaks.';
