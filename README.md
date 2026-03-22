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

## Локальный запуск

```bash
npm install
npm run dev
```

Откройте `http://localhost:3000`.

## Примечание по Node 25

В `package.json` добавлен `NODE_OPTIONS=--no-webstorage` для `dev/build/start`, чтобы избежать ошибки `localStorage.getItem is not a function` на Node 25.x.
