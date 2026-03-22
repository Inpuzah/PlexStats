# Mineplex Stats

Mineplex Stats is now scaffolded as a full-stack MVP:

- Next.js + React + TypeScript frontend/API
- PostgreSQL + Prisma for persistence
- Redis + BullMQ for caching and background jobs
- Sentry hooks for monitoring
- GitHub Actions CI for lint/build checks

## Stack

- Frontend/API: Next.js 15 (App Router)
- DB: PostgreSQL
- ORM: Prisma
- Cache + Queue: Redis + BullMQ
- Monitoring: Sentry (`@sentry/nextjs`)

## Quick Start

1. Copy env file:

```bash
cp .env.example .env
```

2. Start local services:

```bash
docker compose up -d
```

3. Install deps and generate Prisma client:

```bash
npm install
npm run prisma:generate
```

4. Create DB schema:

```bash
npx prisma migrate dev --name init
```

5. Run app:

```bash
npm run dev
```

6. (Optional) Run queue worker in a second terminal:

```bash
npm run worker:dev
```

## Key Endpoints

- `GET /api/health`
- `GET /api/stats/:player`

## Notes

- `fetchPlayerStats` currently returns deterministic placeholder stats.
- Replace that function with your Mineplex data source integration next.
