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
