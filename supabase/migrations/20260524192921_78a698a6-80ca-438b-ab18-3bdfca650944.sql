
-- Mood logs (one per day per user)
create table public.user_mood_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  day date not null default (now() at time zone 'America/Argentina/Buenos_Aires')::date,
  mood text not null,
  created_at timestamptz not null default now(),
  unique (user_id, day)
);
alter table public.user_mood_logs enable row level security;
create policy "moods own select" on public.user_mood_logs for select using (auth.uid() = user_id);
create policy "moods own insert" on public.user_mood_logs for insert with check (auth.uid() = user_id);
create policy "moods own update" on public.user_mood_logs for update using (auth.uid() = user_id);
create policy "moods own delete" on public.user_mood_logs for delete using (auth.uid() = user_id);

-- Goals
create table public.user_goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  day date not null default (now() at time zone 'America/Argentina/Buenos_Aires')::date,
  text text not null,
  done boolean not null default false,
  position int not null default 0,
  created_at timestamptz not null default now()
);
alter table public.user_goals enable row level security;
create index user_goals_user_day_idx on public.user_goals(user_id, day);
create policy "goals own select" on public.user_goals for select using (auth.uid() = user_id);
create policy "goals own insert" on public.user_goals for insert with check (auth.uid() = user_id);
create policy "goals own update" on public.user_goals for update using (auth.uid() = user_id);
create policy "goals own delete" on public.user_goals for delete using (auth.uid() = user_id);

-- Habit ratings (history)
create table public.user_habit_ratings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  habit_id text not null,
  served boolean not null,
  rated_at timestamptz not null default now()
);
alter table public.user_habit_ratings enable row level security;
create index user_habit_ratings_user_idx on public.user_habit_ratings(user_id, rated_at desc);
create policy "habits own select" on public.user_habit_ratings for select using (auth.uid() = user_id);
create policy "habits own insert" on public.user_habit_ratings for insert with check (auth.uid() = user_id);
create policy "habits own delete" on public.user_habit_ratings for delete using (auth.uid() = user_id);

-- Technique log
create table public.user_technique_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  technique_id text not null,
  completed_at timestamptz not null default now()
);
alter table public.user_technique_log enable row level security;
create index user_technique_user_idx on public.user_technique_log(user_id, completed_at desc);
create policy "tech own select" on public.user_technique_log for select using (auth.uid() = user_id);
create policy "tech own insert" on public.user_technique_log for insert with check (auth.uid() = user_id);
create policy "tech own delete" on public.user_technique_log for delete using (auth.uid() = user_id);

-- Explora saved
create table public.user_explora_saved (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  item_id text not null,
  item_type text not null check (item_type in ('event','place')),
  saved_at timestamptz not null default now(),
  unique (user_id, item_id, item_type)
);
alter table public.user_explora_saved enable row level security;
create policy "expl own select" on public.user_explora_saved for select using (auth.uid() = user_id);
create policy "expl own insert" on public.user_explora_saved for insert with check (auth.uid() = user_id);
create policy "expl own delete" on public.user_explora_saved for delete using (auth.uid() = user_id);
