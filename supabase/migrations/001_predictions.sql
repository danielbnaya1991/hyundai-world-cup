-- Predictions table
create table public.predictions (
  id uuid primary key default gen_random_uuid(),
  serial_number text unique not null,
  full_name text not null,
  email text not null,
  phone text not null,
  id_number text not null,
  team_a text not null,
  team_b text not null,
  score_a integer not null check (score_a >= 0 and score_a <= 20),
  score_b integer not null check (score_b >= 0 and score_b <= 20),
  created_at timestamptz not null default now()
);

-- Unique constraints: one prediction per email OR per Israeli ID
create unique index idx_predictions_email on public.predictions(email);
create unique index idx_predictions_id_number on public.predictions(id_number);

-- Atomic serial counter
create table public.serial_counter (
  id integer primary key default 1 check (id = 1),
  current_value integer not null default 0
);

-- Initialize counter
insert into public.serial_counter (id, current_value) values (1, 0);

-- RPC function to generate the next serial number atomically
create or replace function public.generate_serial_number()
returns text
language plpgsql
security definer
as $$
declare
  next_val integer;
begin
  update public.serial_counter
  set current_value = current_value + 1
  where id = 1
  returning current_value into next_val;

  return 'HYD-2026-' || lpad(next_val::text, 5, '0');
end;
$$;

-- RLS: Enable on predictions
alter table public.predictions enable row level security;

-- Policy: service role can do everything (no anon access needed since we use service role in API)
create policy "Service role full access"
  on public.predictions
  for all
  using (true)
  with check (true);

-- RLS on serial_counter
alter table public.serial_counter enable row level security;

create policy "Service role full access on counter"
  on public.serial_counter
  for all
  using (true)
  with check (true);
