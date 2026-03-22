# MVP Backend & Database Plan

## Decision

- Backend: Next.js App Router (`Route Handlers` + `Server Actions`)
- Database: Supabase PostgreSQL
- Auth: Supabase Auth
- Realtime: Supabase Realtime
- Security: PostgreSQL RLS policies (tenant isolation by `budget_id`)

This stack is chosen for fast MVP delivery with:
- budget creation,
- joining by invite code,
- shared realtime updates between members.

## Core User Flows

1. User creates a budget and becomes `owner`.
2. Owner/admin creates invite code.
3. Another user joins via invite code.
4. All budget members see updates in realtime.

## Data Model (minimum)

- `budgets`
  - `id`, `name`, `currency`, `created_by`, `created_at`
- `budget_members`
  - `id`, `budget_id`, `user_id`, `role`, `created_at`
  - unique: (`budget_id`, `user_id`)
- `budget_invites`
  - `id`, `budget_id`, `code`, `expires_at`, `max_uses`, `used_count`, `created_by`, `created_at`
  - unique: (`code`)
- domain tables (all include `budget_id`):
  - `accounts`, `transactions`, `loans`, `savings`, `investments`

## Security (RLS)

- Enable RLS on all budget-related tables.
- Read/write allowed only for users present in `budget_members` of the same `budget_id`.
- `owner/admin` can create invites and manage members.
- `viewer` has read-only access.
- Direct client insertion into `budget_members` should be blocked.

## Join by Code

Create Postgres RPC function:
- `join_budget_by_code(p_code text)`

Behavior:
- validate invite existence and expiration,
- validate usage limits,
- insert member into `budget_members` (if not already present),
- increment `used_count`,
- return `budget_id`.

## Next.js Backend Layer

Server actions / route handlers:
- `createBudget(name)`
- `createInvite(budgetId, expiresAt, maxUses)`
- `joinBudget(code)` (calls RPC)
- CRUD for domain entities scoped by `budget_id`

Required env:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-only)

## Realtime

- Subscribe to table changes filtered by active `budget_id`.
- Apply optimistic UI updates and reconcile with realtime payloads.

## Implementation Sequence

1. Add Supabase clients (browser/server/admin).
2. Create SQL schema + RLS + RPC.
3. Add onboarding pages:
   - create budget,
   - join by code.
4. Add active budget context selection.
5. Connect all budget routes to Supabase data.
6. Add realtime subscriptions.
7. Add audit log and basic rate limits for invite join.
