-- ============================================================
-- SkinBase Database Schema
-- PASTE THIS IN SUPABASE SQL EDITOR (Dashboard → SQL Editor)
-- ============================================================

-- Profiles table (extends Supabase auth.users)
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text,
  name text,
  skin_type text,
  concerns text[],
  experience text,
  is_pro boolean default false,
  stripe_customer_id text,
  stripe_subscription_id text,
  subscription_status text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Routines table
create table if not exists public.routines (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  am_slots jsonb default '{}',
  pm_slots jsonb default '{}',
  updated_at timestamptz default now()
);

-- Streaks/check-ins
create table if not exists public.checkins (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  date date not null,
  am_done boolean default false,
  pm_done boolean default false,
  created_at timestamptz default now(),
  unique(user_id, date)
);

-- Progress photos
create table if not exists public.progress_photos (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  storage_path text not null,
  taken_at timestamptz default now(),
  notes text
);

-- RLS policies
alter table public.profiles enable row level security;
alter table public.routines enable row level security;
alter table public.checkins enable row level security;
alter table public.progress_photos enable row level security;

-- Drop policies if they already exist (safe re-run)
drop policy if exists "Users can view own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Users can insert own profile" on public.profiles;
drop policy if exists "Users can view own routines" on public.routines;
drop policy if exists "Users can view own checkins" on public.checkins;
drop policy if exists "Users can manage own photos" on public.progress_photos;

create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "Users can view own routines" on public.routines for all using (auth.uid() = user_id);
create policy "Users can view own checkins" on public.checkins for all using (auth.uid() = user_id);
create policy "Users can manage own photos" on public.progress_photos for all using (auth.uid() = user_id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
