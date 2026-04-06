-- Run once in Supabase: SQL Editor → New query → paste → Run

create table if not exists public.leaderboard (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  score integer not null,
  created_at timestamptz not null default now(),
  constraint leaderboard_name_len check (char_length(trim(name)) between 1 and 14),
  constraint leaderboard_score_nonneg check (score >= 0)
);

create index if not exists leaderboard_score_desc on public.leaderboard (score desc);

alter table public.leaderboard enable row level security;

drop policy if exists "leaderboard_select_public" on public.leaderboard;
drop policy if exists "leaderboard_insert_public" on public.leaderboard;

create policy "leaderboard_select_public"
  on public.leaderboard for select
  using (true);

create policy "leaderboard_insert_public"
  on public.leaderboard for insert
  with check (true);

-- If you already created the table with a 24-character limit, run:
-- alter table public.leaderboard drop constraint if exists leaderboard_name_len;
-- alter table public.leaderboard add constraint leaderboard_name_len check (char_length(trim(name)) between 1 and 14);
