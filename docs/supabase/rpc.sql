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
