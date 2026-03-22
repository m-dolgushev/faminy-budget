# Supabase SQL Setup

Run files in this order inside Supabase SQL Editor:

1. `schema.sql`
2. `rls.sql`
3. `rpc.sql`

After applying SQL:
- enable Email auth provider in Supabase Auth,
- set environment variables in `.env.local`,
- restart Next.js dev server.
