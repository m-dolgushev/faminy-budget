create extension if not exists pgcrypto;

create table if not exists public.budgets (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  currency text not null default 'RUB',
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.budget_members (
  id uuid primary key default gen_random_uuid(),
  budget_id uuid not null references public.budgets(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('owner', 'admin', 'viewer')),
  created_at timestamptz not null default now(),
  unique (budget_id, user_id)
);

create table if not exists public.budget_invites (
  id uuid primary key default gen_random_uuid(),
  budget_id uuid not null references public.budgets(id) on delete cascade,
  code text not null unique,
  expires_at timestamptz not null,
  max_uses integer not null default 20 check (max_uses > 0),
  used_count integer not null default 0 check (used_count >= 0),
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.accounts (
  id uuid primary key default gen_random_uuid(),
  budget_id uuid not null references public.budgets(id) on delete cascade,
  name text not null,
  type text not null check (type in ('card', 'cash', 'savings')),
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  budget_id uuid not null references public.budgets(id) on delete cascade,
  account_id uuid references public.accounts(id) on delete set null,
  type text not null check (type in ('income', 'expense', 'transfer')),
  category text not null,
  amount numeric(14,2) not null check (amount >= 0),
  date date not null,
  description text not null default '',
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.loans (
  id uuid primary key default gen_random_uuid(),
  budget_id uuid not null references public.budgets(id) on delete cascade,
  name text not null,
  type text not null check (type in ('credit', 'installment', 'personal')),
  initial_amount numeric(14,2) not null check (initial_amount >= 0),
  current_balance numeric(14,2) not null check (current_balance >= 0),
  interest_rate numeric(7,3) not null default 0,
  term_months integer not null check (term_months > 0),
  start_date date not null,
  monthly_payment numeric(14,2) not null check (monthly_payment >= 0),
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.savings (
  id uuid primary key default gen_random_uuid(),
  budget_id uuid not null references public.budgets(id) on delete cascade,
  name text not null,
  current_amount numeric(14,2) not null default 0 check (current_amount >= 0),
  target_amount numeric(14,2) not null check (target_amount > 0),
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.investments (
  id uuid primary key default gen_random_uuid(),
  budget_id uuid not null references public.budgets(id) on delete cascade,
  ticker text not null,
  name text not null,
  quantity numeric(14,4) not null check (quantity >= 0),
  price numeric(14,4) not null check (price >= 0),
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
