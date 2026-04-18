-- Run this in your Supabase SQL Editor

-- 1. Create the rooms table
create table public.rooms (
  id text primary key,
  prompt jsonb not null,
  mode text not null,
  level int not null,
  time_limit bigint not null,
  voting_time bigint not null,
  status text not null,
  timer_ends_at bigint,
  host_id uuid not null,
  created_at bigint not null
);

-- 2. Create the players table
create table public.players (
  id uuid primary key,
  room_id text references public.rooms(id) on delete cascade not null,
  name text not null,
  figma_link text,
  voted_for uuid,
  score bigint default 0,
  joined_at bigint not null
);

-- 3. Enable realtime for both tables
alter publication supabase_realtime add table rooms;
alter publication supabase_realtime add table players;

-- 4. Set up permissive RLS (Row Level Security) for MVP
alter table public.rooms enable row level security;
alter table public.players enable row level security;

-- Create policies to allow ALL operations (public access) for this MVP
create policy "Allow all operations for rooms" on public.rooms
  for all using (true) with check (true);

create policy "Allow all operations for players" on public.players
  for all using (true) with check (true);
