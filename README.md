# Family Budget

SSR-first семейный бюджет на Next.js 15 (App Router) с маршрутами по разделам (`/accounts`, `/transactions`, `/loans`, `/savings`, `/investments`, `/upcoming`, `/settings`).

## Текущий стек

- Next.js 15
- TypeScript
- Tailwind CSS
- shadcn/ui
- lucide-react
- next-themes

## MVP Backend/DB решение

Выбранный стек для backend:
- Next.js Route Handlers + Server Actions
- Supabase PostgreSQL
- Supabase Auth
- Supabase Realtime
- RLS policies для изоляции данных бюджета

Подробный документ:
- [MVP Backend & Database Plan](docs/mvp-backend-plan.md)
- [Supabase SQL Setup](docs/supabase/README.md)

## Supabase Setup

1. Создайте `.env.local` на базе `.env.example`.
2. Заполните:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. В Supabase SQL Editor выполните:
   1. `docs/supabase/schema.sql`
   2. `docs/supabase/rls.sql`
   3. `docs/supabase/rpc.sql`
4. Включите Email provider в Supabase Auth.

После этого доступны:
- `/auth` — вход по magic link
- `/onboarding` — создание бюджета и вступление по коду

## Автоматизация без ручного env

Можно работать без ручного редактирования env-файлов:

- приложение поддерживает переменные в формате `VAR` и `VAR_FILE` (Docker secrets),
- генератор env: `npm run env:generate` (создаёт `.env.local` из текущих переменных окружения),
- в CI/CD переменные берутся из GitHub Secrets.

Поддерживаемые ключи:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (или `SUPABASE_SERVICE_ROLE_KEY_FILE`)

## Docker

Локальный запуск через Docker:

1. Создайте секрет:
   - `secrets/SUPABASE_SERVICE_ROLE_KEY.txt`
2. Перед запуском экспортируйте:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Запустите:

```bash
docker compose up --build
```

## CI/CD

Workflow: `.github/workflows/ci-cd.yml`

Что делает:
1. Применяет Supabase migrations (`supabase db push`) при наличии секретов.
2. Собирает Docker image и пушит в GHCR.

Секреты GitHub:
- `SUPABASE_ACCESS_TOKEN`
- `SUPABASE_PROJECT_REF`
- `SUPABASE_DB_PASSWORD`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Локальный запуск

```bash
npm install
npm run dev
```

Откройте `http://localhost:3000`.

## Примечание по Node 25

В `package.json` добавлен `NODE_OPTIONS=--no-webstorage` для `dev/build/start`, чтобы избежать ошибки `localStorage.getItem is not a function` на Node 25.x.
