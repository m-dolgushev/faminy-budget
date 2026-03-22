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

alter table public.budgets enable row level security;
alter table public.budget_members enable row level security;
alter table public.budget_invites enable row level security;
alter table public.accounts enable row level security;
alter table public.transactions enable row level security;
alter table public.loans enable row level security;
alter table public.savings enable row level security;
alter table public.investments enable row level security;

create or replace function public.is_budget_member(p_budget_id uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.budget_members bm
    where bm.budget_id = p_budget_id
      and bm.user_id = auth.uid()
  );
$$;

create or replace function public.has_budget_write_access(p_budget_id uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.budget_members bm
    where bm.budget_id = p_budget_id
      and bm.user_id = auth.uid()
      and bm.role in ('owner', 'admin')
  );
$$;

drop policy if exists budgets_select_member on public.budgets;
create policy budgets_select_member on public.budgets
for select using (public.is_budget_member(id));

drop policy if exists budgets_insert_self on public.budgets;
create policy budgets_insert_self on public.budgets
for insert with check (created_by = auth.uid());

drop policy if exists budgets_update_owner on public.budgets;
create policy budgets_update_owner on public.budgets
for update using (public.has_budget_write_access(id))
with check (public.has_budget_write_access(id));

drop policy if exists budget_members_select_member on public.budget_members;
create policy budget_members_select_member on public.budget_members
for select using (public.is_budget_member(budget_id));

drop policy if exists budget_members_delete_owner on public.budget_members;
create policy budget_members_delete_owner on public.budget_members
for delete using (public.has_budget_write_access(budget_id));

drop policy if exists budget_invites_read_admin on public.budget_invites;
create policy budget_invites_read_admin on public.budget_invites
for select using (public.has_budget_write_access(budget_id));

drop policy if exists budget_invites_insert_admin on public.budget_invites;
create policy budget_invites_insert_admin on public.budget_invites
for insert with check (public.has_budget_write_access(budget_id) and created_by = auth.uid());

drop policy if exists budget_invites_delete_admin on public.budget_invites;
create policy budget_invites_delete_admin on public.budget_invites
for delete using (public.has_budget_write_access(budget_id));

drop policy if exists accounts_read_member on public.accounts;
create policy accounts_read_member on public.accounts
for select using (public.is_budget_member(budget_id));

drop policy if exists accounts_write_admin on public.accounts;
create policy accounts_write_admin on public.accounts
for all using (public.has_budget_write_access(budget_id))
with check (public.has_budget_write_access(budget_id));

drop policy if exists transactions_read_member on public.transactions;
create policy transactions_read_member on public.transactions
for select using (public.is_budget_member(budget_id));

drop policy if exists transactions_write_admin on public.transactions;
create policy transactions_write_admin on public.transactions
for all using (public.has_budget_write_access(budget_id))
with check (public.has_budget_write_access(budget_id));

drop policy if exists loans_read_member on public.loans;
create policy loans_read_member on public.loans
for select using (public.is_budget_member(budget_id));

drop policy if exists loans_write_admin on public.loans;
create policy loans_write_admin on public.loans
for all using (public.has_budget_write_access(budget_id))
with check (public.has_budget_write_access(budget_id));

drop policy if exists savings_read_member on public.savings;
create policy savings_read_member on public.savings
for select using (public.is_budget_member(budget_id));

drop policy if exists savings_write_admin on public.savings;
create policy savings_write_admin on public.savings
for all using (public.has_budget_write_access(budget_id))
with check (public.has_budget_write_access(budget_id));

drop policy if exists investments_read_member on public.investments;
create policy investments_read_member on public.investments
for select using (public.is_budget_member(budget_id));

drop policy if exists investments_write_admin on public.investments;
create policy investments_write_admin on public.investments
for all using (public.has_budget_write_access(budget_id))
with check (public.has_budget_write_access(budget_id));

create or replace function public.create_budget_with_owner(
  p_name text,
  p_currency text default 'RUB'
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_budget_id uuid;
begin
  if auth.uid() is null then
    raise exception 'auth_required';
  end if;

  insert into public.budgets (name, currency, created_by)
  values (p_name, p_currency, auth.uid())
  returning id into v_budget_id;

  insert into public.budget_members (budget_id, user_id, role)
  values (v_budget_id, auth.uid(), 'owner')
  on conflict (budget_id, user_id) do nothing;

  return v_budget_id;
end;
$$;

grant execute on function public.create_budget_with_owner(text, text) to authenticated;

create or replace function public.join_budget_by_code(p_code text)
returns table (budget_id uuid)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_invite public.budget_invites%rowtype;
begin
  if auth.uid() is null then
    raise exception 'auth_required';
  end if;

  select *
  into v_invite
  from public.budget_invites bi
  where upper(bi.code) = upper(p_code);

  if not found then
    raise exception 'invite_not_found';
  end if;

  if v_invite.expires_at < now() then
    raise exception 'invite_expired';
  end if;

  if v_invite.used_count >= v_invite.max_uses then
    raise exception 'invite_limit_reached';
  end if;

  insert into public.budget_members (budget_id, user_id, role)
  values (v_invite.budget_id, auth.uid(), 'viewer')
  on conflict (budget_id, user_id) do nothing;

  update public.budget_invites
  set used_count = used_count + 1
  where id = v_invite.id;

  return query select v_invite.budget_id;
end;
$$;

grant execute on function public.join_budget_by_code(text) to authenticated;
